/**
 * GET /api/stats?hotel=<slug>&code=<code>[&month=YYYYMM][&leads=1]
 *
 * Powers the hotel dashboard (public/dashboard.html).
 *
 * Auth (simple, V1):
 *   • Master code  → env DASHBOARD_MASTER_CODE (Cyril sees any hotel + leads)
 *   • Per-hotel    → code stored in KV per hotel (setHotelCode)
 *
 * Returns aggregated stats for the month. Degrades gracefully if no KV store.
 */

import { getStats, getLeads, checkHotelCode, storeConfigured } from "./_store.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const { hotel = "", code = "", month, leads } = req.query || {};
  if (!hotel) return res.status(400).json({ error: "hotel is required" });
  if (!code)  return res.status(401).json({ error: "code is required" });

  const master = process.env.DASHBOARD_MASTER_CODE;
  const isMaster = master && code === master;
  const ok = isMaster || (await checkHotelCode(hotel, code));

  if (!ok) {
    return res.status(403).json({ error: "Invalid code", storeConfigured: storeConfigured() });
  }

  const stats = await getStats(hotel, month);

  // Master can also pull recent leads (Cyril's own view)
  if (isMaster && (leads === "1" || leads === "true")) {
    stats.recentLeads = await getLeads(50);
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json(stats);
}
