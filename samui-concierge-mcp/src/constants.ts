/** Shared constants for the Samui Concierge MCP server. */

export const CHARACTER_LIMIT = 25000; // Max characters in a single tool response.

export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || "THB";

/** Koh Samui geographic bias (used by Google Places to rank local results). */
export const SAMUI_CENTER = { latitude: 9.512, longitude: 100.013 };
export const SAMUI_RADIUS_M = 25000; // ~island radius.

/** Provider base URLs. */
export const GOOGLE_PLACES_BASE = "https://places.googleapis.com/v1";
export const VIATOR_BASE = "https://api.viator.com/partner";
export const TRIPADVISOR_BASE = "https://api.content.tripadvisor.com/api/v1";

/** Affiliate deep-link bases. */
export const KLOOK_BASE = "https://www.klook.com/en-US/search/";
export const GETYOURGUIDE_BASE = "https://www.getyourguide.com/s/";
export const VIATOR_WEB_BASE = "https://www.viator.com/searchResults/all";

export const HTTP_TIMEOUT_MS = 30000;
