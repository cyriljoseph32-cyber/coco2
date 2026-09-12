/**
 * POST /api/lead — Hotel partner lead capture
 *
 * Body (JSON):
 *   { name, hotel, email, phone, message, lang }
 *
 * Returns: { ok: true, id, persisted } or HTTP 400 / 500
 *
 * Storage: PERSISTENT via Vercel KV / Upstash (api/_store.js).
 *   ⚠️ The old version wrote to /tmp (ephemeral on Vercel) — leads were lost.
 *   Now leads are stored in KV AND pushed to LEAD_NOTIFY_WEBHOOK (Slack/Discord/Make).
 *   Set at least ONE of: a KV store, or LEAD_NOTIFY_WEBHOOK — ideally both.
 */

import { pushLead, storeConfigured } from "./_store.js";
import { notifyCommand } from "./_command.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function validate(body) {
  const errors = [];
  if (!body.name  || body.name.trim().length  < 2) errors.push("name is required");
  if (!body.email || !body.email.includes("@"))    errors.push("valid email is required");
  if (!body.hotel || body.hotel.trim().length < 2) errors.push("hotel name is required");
  return errors;
}

function sanitize(str, max = 200) {
  if (typeof str !== "string") return "";
  return str.replace(/[<>&"]/g, "").trim().slice(0, max);
}

async function notify(lead) {
  const url = process.env.LEAD_NOTIFY_WEBHOOK;
  if (!url) return false;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text:
          `🌴 *New Coco lead!*\n` +
          `*Name:* ${lead.name}\n*Hotel:* ${lead.hotel}\n*Email:* ${lead.email}\n` +
          `*Phone:* ${lead.phone || "N/A"}\n*Message:* ${lead.message || "N/A"}\n` +
          `*Lang:* ${lead.lang}\n*Time:* ${lead.createdAt}`,
      }),
    });
    return true;
  } catch (_) {
    return false;
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const body = req.body || {};
  const errors = validate(body);
  if (errors.length) return res.status(400).json({ error: errors.join("; ") });

  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const hotel = sanitize(body.hotel);
  const lead = {
    id,
    name:      sanitize(body.name),
    hotel,
    hotelSlug: hotel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    email:     sanitize(body.email, 100),
    phone:     sanitize(body.phone || "", 40),
    message:   sanitize(body.message || "", 1000),
    lang:      sanitize(body.lang || "en", 5),
    consent:   body.consent === true,
    consentAt: body.consent === true ? new Date().toISOString() : null,
    ip:        req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown",
    userAgent: (req.headers["user-agent"] || "").slice(0, 200),
    createdAt: new Date().toISOString(),
    source:    "hotel-setup-form",
  };

  // GDPR/PDPA: do not store PII without explicit consent from the form.
  if (!lead.consent) {
    return res.status(400).json({ error: "Consent to the Privacy Policy is required." });
  }

  // Persist (KV) + notify (webhook) in parallel. Both best-effort but logged.
  const [persisted] = await Promise.all([
    pushLead(lead).then(() => storeConfigured()).catch(() => false),
    notify(lead),
  ]);

  // Always log to Vercel console as a last-resort record.
  console.log("[COCO LEAD]", JSON.stringify({ id, name: lead.name, hotel: lead.hotel, email: lead.email, ts: lead.createdAt, persisted }));

  if (!persisted && !process.env.LEAD_NOTIFY_WEBHOOK) {
    console.warn("[COCO LEAD] ⚠️ No KV store and no LEAD_NOTIFY_WEBHOOK set — lead only in console logs. Configure one ASAP.");
  }

  // ─── COCO COMMAND — la base unique de leads ────────────────────────────────
  // Corrigé (chantier 2.1) : l'événement partait AUTREFOIS uniquement si le KV
  // avait accepté l'écriture. Sans KV configuré, le lead disparaissait donc
  // deux fois — ni stocké, ni remonté. C'était la fuite n°2 de l'audit.
  // Désormais l'ingestion est la destination principale et elle est TOUJOURS
  // appelée ; le KV n'est plus qu'un cache local pour le dashboard hôtel.
  //
  // On attend la réponse ici (contrairement à chat.js) : ce chemin n'est pas
  // face au client d'un hôtel, il est face à un formulaire — 300 ms de plus
  // valent mieux qu'un lead perdu.
  const ingested = await notifyCommand({
    venture: "COCO",
    agent: "lead-capture",
    type: "ACTION",
    priority: "P2",
    status: "DONE",
    summary: `Nouveau lead hôtel capté — ${lead.hotel}`,
    details: `id=${lead.id} name=${lead.name} email=${lead.email} phone=${lead.phone || "N/A"} lang=${lead.lang}`,
    links: [],
    next_action: "Qualifier le lead et répondre sous 24 h.",
    // Un lead entrant appelle une réponse rédigée puis validée : boucle B.
    needs_owner: true,
    category: "sales",
    repo: "coco2",
  }).catch(() => false);

  const recorded = Boolean(ingested) || persisted;
  if (!recorded) {
    // Plus de disparition silencieuse : le lead complet est écrit en erreur
    // pour être récupérable à la main dans les logs Vercel.
    console.error("[COCO LEAD] ⚠️ NON ENREGISTRÉ (ni ingestion ni KV) —", JSON.stringify(lead));
  }

  return res.status(recorded ? 201 : 502).json({
    ok: recorded,
    id,
    persisted,
    ingested: Boolean(ingested),
    ...(recorded ? {} : { error: "Could not record the lead. Please email us instead." }),
  });
}
