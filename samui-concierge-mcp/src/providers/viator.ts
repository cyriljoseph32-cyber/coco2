/** Viator Partner API (affiliate) provider — bookable tours & activities. */

import { VIATOR_BASE, DEFAULT_CURRENCY } from "../constants.js";
import { requestJson, HttpError } from "../http.js";
import type { Listing } from "../types.js";

function getKey(): string {
  const key = process.env.VIATOR_API_KEY;
  if (!key) {
    throw new HttpError(
      401,
      "Viator",
      "VIATOR_API_KEY is not set. Apply for the Viator Partner/Affiliate API at https://www.viator.com/partner and add the key to .env. (Approval can take a few days.)",
    );
  }
  return key;
}

function headers(): Record<string, string> {
  return {
    "exp-api-key": getKey(),
    Accept: "application/json;version=2.0",
    "Accept-Language": "en-US",
  };
}

interface ViatorProduct {
  productCode: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  reviews?: { combinedAverageRating?: number; totalReviews?: number };
  pricing?: { summary?: { fromPrice?: number }; currency?: string };
  duration?: { fixedDurationInMinutes?: number };
  images?: { variants?: { url?: string }[] }[];
  productUrl?: string;
}

function withAffiliate(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const pid = process.env.VIATOR_AFFILIATE_PID;
  if (!pid) return url;
  return url.includes("?") ? `${url}&pid=${pid}` : `${url}?pid=${pid}`;
}

function toListing(p: ViatorProduct): Listing {
  return {
    source: "viator",
    sourceId: p.productCode,
    name: p.title ?? "(untitled tour)",
    category: "activity",
    rating: p.reviews?.combinedAverageRating,
    reviewCount: p.reviews?.totalReviews,
    priceFrom: p.pricing?.summary?.fromPrice,
    currency: p.pricing?.currency ?? DEFAULT_CURRENCY,
    durationMinutes: p.duration?.fixedDurationInMinutes,
    photoUrl: p.images?.[0]?.variants?.slice(-1)[0]?.url,
    bookingUrl: withAffiliate(p.productUrl),
    description: p.shortDescription ?? p.description,
    cacheable: true, // Viator allows caching with short TTL (<24h).
    fetchedAt: new Date().toISOString(),
  };
}

/** Free-text product search (e.g. "Koh Samui snorkeling", "Ang Thong tour"). */
export async function searchActivities(
  query: string,
  limit: number,
): Promise<Listing[]> {
  const data = await requestJson<{
    products?: { results?: ViatorProduct[] };
  }>(`${VIATOR_BASE}/search/freetext`, {
    method: "POST",
    provider: "Viator",
    headers: headers(),
    body: {
      searchTerm: query,
      currency: DEFAULT_CURRENCY,
      productFiltering: {},
      searchTypes: [
        {
          searchType: "PRODUCTS",
          pagination: { start: 1, count: Math.min(limit, 30) },
        },
      ],
    },
    ttlMs: 60 * 60 * 1000, // 1h — pricing/availability change.
  });
  return (data.products?.results ?? []).map(toListing);
}

/** Full detail for one product code. */
export async function getActivityDetails(productCode: string): Promise<Listing> {
  const p = await requestJson<ViatorProduct>(
    `${VIATOR_BASE}/products/${encodeURIComponent(productCode)}`,
    {
      provider: "Viator",
      headers: headers(),
      ttlMs: 60 * 60 * 1000,
    },
  );
  return toListing(p);
}
