# Coco Samui — project notes for Claude

Two deployables in this folder:

1. **Vercel app** (root) — Coco, the AI concierge chatbot. `api/chat.js` (Claude Haiku),
   `api/enrich.js`, `api/lead.js`, `api/stats.js`. **The deployed frontend is the Astro
   app in `site/`** (`vercel.json`: build `site/` → `site/dist`; static assets in
   `site/public/`). Root `public/` is the LEGACY pre-Astro site — NOT deployed; don't edit it.
   Production: https://coco-samui-ai.com (Vercel project `coco-samui-concierge`).
   Deploys: merge to `main` (Git integration) or `vercel --prod`. Env vars in Vercel settings.
2. **MCP server** (`samui-concierge-mcp/`) — stdio server for Claude Desktop that wraps the
   same providers (Google Places, Viator, TripAdvisor, affiliate links). Build: `npm run build`
   inside that folder. Keys in `samui-concierge-mcp/.env`. See its `DEPLOY.md`.

Rules that matter:

- **TripAdvisor content may NOT be stored** — only `location_id`. Providers flag it `cacheable: false`.
- **Affiliate links** — every provider/business type maps to a specific platform (see
  `api/_affiliates.js` header). Never hardcode a PID; they come from env
  (`VIATOR_AFFILIATE_PID`, `KLOOK_AFFILIATE_ID`, `GETYOURGUIDE_PARTNER_ID`, `BOOKING_AFFILIATE_ID`).
- All providers return the normalized `Listing` shape (see `samui-concierge-mcp/src/types.ts`).
- Coco must never print booking URLs itself — `bookingFooter()` in `api/chat.js` appends them.

Validation: `node --env-file=samui-concierge-mcp/.env scripts/smoke-test.mjs`
(unit-tests affiliate builders + live-tests Google/Viator/OpenWeather with real keys).
Batch data refresh: `node --env-file=samui-concierge-mcp/.env scripts/build-samui-data.mjs`.

**Mobile chat** (Astro site): one chat DOM instance (`site/src/components/ChatPanel.astro`),
relocated by JS — desktop ≥1280px into `#chat-rail-slot`, below that into the bottom sheet
(`#coco-sheet` in `Base.astro`), opened from the fixed dock. Gotcha: Tailwind v4 translate
utilities use the CSS `translate` property, not `transform` — override with `translate`,
never `transform` (this bug once left the sheet permanently off-screen). Chat input must
stay ≥16px font (iOS focus-zoom).

Most other files at the root are business collateral (pitch decks, outreach kits, contracts) — not code.

## Central memory

Cyril's cross-project memory lives in the `cyriljoseph32-cyber/Coconut-Samui-Rugby-Academy`
repo under `brain/memoire/` — this project's sheet is `brain/memoire/projets/coco2.md`.
(Not to be confused with `assistant-ai`, the "Coco" front-desk product — this repo is the
Samui tourist concierge.) When starting a task, consult the sheet if reachable (sibling
checkout at `/home/user/Coconut-Samui-Rugby-Academy/` or via GitHub). After a significant
change here, update the sheet + `brain/memoire/journal.md`, or flag it to Cyril so the
`memory` agent does it.
