// Coco live enrichment endpoint (Vercel serverless function).
// Coco (or any caller) hits this to get fresh listings + affiliate links.
//
// Examples:
//   /api/enrich?mode=places&q=seafood
//   /api/enrich?mode=activities&q=Ang%20Thong
//   /api/enrich?mode=links&q=kayaking
//   /api/enrich?mode=enrich&q=Coco%20Tams&type=restaurant
//
// Set keys as Vercel Environment Variables (Settings → Environment Variables):
//   GOOGLE_PLACES_API_KEY, VIATOR_API_KEY, TRIPADVISOR_API_KEY,
//   KLOOK_AFFILIATE_ID, GETYOURGUIDE_PARTNER_ID, VIATOR_AFFILIATE_PID

import {
  searchPlaces, searchActivities, bookingLinks, enrichListing,
} from "./_providers.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();

  const q = (req.query?.q || "").toString().trim();
  const mode = (req.query?.mode || (req.query?.type ? "enrich" : "places")).toString();
  const type = (req.query?.type || "restaurant").toString();
  const limit = Math.min(parseInt(req.query?.limit || "5", 10) || 5, 20);

  if (!q) return res.status(400).json({ error: "Paramètre 'q' requis." });

  try {
    let data;
    switch (mode) {
      case "places": data = { mode, q, listings: await searchPlaces(q, limit) }; break;
      case "activities": data = { mode, q, listings: await searchActivities(q, limit) }; break;
      case "links": data = { mode, q, links: bookingLinks(q) }; break;
      case "enrich": data = await enrichListing(q, type); break;
      default: return res.status(400).json({ error: `mode inconnu: ${mode}` });
    }
    // affiliate links never fail → always attach for monetization convenience
    if (!data.booking_links && mode !== "links") data.booking_links = bookingLinks(q);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.status === 401 ? 200 : 500).json({
      error: e.message,
      booking_links: bookingLinks(q), // still give monetizable links
    });
  }
}
