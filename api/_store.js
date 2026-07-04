// ─────────────────────────────────────────────────────────────
// Coco — tiny persistent store (Vercel KV / Upstash Redis REST)
// No SDK, no deps. Works on Vercel serverless.
//
// SETUP (one of these — both free tier):
//   • Vercel KV  → auto-injects KV_REST_API_URL + KV_REST_API_TOKEN
//   • Upstash    → set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
//
// If neither is set, every function degrades gracefully (no crash):
//   writes are no-ops (logged), reads return empty. The chat + lead
//   form keep working — you just won't have a dashboard until you add KV.
// ─────────────────────────────────────────────────────────────

const BASE =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export function storeConfigured() {
  return Boolean(BASE && TOKEN);
}

// Run a single Redis command, e.g. cmd("INCR", "key")
async function cmd(...args) {
  if (!storeConfigured()) return null;
  try {
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    if (!res.ok) {
      console.warn("[COCO STORE] HTTP", res.status, await res.text().catch(() => ""));
      return null;
    }
    const j = await res.json();
    return j.result;
  } catch (e) {
    console.warn("[COCO STORE] error:", e && e.message);
    return null;
  }
}

// Run a pipeline of commands: pipeline([["INCR","a"],["GET","b"]])
async function pipeline(cmds) {
  if (!storeConfigured() || !cmds.length) return [];
  try {
    const res = await fetch(`${BASE}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmds),
    });
    if (!res.ok) {
      console.warn("[COCO STORE] pipeline HTTP", res.status);
      return [];
    }
    const j = await res.json();
    return Array.isArray(j) ? j.map((r) => r.result) : [];
  } catch (e) {
    console.warn("[COCO STORE] pipeline error:", e && e.message);
    return [];
  }
}

function ym(d = new Date()) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

const LANGS = ["en", "fr", "de", "sv", "th", "zh"];

// ─── Leads (persistent — survives forever, the /tmp bug is gone) ─────────────
export async function pushLead(lead) {
  const json = JSON.stringify(lead);
  const slug = (lead.hotelSlug || "_global").toLowerCase();
  await pipeline([
    ["LPUSH", "coco:leads", json],
    ["LTRIM", "coco:leads", "0", "999"],
    ["LPUSH", `coco:h:${slug}:leads`, json],
    ["INCR", "coco:leads:total"],
  ]);
}

export async function getLeads(limit = 100) {
  const r = await cmd("LRANGE", "coco:leads", "0", String(Math.max(0, limit - 1)));
  if (!Array.isArray(r)) return [];
  return r.map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
}

// ─── Per-hotel dashboard access code (optional) ─────────────────────────────
export async function setHotelCode(hotel, code) {
  const slug = (hotel || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (!slug || !code) return;
  await cmd("SET", `coco:h:${slug}:code`, String(code));
}

export async function checkHotelCode(hotel, code) {
  if (!code) return false;
  const slug = (hotel || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const stored = await cmd("GET", `coco:h:${slug}:code`);
  return Boolean(stored && stored === String(code));
}

// ─── Conversation events (powers the dashboard) ─────────────────────────────
// ev = { hotel, lang, question, house (bool), bookingShown (bool) }
export async function logEvent(ev) {
  if (!storeConfigured()) return;
  const slug = (ev.hotel || "_global").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const m = ym();
  const lang = LANGS.includes(ev.lang) ? ev.lang : "en";
  const cmds = [
    ["INCR", `coco:h:${slug}:conv:${m}`],
    ["INCR", `coco:h:${slug}:lang:${lang}:${m}`],
  ];
  if (ev.question) {
    const q = String(ev.question).slice(0, 120);
    cmds.push(["LPUSH", `coco:h:${slug}:q`, q]);
    cmds.push(["LTRIM", `coco:h:${slug}:q`, "0", "499"]);
  }
  if (ev.house) cmds.push(["INCR", `coco:h:${slug}:house:${m}`]);
  if (ev.bookingShown) cmds.push(["INCR", `coco:h:${slug}:book:${m}`]);
  await pipeline(cmds);
}

// ─── Stats for the dashboard ────────────────────────────────────────────────
export async function getStats(hotel, month) {
  const slug = (hotel || "_global").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const m = month || ym();
  if (!storeConfigured()) {
    return { configured: false, hotel: slug, month: m, conversations: 0, houseRecos: 0, bookingShown: 0, languages: {}, topQuestions: [] };
  }
  const langCmds = LANGS.map((l) => ["GET", `coco:h:${slug}:lang:${l}:${m}`]);
  const results = await pipeline([
    ["GET", `coco:h:${slug}:conv:${m}`],
    ["GET", `coco:h:${slug}:house:${m}`],
    ["GET", `coco:h:${slug}:book:${m}`],
    ["LRANGE", `coco:h:${slug}:q`, "0", "499"],
    ...langCmds,
  ]);
  const conversations = Number(results[0] || 0);
  const houseRecos = Number(results[1] || 0);
  const bookingShown = Number(results[2] || 0);
  const questions = Array.isArray(results[3]) ? results[3] : [];
  const languages = {};
  LANGS.forEach((l, i) => {
    const v = Number(results[4 + i] || 0);
    if (v) languages[l] = v;
  });

  // Aggregate top questions (normalize)
  const counts = {};
  for (const raw of questions) {
    const k = String(raw).toLowerCase().replace(/\s+/g, " ").trim();
    if (k.length < 3) continue;
    counts[k] = (counts[k] || 0) + 1;
  }
  const topQuestions = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([q, n]) => ({ q, n }));

  return { configured: true, hotel: slug, month: m, conversations, houseRecos, bookingShown, languages, topQuestions };
}
