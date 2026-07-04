/** Google Places API (New) provider — restaurants, POI, live ratings/hours. */

import {
  GOOGLE_PLACES_BASE,
  SAMUI_CENTER,
  SAMUI_RADIUS_M,
} from "../constants.js";
import { requestJson, HttpError } from "../http.js";
import type { Listing } from "../types.js";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.types",
  "places.location",
  "places.photos",
].join(",");

const DETAIL_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "rating",
  "userRatingCount",
  "priceLevel",
  "types",
  "location",
  "photos",
  "currentOpeningHours",
  "websiteUri",
  "internationalPhoneNumber",
  "editorialSummary",
].join(",");

const PRICE_LEVEL_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  types?: string[];
  photos?: { name: string }[];
  websiteUri?: string;
  internationalPhoneNumber?: string;
  editorialSummary?: { text: string };
  currentOpeningHours?: { weekdayDescriptions?: string[] };
}

function getKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    throw new HttpError(
      401,
      "Google Places",
      "GOOGLE_PLACES_API_KEY is not set. Get one at https://console.cloud.google.com (enable 'Places API (New)'), then add it to .env.",
    );
  }
  return key;
}

function photoUrl(place: GooglePlace, key: string): string | undefined {
  const name = place.photos?.[0]?.name;
  if (!name) return undefined;
  return `${GOOGLE_PLACES_BASE}/${name}/media?maxWidthPx=800&key=${key}`;
}

function toListing(place: GooglePlace, key: string): Listing {
  return {
    source: "google",
    sourceId: place.id,
    name: place.displayName?.text ?? "(unnamed)",
    category: place.types?.[0]?.replace(/_/g, " "),
    address: place.formattedAddress,
    rating: place.rating,
    reviewCount: place.userRatingCount,
    priceFrom:
      place.priceLevel != null ? PRICE_LEVEL_MAP[place.priceLevel] : undefined,
    photoUrl: photoUrl(place, key),
    description: place.editorialSummary?.text,
    cacheable: true, // Google allows short caching of place_id-keyed data.
    fetchedAt: new Date().toISOString(),
  };
}

/** Text search biased to Koh Samui. */
export async function searchPlaces(
  query: string,
  limit: number,
): Promise<Listing[]> {
  const key = getKey();
  const data = await requestJson<{ places?: GooglePlace[] }>(
    `${GOOGLE_PLACES_BASE}/places:searchText`,
    {
      method: "POST",
      provider: "Google Places",
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELD_MASK },
      body: {
        textQuery: `${query} Koh Samui`,
        maxResultCount: Math.min(limit, 20),
        locationBias: {
          circle: {
            center: SAMUI_CENTER,
            radius: SAMUI_RADIUS_M,
          },
        },
      },
      ttlMs: 6 * 60 * 60 * 1000, // 6h
    },
  );
  return (data.places ?? []).map((p) => toListing(p, key));
}

/** Full detail for one place, including opening hours, website, phone. */
export async function getPlaceDetails(
  placeId: string,
): Promise<Listing & { openingHours?: string[]; website?: string; phone?: string }> {
  const key = getKey();
  const place = await requestJson<GooglePlace>(
    `${GOOGLE_PLACES_BASE}/places/${encodeURIComponent(placeId)}`,
    {
      provider: "Google Places",
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": DETAIL_FIELD_MASK },
      ttlMs: 60 * 60 * 1000, // 1h
    },
  );
  return {
    ...toListing(place, key),
    openingHours: place.currentOpeningHours?.weekdayDescriptions,
    website: place.websiteUri,
    phone: place.internationalPhoneNumber,
  };
}
