// Shared enrichment providers for Coco (Vercel, plain ESM, no deps).
// Same logic as samui-concierge-mcp/src/providers, ported to JS so the Vercel
// function and the batch script can both reuse it.
//
// Keys are read from process.env (set them as Vercel Environment Variables, or
// locally via `node --env-file=.env`). Missing keys → the call returns a clear
// note instead of crashing.

const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || "THB";
const SAMUI_CENTER = { latitude: 9.512, longitude: 100.013 };
const SAMUI_RADIUS_M = 25000;

const GOOGLE_BASE = "https://places.googleapis.com/v1";
const VIATOR_BASE = "https://api.viator.com/partner";
const TA_BASE = "https://api.content.tripadvisor.com/api/v1";

const KLOOK_BASE = "https://www.klook.com/en-US/search/";
const GYG_BASE = "https://www.getyourguide.com/s/";
const VIATOR_WEB = "https://www.viator.com/searchResults/all";

const TIMEOUT_MS = 15000;

async function fetchJson(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: opts.method || "GET",
      headers: {
        Accept: "application/json",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...(opts.headers || {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      const e = new Error(`${opts.provider} HTTP ${res.status}${txt ? ": " + txt.slice(0, 200) : ""}`);
      e.status = res.status;
      throw e;
    }
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const PRICE_LEVEL = {
  PRICE_LEVEL_FREE: 0, PRICE_LEVEL_INEXPENSIVE: 1, PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3, PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

// ───────── Google Places (New) ─────────
function googleKey() {
  const k = process.env.GOOGLE_PLACES_API_KEY;
  if (!k) { const e = new Error("GOOGLE_PLACES_API_KEY manquante. Ajoute-la en variable d'env."); e.status = 401; throw e; }
  return k;
}

export async function searchPlaces(query, limit = 5) {
  const key = googleKey();
  const mask = "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.types,places.photos";
  const data = await fetchJson(`${GOOGLE_BASE}/places:searchText`, {
    method: "POST", provider: "Google Places",
    headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": mask },
    body: {
      textQuery: `${query} Koh Samui`,
      maxResultCount: Math.min(limit, 20),
      locationBias: { circle: { center: SAMUI_CENTER, radius: SAMUI_RADIUS_M } },
    },
  });
  return (data.places || []).map((p) => googleToListing(p, key));
}

export async function getPlaceDetails(placeId) {
  const key = googleKey();
  const mask = "id,displayName,formattedAddress,rating,userRatingCount,priceLevel,types,photos,currentOpeningHours,websiteUri,internationalPhoneNumber,editorialSummary";
  const p = await fetchJson(`${GOOGLE_BASE}/places/${encodeURIComponent(placeId)}`, {
    provider: "Google Places",
    headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": mask },
  });
  const l = googleToListing(p, key);
  l.openingHours = p.currentOpeningHours?.weekdayDescriptions;
  l.website = p.websiteUri;
  l.phone = p.internationalPhoneNumber;
  return l;
}

function googleToListing(p, key) {
  const photo = p.photos?.[0]?.name ? `${GOOGLE_BASE}/${p.photos[0].name}/media?maxWidthPx=800&key=${key}` : undefined;
  return {
    source: "google", sourceId: p.id, name: p.displayName?.text || "(sans nom)",
    category: p.types?.[0]?.replace(/_/g, " "), address: p.formattedAddress,
    rating: p.rating, reviewCount: p.userRatingCount,
    priceLevel: p.priceLevel != null ? PRICE_LEVEL[p.priceLevel] : undefined,
    photoUrl: photo, description: p.editorialSummary?.text,
    cacheable: true, fetchedAt: new Date().toISOString(),
  };
}

// ───────── Viator ─────────
function viatorHeaders() {
  const k = process.env.VIATOR_API_KEY;
  if (!k) { const e = new Error("VIATOR_API_KEY manquante. Demande l'accès Viator Partner."); e.status = 401; throw e; }
  return { "exp-api-key": k, Accept: "application/json;version=2.0", "Accept-Language": "en-US" };
}

export async function searchActivities(query, limit = 5) {
  const data = await fetchJson(`${VIATOR_BASE}/search/freetext`, {
    method: "POST", provider: "Viator", headers: viatorHeaders(),
    body: {
      searchTerm: query, currency: DEFAULT_CURRENCY, productFiltering: {},
      searchTypes: [{ searchType: "PRODUCTS", pagination: { start: 1, count: Math.min(limit, 30) } }],
    },
  });
  return (data.products?.results || []).map(viatorToListing);
}

export async function getActivityDetails(code) {
  const p = await fetchJson(`${VIATOR_BASE}/products/${encodeURIComponent(code)}`, { provider: "Viator", headers: viatorHeaders() });
  return viatorToListing(p);
}

function viatorToListing(p) {
  let url = p.productUrl;
  const pid = process.env.VIATOR_AFFILIATE_PID;
  if (url && pid) url += (url.includes("?") ? "&" : "?") + "pid=" + pid;
  const img = p.images?.[0]?.variants;
  return {
    source: "viator", sourceId: p.productCode, name: p.title || "(activité)",
    category: "activity", rating: p.reviews?.combinedAverageRating, reviewCount: p.reviews?.totalReviews,
    priceFrom: p.pricing?.summary?.fromPrice, currency: p.pricing?.currency || DEFAULT_CURRENCY,
    durationMinutes: p.duration?.fixedDurationInMinutes,
    photoUrl: img?.[img.length - 1]?.url, bookingUrl: url,
    description: p.shortDescription || p.description,
    cacheable: true, fetchedAt: new Date().toISOString(),
  };
}

// ───────── TripAdvisor (display-only, never store except location_id) ─────────
function taKey() {
  const k = process.env.TRIPADVISOR_API_KEY;
  if (!k) { const e = new Error("TRIPADVISOR_API_KEY manquante (optionnel)."); e.status = 401; throw e; }
  return k;
}

export async function tripadvisorSearch(query, category) {
  const key = taKey();
  const params = new URLSearchParams({ key, searchQuery: query, latLong: `${SAMUI_CENTER.latitude},${SAMUI_CENTER.longitude}`, language: "en" });
  if (category) params.set("category", category);
  const data = await fetchJson(`${TA_BASE}/location/search?${params}`, { provider: "TripAdvisor" });
  return (data.data || []).map((i) => ({ locationId: i.location_id, name: i.name, address: i.address_obj?.address_string }));
}

export async function tripadvisorDetails(locationId) {
  const key = taKey();
  const d = await fetchJson(`${TA_BASE}/location/${encodeURIComponent(locationId)}/details?key=${key}&language=en`, { provider: "TripAdvisor" });
  return {
    source: "tripadvisor", sourceId: d.location_id, name: d.name,
    rating: d.rating ? Number(d.rating) : undefined,
    reviewCount: d.num_reviews ? Number(d.num_reviews) : undefined,
    bookingUrl: d.web_url, description: d.ranking_data?.ranking_string,
    cacheable: false, fetchedAt: new Date().toISOString(),
  };
}

// ───────── OpenWeather — current conditions for Koh Samui ─────────
const OWM_BASE = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(lang = "en") {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    const e = new Error("OPENWEATHER_API_KEY manquante. Ajoute-la en variable d'env.");
    e.status = 401;
    throw e;
  }

  const params = new URLSearchParams({
    lat: SAMUI_CENTER.latitude,
    lon: SAMUI_CENTER.longitude,
    appid: key,
    units: "metric",
    lang: lang.slice(0, 2), // en, fr, de, sv, zh, th
  });

  const data = await fetchJson(`${OWM_BASE}/weather?${params}`, { provider: "OpenWeather" });

  const cond = data.weather?.[0];
  const main = data.main || {};
  const wind = data.wind || {};

  // Emoji per weather condition code group
  const condId = cond?.id || 800;
  let emoji = "🌤️";
  if (condId >= 200 && condId < 300) emoji = "⛈️";
  else if (condId >= 300 && condId < 400) emoji = "🌦️";
  else if (condId >= 500 && condId < 600) emoji = "🌧️";
  else if (condId >= 600 && condId < 700) emoji = "🌨️";
  else if (condId >= 700 && condId < 800) emoji = "🌫️";
  else if (condId === 800) emoji = "☀️";
  else if (condId > 800) emoji = "⛅";

  // Beach/dive safety advice
  const tempC = Math.round(main.temp ?? 30);
  const feelsC = Math.round(main.feels_like ?? tempC);
  const humidity = main.humidity;
  const windKmh = Math.round((wind.speed ?? 0) * 3.6);
  const description = cond?.description || "clear sky";

  let activity = "✅ Excellent day for beach, snorkeling and diving.";
  if (condId >= 200 && condId < 600) {
    activity = "⚠️ Rain expected — boat trips may be affected. Check with operators.";
  } else if (windKmh > 30) {
    activity = "⚠️ Strong winds — sea conditions may be rough. Verify with dive center.";
  }

  return {
    source: "openweather",
    location: "Koh Samui",
    tempC,
    feelsC,
    humidity,
    windKmh,
    description,
    emoji,
    activityAdvice: activity,
    fetchedAt: new Date().toISOString(),
  };
}

// ───────── Affiliate deep links (no API needed) ─────────
export function bookingLinks(query) {
  const klook = new URL(KLOOK_BASE); klook.searchParams.set("query", query);
  if (process.env.KLOOK_AFFILIATE_ID) klook.searchParams.set("aid", process.env.KLOOK_AFFILIATE_ID);
  const gyg = new URL(GYG_BASE); gyg.searchParams.set("q", query);
  if (process.env.GETYOURGUIDE_PARTNER_ID) gyg.searchParams.set("partner_id", process.env.GETYOURGUIDE_PARTNER_ID);
  const via = new URL(VIATOR_WEB); via.searchParams.set("text", query);
  if (process.env.VIATOR_AFFILIATE_PID) via.searchParams.set("pid", process.env.VIATOR_AFFILIATE_PID);
  return [
    { provider: "klook", url: klook.toString(), configured: !!process.env.KLOOK_AFFILIATE_ID },
    { provider: "getyourguide", url: gyg.toString(), configured: !!process.env.GETYOURGUIDE_PARTNER_ID },
    { provider: "viator", url: via.toString(), configured: !!process.env.VIATOR_AFFILIATE_PID },
  ];
}

// ───────── Workflow: enrich one curated listing across all sources ─────────
export async function enrichListing(name, type) {
  const errors = [];
  let google, ta, viator;
  if (type !== "activity") {
    try { const h = await searchPlaces(name, 1); if (h[0]) google = await getPlaceDetails(h[0].sourceId); }
    catch (e) { errors.push({ provider: "google", message: e.message }); }
  }
  if (type === "activity") {
    try { viator = (await searchActivities(name, 1))[0]; }
    catch (e) { errors.push({ provider: "viator", message: e.message }); }
  }
  try {
    const cat = type === "restaurant" ? "restaurants" : type === "hotel" ? "hotels" : "attractions";
    const f = await tripadvisorSearch(name, cat);
    if (f[0]) ta = await tripadvisorDetails(f[0].locationId);
  } catch (e) { errors.push({ provider: "tripadvisor", message: e.message }); }

  const links = bookingLinks(name);
  const storable = {
    name, type,
    google_place_id: google?.sourceId, google_rating: google?.rating, google_review_count: google?.reviewCount,
    google_price_level: google?.priceLevel, address: google?.address, website: google?.website, phone: google?.phone,
    viator_product_code: viator?.sourceId, viator_price_from: viator?.priceFrom, viator_currency: viator?.currency,
    tripadvisor_location_id: ta?.sourceId,
    affiliate_links: links.map((l) => ({ provider: l.provider, url: l.url })),
    enriched_at: new Date().toISOString(),
  };
  return { name, type, live: { google, tripadvisor: ta, viator }, booking_links: links, storable, errors };
}
