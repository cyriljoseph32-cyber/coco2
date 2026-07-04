#!/usr/bin/env node
/**
 * Samui Concierge MCP Server
 *
 * Enriches the Coco Koh Samui concierge database with live, structured listings:
 *  - Google Places (New): restaurants, POI, ratings, hours
 *  - Viator Partner API: bookable tours & activities (+ affiliate commission)
 *  - TripAdvisor Content API: live ratings/reviews (display-only, not stored)
 *  - Klook / GetYourGuide / Viator: affiliate booking deep links
 *
 * Transport: stdio (launched locally by the Claude app — see DEPLOY.md).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { CHARACTER_LIMIT } from "./constants.js";
import { ResponseFormat, type Listing } from "./types.js";
import { describeError } from "./http.js";
import * as google from "./providers/google.js";
import * as viator from "./providers/viator.js";
import * as tripadvisor from "./providers/tripadvisor.js";
import { buildAllLinks } from "./providers/affiliate.js";

// ─────────────────────────── helpers ───────────────────────────

function listingLine(l: Listing): string {
  const bits: string[] = [`## ${l.name} (${l.source}:${l.sourceId})`];
  if (l.category) bits.push(`- Category: ${l.category}`);
  if (l.area) bits.push(`- Area: ${l.area}`);
  if (l.address) bits.push(`- Address: ${l.address}`);
  if (l.rating != null)
    bits.push(`- Rating: ${l.rating}★${l.reviewCount ? ` (${l.reviewCount} reviews)` : ""}`);
  if (l.priceFrom != null)
    bits.push(`- From: ${l.priceFrom} ${l.currency ?? ""}`.trim());
  if (l.durationMinutes != null) bits.push(`- Duration: ${l.durationMinutes} min`);
  if (l.bookingUrl) bits.push(`- Book: ${l.bookingUrl}`);
  if (l.description) bits.push(`- ${l.description}`);
  if (!l.cacheable) bits.push(`- ⚠️ Display live only — do NOT store (licence).`);
  return bits.join("\n");
}

function renderListings(
  title: string,
  listings: Listing[],
  format: ResponseFormat,
) {
  const output = { count: listings.length, listings };
  let text: string;
  if (format === ResponseFormat.JSON) {
    text = JSON.stringify(output, null, 2);
  } else {
    text =
      listings.length === 0
        ? `No results for ${title}.`
        : [`# ${title} (${listings.length})`, "", ...listings.map(listingLine)].join("\n\n");
  }
  if (text.length > CHARACTER_LIMIT) {
    const half = Math.max(1, Math.floor(listings.length / 2));
    const trimmed = listings.slice(0, half);
    text =
      JSON.stringify(
        {
          count: trimmed.length,
          listings: trimmed,
          truncated: true,
          truncation_message: `Truncated from ${listings.length} to ${trimmed.length}. Lower 'limit' or refine the query.`,
        },
        null,
        2,
      );
  }
  return { content: [{ type: "text" as const, text }], structuredContent: output };
}

function errorResult(err: unknown) {
  return { content: [{ type: "text" as const, text: describeError(err) }], isError: true };
}

/** MCP requires structuredContent to be an index-signature object. */
const asRecord = (o: unknown): Record<string, unknown> => o as Record<string, unknown>;

// ─────────────────────────── server ───────────────────────────

const server = new McpServer({ name: "samui-concierge-mcp-server", version: "1.0.0" });

const FormatField = {
  response_format: z
    .nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' (human) or 'json' (machine)"),
};

const SearchInput = z
  .object({
    query: z.string().min(2).max(200).describe("Search terms, e.g. 'sushi', 'snorkeling tour'"),
    limit: z.number().int().min(1).max(30).default(10).describe("Max results"),
    ...FormatField,
  })
  .strict();

// 1) Restaurants / POI via Google Places
server.registerTool(
  "samui_search_restaurants",
  {
    title: "Search Restaurants & Places (Google)",
    description:
      "Search restaurants, cafés, bars and points of interest on Koh Samui via Google Places (New). Returns name, rating, review count, price level (0-4), address and a photo. Results are biased to the island. Use for food/POI enrichment. Args: query, limit (1-30), response_format. Requires GOOGLE_PLACES_API_KEY.",
    inputSchema: SearchInput,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ query, limit, response_format }) => {
    try {
      return renderListings(`Places: ${query}`, await google.searchPlaces(query, limit), response_format);
    } catch (err) {
      return errorResult(err);
    }
  },
);

