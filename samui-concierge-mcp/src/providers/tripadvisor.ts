/**
 * TripAdvisor Content API provider.
 *
 * IMPORTANT — TripAdvisor licence: you may NOT cache or store the returned
 * content, except the location_id. Ratings/reviews must be displayed live and
 * attributed. Every Listing from here is flagged `cacheable: false` so the
 * concierge knows to fetch it on demand and never persist it.
 */

import { TRIPADVISOR_BASE, SAMUI_CENTER } from "../constants.js";
import { requestJson, HttpError } from "../http.js";
import type { Listing } from "../types.js";

function getKey(): string {
  const key = process.env.TRIPADVISOR_API_KEY;
  if (!key) {
    throw new HttpError(
      401,
      "TripAdvisor",
      "TRIPADVISOR_API_KEY is not set. Apply for the Content API at https://www.tripadvisor.com/developers and add the key to .env. Note: storing/caching TripAdvisor content is not permitted (location_id only).",
    );
  }
  return key;
}

interface TaSearchItem {
  location_id: string;
  name: string;
  address_obj?: { address_string?: string };
}

interface TaDetails {
  location_id: string;
  name: string;
  rating?: string;
  num_reviews?: string;
  ranking_data?: { ranking_string?: string };
  web_url?: string;
  description?: string;
  category?: { name?: string };
}

/**
 * Find a TripAdvisor location_id by name. Returns lightweight candidates.
 * The location_id is the ONLY field safe to store in your database.
 */
export async function searchLocation(
  query: string,
  category?: "hotels" | "attractions" | "restaurants" | "geos",
): Promise<{ locationId: string; name: string; address?: string }[]> {
  const key = getKey();
  const params = new URLSearchParams({
    key,
    searchQuery: query,
    latLong: `${SAMUI_CENTER.latitude},${SAMUI_CENTER.longitude}`,
    language: "en",
  });
  if (category) params.set("category", category);

  const data = await requestJson<{ data?: TaSearchItem[] }>(
    `${TRIPADVISOR_BASE}/location/search?${params.toString()}`,
    { provider: "TripAdvisor", ttlMs: 0 }, // never cache content
  );
  return (data.data ?? []).map((i) => ({
    locationId: i.location_id,
    name: i.name,
    address: i.address_obj?.address_string,
  }));
}

/** Live rating/review detail for a location_id. Display-only, never stored. */
export async function getLocationDetails(locationId: string): Promise<Listing> {
  const key = getKey();
  const d = await requestJson<TaDetails>(
    `${TRIPADVISOR_BASE}/location/${encodeURIComponent(locationId)}/details?key=${key}&language=en`,
    { provider: "TripAdvisor", ttlMs: 0 },
  );
  return {
    source: "tripadvisor",
    sourceId: d.location_id,
    name: d.name,
    category: d.category?.name,
    rating: d.rating ? Number(d.rating) : undefined,
    reviewCount: d.num_reviews ? Number(d.num_reviews) : undefined,
    bookingUrl: d.web_url,
    description: d.ranking_data?.ranking_string ?? d.description,
    cacheable: false, // licence: display live, do not store (location_id excepted)
    fetchedAt: new Date().toISOString(),
  };
}
