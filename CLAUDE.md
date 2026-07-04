# Coco Samui — project notes for Claude

Two deployables in this folder:

1. **Vercel app** (root) — Coco, the AI concierge chatbot. `api/chat.js` (Claude Haiku),
   `api/enrich.js`, `api/lead.js`, `api/stats.js`; static frontend in `public/`.
   Production: https://coco-samui-ai.com (Vercel project `coco-samui-concierge`).
   Deploy: `vercel --prod`. Env vars live in Vercel → Settings → Environment Variables.
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

**Mobile app shell** (`public/index.html`): at ≤768px the page becomes a chat-first bot shell —
`100dvh` hero with the chat filling the viewport, composer + safe-area at the bottom, ☰ bottom
menu sheet, snap carousels for beaches/experiences, floating "Ask Coco" pill when scrolled.
All of it lives in the `@media(max-width:768px)` block + `.m-only` elements; desktop markup/CSS
must stay untouched. Inputs stay ≥16px font (iOS zoom), tap targets ≥44px.

Most other files at the root are business collateral (pitch decks, outreach kits, contracts) — not code.
