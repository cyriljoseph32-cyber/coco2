// Coco Samui — production smoke test
// 1. Affiliate link builders (unit, with test PIDs)
// 2. Live Viator search → normalized Listing[] + affiliate pid on bookingUrl
// 3. Live Google Places search → normalized Listing[]
// 4. Live OpenWeather
// 5. bookingFooter matching logic from _affiliates.js
process.env.VIATOR_AFFILIATE_PID = process.env.VIATOR_AFFILIATE_PID || "P00TESTPID";
process.env.GETYOURGUIDE_PARTNER_ID = process.env.GETYOURGUIDE_PARTNER_ID || "GYGTEST";
process.env.BOOKING_AFFILIATE_ID = process.env.BOOKING_AFFILIATE_ID || "BKTEST";

const api = "file:///C:/Users/Cyril/Claude/Projects/Coco Samui/api";
const { bookingLinks, searchActivities, searchPlaces, getCurrentWeather } = await import(`${api}/_providers.js`);
const { getAffiliateLinks } = await import(`${api}/_affiliates.js`);

let fails = 0, warns = 0;
const ok = (cond, name) => { console.log((cond ? "PASS" : "FAIL") + " — " + name); if (!cond) fails++; };
// Live-API credential problems are the user's to fix (key invalid/pending) — warn loudly, don't fail the run.
const liveErr = (provider, e) => {
  if (e.status === 401 || e.status === 403) { warns++; console.log(`WARN — ${provider} key rejected (${e.status}): fix the API key. ${e.message}`); }
  else ok(false, `${provider} live call threw: ${e.message}`);
};

// ── 1. bookingLinks unit ──
const links = bookingLinks("Ang Thong kayaking");
ok(links.length === 3, "bookingLinks returns 3 providers");
const viaLink = links.find(l => l.provider === "viator");
ok(viaLink && viaLink.url.includes("pid=" + process.env.VIATOR_AFFILIATE_PID), "Viator link carries pid= " + (viaLink && viaLink.url));
ok(links.find(l => l.provider === "getyourguide").url.includes("partner_id="), "GYG link carries partner_id");
ok(links.find(l => l.provider === "klook").url.includes("aid="), "Klook link carries aid (KLOOK_AFFILIATE_ID set)");

// ── 2. getAffiliateLinks matcher ──
const diveLinks = getAffiliateLinks("I want to go diving koh tao tomorrow");
ok(diveLinks.length > 0 && diveLinks[0].url.includes("viator.com") && diveLinks[0].url.includes("pid="), "dive query → Viator affiliate link: " + (diveLinks[0] && diveLinks[0].url));
const hotelLinks = getAffiliateLinks("where to stay in koh samui best hotel");
ok(hotelLinks.length === 1 && hotelLinks[0].url.includes("booking.com"), "hotel query → Booking.com only");
const specHotel = getAffiliateLinks("tell me about four seasons koh samui");
ok(specHotel.length === 1 && specHotel[0].url.includes("four-seasons"), "specific hotel → direct Booking.com page, fallback suppressed");
const restoLinks = getAffiliateLinks("cheap noodle restaurant in lamai please");
ok(restoLinks.length === 0, "plain restaurant query → no affiliate links");
const diveShop = getAffiliateLinks("is discovery divers good?");
ok(diveShop.length >= 1 && diveShop[0].url.includes("discoverydivers.com"), "dive shop → direct booking first");

// ── 3. Live providers (keys from samui-concierge-mcp/.env) ──
const REQUIRED = ["source", "sourceId", "name", "cacheable", "fetchedAt"];
function isListing(l) { return REQUIRED.every(k => l[k] !== undefined); }

if (process.env.VIATOR_API_KEY) {
  try {
    const acts = await searchActivities("Ang Thong snorkeling", 3);
    ok(Array.isArray(acts) && acts.length > 0, `Viator live search returns results (${acts.length})`);
    ok(acts.every(isListing), "Viator results are normalized Listing objects");
    ok(acts.every(a => a.source === "viator"), "Viator listings source=viator");
    ok(acts.every(a => !a.bookingUrl || a.bookingUrl.includes("pid=")), "Viator product bookingUrls carry affiliate pid");
    console.log("     sample:", JSON.stringify({ name: acts[0].name, priceFrom: acts[0].priceFrom, currency: acts[0].currency, bookingUrl: acts[0].bookingUrl }));
  } catch (e) { liveErr("Viator", e); }
} else console.log("SKIP — Viator live (no key)");

if (process.env.GOOGLE_PLACES_API_KEY) {
  try {
    const places = await searchPlaces("seafood restaurant", 2);
    ok(Array.isArray(places) && places.length > 0, `Google live search returns results (${places.length})`);
    ok(places.every(isListing), "Google results are normalized Listing objects");
    console.log("     sample:", JSON.stringify({ name: places[0].name, rating: places[0].rating, address: places[0].address }));
  } catch (e) { liveErr("Google Places", e); }
} else console.log("SKIP — Google live (no key)");

if (process.env.OPENWEATHER_API_KEY) {
  try {
    const w = await getCurrentWeather("en");
    ok(w && typeof w.tempC === "number" && w.activityAdvice, `OpenWeather live: ${w.emoji} ${w.tempC}°C ${w.description}`);
  } catch (e) { liveErr("OpenWeather", e); }
} else console.log("SKIP — OpenWeather (no key)");

console.log(fails ? `\n${fails} FAILURE(S)${warns ? `, ${warns} warning(s)` : ""}` : `\nALL PASS${warns ? ` (${warns} warning(s) — see above)` : ""}`);
process.exit(fails ? 1 : 0);
