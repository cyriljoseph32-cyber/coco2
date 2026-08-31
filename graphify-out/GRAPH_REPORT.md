# Graph Report - coco2  (2026-08-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 471 nodes · 671 edges · 34 communities (22 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5390cda`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25

## God Nodes (most connected - your core abstractions)
1. `[]` - 23 edges
2. `compilerOptions` - 14 edges
3. `enrichListing()` - 10 edges
4. `searchActivities()` - 10 edges
5. `searchPlaces()` - 10 edges
6. `handler()` - 10 edges
7. `storeConfigured()` - 10 edges
8. `HttpError` - 9 edges
9. `fetchJson()` - 8 edges
10. `handler()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `categories` --extends--> `lifestyle`  [EXTRACTED]
  site/public/manifest.json → public/manifest.json
- `categories` --extends--> `navigation`  [EXTRACTED]
  site/public/manifest.json → public/manifest.json
- `categories` --extends--> `travel`  [EXTRACTED]
  site/public/manifest.json → public/manifest.json
- `buildLiveContext()` --calls--> `getCurrentWeather()`  [EXTRACTED]
  api/chat.js → api/_providers.js
- `buildLiveContext()` --calls--> `searchActivities()`  [EXTRACTED]
  api/chat.js → api/_providers.js

## Import Cycles
- None detected.

## Communities (34 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (55): CHARACTER_LIMIT, DEFAULT_CURRENCY, GETYOURGUIDE_BASE, GOOGLE_PLACES_BASE, HTTP_TIMEOUT_MS, KLOOK_BASE, SAMUI_CENTER, SAMUI_RADIUS_M (+47 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (23): year, panel, Beach, BEACHES, CATEGORIES, Category, Experience, EXPERIENCES (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (33): handler(), bookingLinks(), enrichListing(), fetchJson(), getActivityDetails(), getCurrentWeather(), getPlaceDetails(), googleKey() (+25 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (31): AllValuesOf, AnyEntryMap, astro:content, CollectionEntry, CollectionKey, ContentCollectionKey, ContentConfig, ContentEntryMap (+23 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (29): background_color, categories, description, display, icons, lifestyle, navigation, travel (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (26): @modelcontextprotocol/sdk, bin, samui-concierge-mcp, dependencies, @modelcontextprotocol/sdk, zod, description, devDependencies (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (18): AFFILIATE_MAP, getAffiliateLinks(), NOTE: Local restaurants (Sa Being Lae, Noo Beer Garden, etc.) → NO affiliate…, applyPriceGuard(), bookingFooter(), buildLiveContext(), CITABLE_THB_AMOUNTS, detectLang() (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.20
Nodes (20): notifyCommand(), cors(), handler(), notify(), sanitize(), validate(), cors(), handler() (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (22): @astrojs/sitemap, @fontsource-variable/fraunces, @fontsource-variable/inter, dependencies, astro, @astrojs/sitemap, @fontsource-variable/fraunces, @fontsource-variable/instrument-sans (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.16
Nodes (22): [], ask(), bubble(), clearHistory(), closeBtn, closeSheet(), dock, esc() (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (20): ES2022, node_modules, compilerOptions, allowSyntheticDefaultImports, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (15): @anthropic-ai/sdk, dependencies, @anthropic-ai/sdk, description, devDependencies, vercel, vercel, name (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (15): maxDuration, memory, maxDuration, memory, buildCommand, cleanUrls, functions, api/chat.js (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (7): C, FadeIn(), FEATURES, HOTELS, PRICING, TESTIMONIALS, useInView()

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (4): C, FadeIn(), T, useInView()

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (7): astro/tsconfigs/base, .astro/types.d.ts, exclude, extends, include, dist, src/**/*

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (3): C, CONTACTS_URGENTS, DAYS

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (3): C, CONTACTS_URGENT, DAYS

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (5): CAPTIONS, IMAGES, PATH, POSTIZ_API_KEY, schedule_posts.sh script

### Community 19 - "Community 19"
Cohesion: 0.70
Nodes (4): buildIframeSrc(), closePanel(), openPanel(), togglePanel()

### Community 20 - "Community 20"
Cohesion: 0.70
Nodes (4): buildIframeSrc(), closePanel(), openPanel(), togglePanel()

### Community 21 - "Community 21"
Cohesion: 0.83
Nodes (3): ID(), postiz_schedule.sh script, up()

## Knowledge Gaps
- **213 isolated node(s):** `CacheEntry`, `AffiliateLink`, `GooglePlace`, `TaDetails`, `TaSearchItem` (+208 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 255 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `[]` connect `Community 9` to `Community 1`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `searchActivities()` connect `Community 2` to `Community 6`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Why does `searchPlaces()` connect `Community 2` to `Community 6`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `[]` (e.g. with `place()` and `resetChat()`) actually correct?**
  _`[]` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `CacheEntry`, `AffiliateLink`, `GooglePlace` to the rest of the system?**
  _213 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.057342657342657345 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0851063829787234 - nodes in this community are weakly interconnected._