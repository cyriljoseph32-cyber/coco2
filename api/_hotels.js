// ─────────────────────────────────────────────────────────────
// Coco — White-label hotel registry (server side / AI behaviour)
// One entry per hotel. The key is a short slug.
// Coco will recommend THIS hotel's own services FIRST.
//
// To add a hotel: copy a block, set a short slug as the key,
// fill in `name` and `services` (what Coco should push first).
// Lookup is forgiving: a QR slug like "the-ritz-carlton-koh-samui"
// still matches the "ritz-carlton" entry.
// (Keep the display name/colour in sync with index.html HOTELS map.)
// ─────────────────────────────────────────────────────────────

export const HOTELS = {
  "ritz-carlton": {
    name: "The Ritz-Carlton Koh Samui",
    services: "the resort's own restaurants and beachfront dining, the Ritz-Carlton Spa, the kids' club and the in-house excursion desk",
  },
  "anantara-bophut": {
    name: "Anantara Bophut Koh Samui",
    services: "Anantara's own restaurants and bars, the Anantara Spa, the cooking school and in-house excursions",
  },
  "banyan-tree": {
    name: "Banyan Tree Samui",
    services: "the resort's signature restaurants, the Banyan Tree Spa, and in-villa dining and experiences",
  },
  "centara-reserve": {
    name: "Centara Reserve Samui",
    services: "Centara's own restaurants and bars, SPA Cenvaree, and the resort's in-house activities",
  },
  "hansar": {
    name: "Hansar Samui Resort",
    services: "the resort's H Bistro restaurant, the Luxsa Spa, and in-house boat trips and excursions",
  },
  "santiburi": {
    name: "Santiburi Koh Samui",
    services: "the resort's own restaurants, the Santiburi Spa, the golf club and in-house activities",
  },
  "kamalaya": {
    name: "Kamalaya Koh Samui",
    services: "Kamalaya's own wellness programs, holistic spa and healing treatments, healthy-cuisine restaurants and guided activities",
  },
  "four-seasons": {
    name: "Four Seasons Resort Koh Samui",
    services: "the resort's own restaurants (including Koh Thai Kitchen and the beachfront dining), the Four Seasons Spa, and in-house excursions and kids' activities",
  },
};

// Forgiving lookup: returns the hotel whose slug appears in the
// incoming value (so short and long slugs both work). null if none.
export function hotelContext(raw) {
  if (!raw) return null;
  const slug = String(raw).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (HOTELS[slug]) return HOTELS[slug];
  for (const key of Object.keys(HOTELS)) {
    if (slug.includes(key)) return HOTELS[key];
  }
  return null;
}
