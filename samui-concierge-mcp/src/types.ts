/** Shared types for normalized listings across all providers. */

import { z } from "zod";

export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json",
}

export type ListingSource =
  | "google"
  | "viator"
  | "tripadvisor"
  | "klook"
  | "getyourguide";

/**
 * A normalized listing. Every provider maps its raw response into this shape so
 * the Coco concierge can merge them into one database without per-source glue.
 *
 * `cacheable` matters: TripAdvisor content may NOT be stored (only the
 * location_id). Viator/Google may be cached with a short TTL. The flag tells the
 * concierge what it is allowed to persist.
 */
export interface Listing {
  source: ListingSource;
  sourceId: string; // place_id / productCode / location_id
  name: string;
  category?: string;
  area?: string; // e.g. "Chaweng", "Bophut"
  address?: string;
  rating?: number; // 0-5
  reviewCount?: number;
  priceFrom?: number;
  currency?: string;
  durationMinutes?: number;
  photoUrl?: string;
  bookingUrl?: string; // affiliate link where applicable
  description?: string;
  cacheable: boolean; // false = display live only, do NOT store (TripAdvisor)
  fetchedAt: string; // ISO timestamp
}

/** Zod schema for a Listing (used for outputSchema / runtime validation). */
export const ListingSchema = z.object({
  source: z.string(),
  sourceId: z.string(),
  name: z.string(),
  category: z.string().optional(),
  area: z.string().optional(),
  address: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  priceFrom: z.number().optional(),
  currency: z.string().optional(),
  durationMinutes: z.number().optional(),
  photoUrl: z.string().optional(),
  bookingUrl: z.string().optional(),
  description: z.string().optional(),
  cacheable: z.boolean(),
  fetchedAt: z.string(),
});

export interface ProviderError {
  provider: string;
  message: string;
}