// 2) Place details via Google Places
server.registerTool(
  "samui_get_place_details",
  {
    title: "Get Place Details (Google)",
    description:
      "Get full detail for one Google place_id: rating, review count, price level, address, opening hours (per weekday), website and phone. Use after samui_search_restaurants to enrich a single listing. Args: place_id, response_format. Requires GOOGLE_PLACES_API_KEY.",
    inputSchema: z.object({ place_id: z.string().min(3).describe("Google place_id"), ...FormatField }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ place_id, response_format }) => {
    try {
      const d = await google.getPlaceDetails(place_id);
      if (response_format === ResponseFormat.JSON) {
        return { content: [{ type: "text", text: JSON.stringify(d, null, 2) }], structuredContent: asRecord(d) };
      }
      const extra: string[] = [];
      if (d.openingHours) extra.push(`\n- Hours:\n  ${d.openingHours.join("\n  ")}`);
      if (d.website) extra.push(`- Website: ${d.website}`);
      if (d.phone) extra.push(`- Phone: ${d.phone}`);
      return {
        content: [{ type: "text", text: `${listingLine(d)}\n${extra.join("\n")}` }],
        structuredContent: asRecord(d),
      };
    } catch (err) {
      return errorResult(err);
    }
  },
);

// 3) Activities via Viator
server.registerTool(
  "samui_search_activities",
  {
    title: "Search Tours & Activities (Viator)",
    description:
      "Search bookable tours and activities relevant to Koh Samui via the Viator Partner API (e.g. 'Ang Thong tour', 'snorkeling', 'cooking class'). Returns title, rating, price from, duration, photo and an affiliate booking URL (commission). Args: query, limit (1-30), response_format. Requires VIATOR_API_KEY.",
    inputSchema: SearchInput,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ query, limit, response_format }) => {
    try {
      return renderListings(`Activities: ${query}`, await viator.searchActivities(query, limit), response_format);
    } catch (err) {
      return errorResult(err);
    }
  },
);

// 4) Activity details via Viator
server.registerTool(
  "samui_get_activity_details",
  {
    title: "Get Activity Details (Viator)",
    description:
      "Get full detail for one Viator product code: title, description, rating, price from, duration, photo and affiliate booking URL. Args: product_code, response_format. Requires VIATOR_API_KEY.",
    inputSchema: z.object({ product_code: z.string().min(3).describe("Viator productCode"), ...FormatField }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ product_code, response_format }) => {
    try {
      const d = await viator.getActivityDetails(product_code);
      return response_format === ResponseFormat.JSON
        ? { content: [{ type: "text", text: JSON.stringify(d, null, 2) }], structuredContent: asRecord(d) }
        : { content: [{ type: "text", text: listingLine(d) }], structuredContent: asRecord(d) };
    } catch (err) {
      return errorResult(err);
    }
  },
);

// 5) TripAdvisor location search (returns storable location_id only)
server.registerTool(
  "samui_tripadvisor_search",
  {
    title: "Find TripAdvisor location_id",
    description:
      "Find a TripAdvisor location_id by name (the ONLY field you may store — content itself cannot be cached). Args: query, category ('hotels'|'attractions'|'restaurants'|'geos'), response_format. Requires TRIPADVISOR_API_KEY.",
    inputSchema: z
      .object({
        query: z.string().min(2).max(200).describe("Name to look up"),
        category: z.enum(["hotels", "attractions", "restaurants", "geos"]).optional().describe("Filter by type"),
        ...FormatField,
      })
      .strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ query, category, response_format }) => {
    try {
      const items = await tripadvisor.searchLocation(query, category);
      if (response_format === ResponseFormat.JSON) {
        return { content: [{ type: "text", text: JSON.stringify({ count: items.length, items }, null, 2) }], structuredContent: { count: items.length, items } };
      }
      const text = items.length
        ? items.map((i) => `- ${i.name} → location_id ${i.locationId}${i.address ? ` (${i.address})` : ""}`).join("\n")
        : `No TripAdvisor location for '${query}'.`;
      return { content: [{ type: "text", text }], structuredContent: { count: items.length, items } };
    } catch (err) {
      return errorResult(err);
    }
  },
);

// 6) TripAdvisor live rating (display only)
server.registerTool(
  "samui_tripadvisor_rating",
  {
    title: "Get TripAdvisor Live Rating",
    description:
      "Get the live TripAdvisor rating, review count and ranking for a location_id. Display-only: this content must NOT be stored in your database (cacheable=false). Args: location_id, response_format. Requires TRIPADVISOR_API_KEY.",
    inputSchema: z.object({ location_id: z.string().min(2).describe("TripAdvisor location_id"), ...FormatField }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ location_id, response_format }) => {
    try {
      const d = await tripadvisor.getLocationDetails(location_id);
      return response_format === ResponseFormat.JSON
        ? { content: [{ type: "text", text: JSON.stringify(d, null, 2) }], structuredContent: asRecord(d) }
        : { content: [{ type: "text", text: listingLine(d) }], structuredContent: asRecord(d) };
    } catch (err) {
      return errorResult(err);
    }
  },
);

