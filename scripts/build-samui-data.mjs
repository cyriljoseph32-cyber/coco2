// Batch enrichment: reads data/curated.json (your hand-picked places),
// enriches each across all sources, writes data/samui_data.json.
//
// Run on YOUR machine (sandbox has no internet to Google/Viator):
//   cd "Coco Samui"
//   node --env-file=.env scripts/build-samui-data.mjs
//
// Then inject the relevant parts of data/samui_data.json into the
// SYSTEM_PROMPT of api/chat.js (the "storable" fields are safe to keep;
// TripAdvisor content is live-only and is NOT written to the file).

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { enrichListing } from "../api/_providers.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const curated = JSON.parse(await readFile(join(root, "data", "curated.json"), "utf8"));
console.log(`Enriching ${curated.length} listings…`);

const out = [];
for (const item of curated) {
  process.stdout.write(`  • ${item.name} … `);
  try {
    const r = await enrichListing(item.name, item.type || "restaurant");
    // keep only storable fields + curated metadata (respect TripAdvisor licence)
    out.push({ ...item, ...r.storable, _errors: r.errors.length ? r.errors : undefined });
    console.log(r.errors.length ? `ok (${r.errors.length} note(s))` : "ok");
  } catch (e) {
    out.push({ ...item, _error: e.message });
    console.log("FAILED: " + e.message);
  }
  await sleep(400); // be gentle on rate limits
}

const dest = join(root, "data", "samui_data.json");
await writeFile(dest, JSON.stringify({ generated_at: new Date().toISOString(), listings: out }, null, 2));
console.log(`\nWrote ${out.length} listings → ${dest}`);
