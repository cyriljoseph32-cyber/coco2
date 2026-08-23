// ─────────────────────────────────────────────────────────────
// Coco — COCO COMMAND event emitter
//
// POSTs a single event into the COCO COMMAND ingest API (the engine that runs
// in the jamin-depth repo, src/command/). Event shape is the shared contract
// used across all of Cyril's ventures (venture must be "COCO" for this repo):
//
//   {
//     venture: "COCO",
//     agent: string,               // e.g. "chat.js", "lead-capture"
//     type: "ACTION" | "ALERT",
//     priority: "P0" | "P1" | "P2" | "P3",
//     status: "DONE" | "PLANNED",
//     summary: string,             // max 300 chars — keep PII out of this field
//     details: string,
//     links: string[],
//     next_action: string,
//     needs_owner: boolean,
//     repo: "coco2",
//   }
//
// No SDK, no deps — same fetch-based pattern as notify() in api/lead.js.
// Silently degrades (no crash, never blocks the HTTP response path) if
// COMMAND_API_URL / COMMAND_INGEST_TOKEN aren't configured. Always call this
// fire-and-forget (`notifyCommand(event).catch(() => {})`, never awaited in
// the response path) — it must never add latency to a guest-facing reply.
// ─────────────────────────────────────────────────────────────

export async function notifyCommand(event) {
  const url = process.env.COMMAND_API_URL;
  const token = process.env.COMMAND_INGEST_TOKEN;
  if (!url || !token) return false;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });
    return true;
  } catch (_) {
    return false;
  }
}