// 7) Affiliate booking links (no API approval needed)
server.registerTool(
  "samui_booking_links",
  {
    title: "Build Affiliate Booking Links",
    description:
      "Build monetizable Klook, GetYourGuide and Viator search links for a query. No API approval needed — just affiliate IDs in .env. Returns each link plus whether it is configured to earn commission. Attach these to any Coco activity recommendation. Args: query.",
    inputSchema: z.object({ query: z.string().min(2).max(200).describe("Activity/experience, e.g. 'Ang Thong kayaking'") }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ query }) => {
    const links = buildAllLinks(query);
    const text = links
      .map((l) => `- ${l.provider}: ${l.url}${l.configured ? " ✅" : ` ⚠️ ${l.note}`}`)
      .join("\n");
    return { content: [{ type: "text", text }], structuredContent: { query, links } };
  },
);

// 8) WORKFLOW: enrich one curated listing across every source
server.registerTool(
  "samui_enrich_listing",
  {
    title: "Enrich a Curated Listing (all sources)",
    description:
      "Workflow tool: take one item from your hand-written Coco database (by name + type) and enrich it across every source in one call — Google place data, live TripAdvisor rating, and Viator/affiliate booking links. Returns a merged record plus a 'storable' subset containing only fields you are allowed to persist (IDs + cacheable data; TripAdvisor content is returned live but flagged not-storable). Per-source failures are reported in 'errors' without failing the whole call. Args: name, type ('restaurant'|'hotel'|'attraction'|'activity'), response_format.",
    inputSchema: z
      .object({
        name: z.string().min(2).max(200).describe("Listing name as it appears in your DB"),
        type: z.enum(["restaurant", "hotel", "attraction", "activity"]).describe("What kind of listing"),
        ...FormatField,
      })
      .strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ name, type, response_format }) => {
    const errors: { provider: string; message: string }[] = [];
    let googleData: Awaited<ReturnType<typeof google.getPlaceDetails>> | undefined;
    let taData: Listing | undefined;
    let viatorTop: Listing | undefined;

    // Google for physical places
    if (type !== "activity") {
      try {
        const hits = await google.searchPlaces(name, 1);
        if (hits[0]) googleData = await google.getPlaceDetails(hits[0].sourceId);
      } catch (err) {
        errors.push({ provider: "google", message: describeError(err) });
      }
    }

    // Viator for activities
    if (type === "activity") {
      try {
        viatorTop = (await viator.searchActivities(name, 1))[0];
      } catch (err) {
        errors.push({ provider: "viator", message: describeError(err) });
      }
    }

    // TripAdvisor live rating
    try {
      const taCat =
        type === "restaurant" ? "restaurants" : type === "hotel" ? "hotels" : "attractions";
      const found = await tripadvisor.searchLocation(name, taCat);
      if (found[0]) taData = await tripadvisor.getLocationDetails(found[0].locationId);
    } catch (err) {
      errors.push({ provider: "tripadvisor", message: describeError(err) });
    }

    const links = buildAllLinks(name);

    // 'storable' = only what you are allowed to persist in your DB.
    const storable = {
      name,
      type,
      google_place_id: googleData?.sourceId,
      google_rating: googleData?.rating,
      google_review_count: googleData?.reviewCount,
      google_price_level: googleData?.priceFrom,
      address: googleData?.address,
      website: googleData?.website,
      phone: googleData?.phone,
      viator_product_code: viatorTop?.sourceId,
      viator_price_from: viatorTop?.priceFrom,
      viator_currency: viatorTop?.currency,
      tripadvisor_location_id: taData?.sourceId, // only the ID is storable
      affiliate_links: links.map((l) => ({ provider: l.provider, url: l.url })),
      enriched_at: new Date().toISOString(),
    };

    const output = {
      name,
      type,
      live: { google: googleData, tripadvisor: taData, viator: viatorTop },
      booking_links: links,
      storable,
      errors,
    };

    if (response_format === ResponseFormat.JSON) {
      return { content: [{ type: "text", text: JSON.stringify(output, null, 2) }], structuredContent: output };
    }

    const md: string[] = [`# Enriched: ${name} (${type})`, ""];
    if (googleData) md.push(listingLine(googleData));
    if (taData) md.push("", listingLine(taData));
    if (viatorTop) md.push("", listingLine(viatorTop));
    md.push("", "## Booking links", ...links.map((l) => `- ${l.provider}: ${l.url}${l.configured ? " ✅" : " ⚠️"}`));
    md.push("", "## Storable subset", "```json", JSON.stringify(storable, null, 2), "```");
    if (errors.length) md.push("", "## Notes", ...errors.map((e) => `- ${e.provider}: ${e.message}`));
    return { content: [{ type: "text", text: md.join("\n") }], structuredContent: output };
  },
);

// ─────────────────────────── transport ───────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("samui-concierge-mcp-server running (stdio)");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
