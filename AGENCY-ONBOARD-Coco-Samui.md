# 🥥 AGENCY ONBOARD REPORT — Coco (AI Concierge Koh Samui)

**Target:** https://coco-samui-ai.com
**Date:** 2026-07-04
**Prepared by:** AI Agency Command Center (5-team parallel audit)

---

## Executive Summary

**Composite Agency Score: 44 / 100 — Grade C (Below Average)**

Coco is a technically well-built product with a real market and an unfair local advantage, sitting on **near-zero distribution and zero legal/trust scaffolding**. The engineering is done (live on Vercel, affiliate links firing, 6 languages, clean schema, AI-crawler-friendly robots.txt). What's missing is everything that turns a working product into a *business*: it's invisible in search, has no customer proof, no privacy policy or disclaimers, and no reputation footprint. The good news — almost every critical gap is a low-effort fix, and the highest-scoring dimension (Sales opportunity, 68) confirms the underlying opportunity is real. This is a go-to-market and compliance problem, not a product problem.

---

## Company Profile

| Field | Detail |
|---|---|
| Product | Coco — AI travel concierge for Koh Samui (Claude-powered chatbot) |
| Model | B2C free traveler chat + B2B white-label for hotels (3,500 THB/mo, 14-day trial) + affiliate commissions (Viator/Klook/GYG/Booking) |
| Founder | Cyril Joseph (solo), PADI dive instructor, on-island |
| Languages | EN / FR / DE / SV / TH / ZH |
| Stack | Single-page PWA on Vercel, serverless API, Redis analytics |
| Category | Hyper-local AI concierge micro-SaaS |

---

## Score Breakdown

| Dimension | Weight | Score | Weighted | Grade |
|---|---|---|---|---|
| 💼 Sales opportunity | 20% | **68** | 13.6 | B |
| 🤖 GEO / AI search | 20% | **56** | 11.2 | B− |
| 📣 Marketing | 25% | **42** | 10.5 | C |
| ⭐ Reputation | 20% | **27** | 5.4 | D |
| ⚖️ Legal / compliance | 15% | **19** | 2.85 | F |
| **COMPOSITE** | 100% | **44** | **43.6** | **C** |

---

## Critical Findings (prioritized by risk/impact)

1. **⚖️ LEGAL (F, 19) — Regulatory exposure, fix first.** No privacy policy, no terms, no cookie/consent, no affiliate disclosure, no AI-accuracy disclaimer — while explicitly serving EU tourists (GDPR) from Thailand (PDPA) and collecting name/email/phone via the lead form + chat sent to Anthropic. This is the one dimension that can generate *fines and liability*, not just lost revenue. Undisclosed affiliate commissions also breach FTC/EU consumer rules.
2. **📣 MARKETING (C, 42) — The product is invisible.** Branded search returns nothing; sitemap is 4 hash-fragments + omits the revenue page `/hotel-setup`; no blog, no backlinks. Discovery depends entirely on word-of-mouth.
3. **⭐ REPUTATION (D, 27) — No proof anyone uses it.** Zero reviews anywhere, no Google Business Profile, no social profiles, and branded search hijacked by "Coco Samui ASMR" (4.3M-follower TikToker). A hotel GM who googles the product finds nothing.
4. **🤖 GEO (B−, 56) — Strong foundation, no visibility.** robots.txt correctly welcomes GPTBot/ClaudeBot/PerplexityBot and the HTML has real quotable facts + schema — but the SPA has no indexable topical pages and no `/llms.txt`, so AI engines recommend mindtrip.ai / thekohsamuiguide.com instead.
5. **💼 SALES (B, 68) — Real but capped.** ~634 accommodation providers on Samui; 3,500 THB sits at the global category floor (Viqal $99, HiJiffy €105+, Asksuite $150-300). Unfair edge = on-island presence + curated local knowledge. Ceiling ≈ $6K MRR on Samui alone without geographic expansion.

---

## Quick Wins (sorted by effort-to-impact)

| # | Fix | Dimension | Effort | Timeline |
|---|---|---|---|---|
| 1 | Publish privacy policy (GDPR+PDPA) + consent checkbox under lead form | Legal | Low | This week |
| 2 | Add affiliate disclosure line (footer + near booking links) | Legal | Low | This week |
| 3 | Add AI/safety disclaimer in chat UI ("answers may be wrong, not dive-safety advice") | Legal | Low | This week |
| 4 | Fix sitemap: drop hash fragments, add `/hotel-setup`, submit to Search Console | Marketing/GEO | Low | This week |
| 5 | Create `/llms.txt` (services, THB prices, beaches, founder creds) | GEO | Low (1h) | This week |
| 6 | Add Service/Offer + Person schema with real prices | GEO | Low | This week |
| 7 | Create & verify Google Business Profile, seed 5-10 reviews | Reputation | Low | This week |
| 8 | Replace gmail with cyril@coco-samui-ai.com + claim @cocosamuiai socials | Reputation/Sales | Low | This week |
| 9 | "Why Coco beats ChatGPT" comparison block on both pages | Marketing | Low | This week |
| 10 | Convert 1-2 pilot hotels free-for-90-days → named case study + reception QR | Sales/Reputation | Med | This month |
| 11 | Split funnel: dedicated `/hotels` B2B landing (Thai+EN) + 2-min demo video | Sales/Marketing | Med | This month |
| 12 | Publish 3-5 real static pages (/beaches, /diving-sail-rock, /getting-around) | GEO/Marketing | Med | This month |

---

## 90-Day Action Plan

**Phase 1 — Compliance & Credibility (Weeks 1-2) — unblock everything**
Privacy policy + terms + AI/affiliate disclaimers → domain email → Google Business Profile + social handles → fix sitemap + submit to Search Console + `/llms.txt`. *Outcome: legally shippable, findable, professional contact surface before any outreach.*

**Phase 2 — Proof & Positioning (Weeks 3-6)**
Walk in to 1-2 independent resorts, offer 90-day free pilot for a named case study + reception QR → publish testimonials → build dedicated `/hotels` landing with demo video → add "why not ChatGPT" block. *Outcome: third-party proof that unlocks the next 20 sales conversations.*

**Phase 3 — Distribution (Weeks 7-12)**
Publish topical static pages capturing "best beaches Koh Samui" / "Sail Rock diving cost" long-tail → schema for reviews/offers → begin in-person outreach wave to Priority-Rouge hotels during low season → weaponize free-tier data ("Coco answered 214 questions about your area last month"). *Outcome: AI-search citations + a repeatable in-person sales motion.*

---

## Competitive Landscape

- **AI concierge vendors (B2B):** HiJiffy, Asksuite, Viqal, Duve — bundle PMS integration/upsells, charge 1.5-3× more, but are *remote*. Coco's moat: on-island founder + curated Samui data + zero setup fee.
- **AI travel guides (B2C/GEO):** mindtrip.ai, wonderplan.ai, toptours.ai, thekohsamuiguide.com — currently own the AI-search queries Coco should be citing.
- **Local concierges:** MrSamui, Concierge Samui, Private Concierge Samui — also review-light, so 10-15 reviews would grab category leadership cheaply.

---

## Recommended Service Package (for an agency selling to a client like this)

- **Essentials (~$1,000/mo):** Legal pack (privacy/terms/disclaimers, one-time $1-3K) + technical SEO fixes + GBP setup + reputation monitoring.
- **Growth (~$2,500/mo):** + content marketing (topical pages/blog), CRO on `/hotels`, review-generation campaign, `/llms.txt` + schema.
- **Full ($4,500+/mo):** + AI-platform citation monitoring, ongoing compliance, in-market sales enablement (case studies, demo assets, multi-property bundles).

*(For Cyril as solo founder: the Essentials tier is mostly DIY-able this week — see Quick Wins 1-9. Spend money only on the one-time legal drafting.)*

---

## Next Steps

The single highest-value next action is **Phase 1 compliance + a Google Business Profile** — it's a few hours of work, removes the only *legal-risk* dimension, and makes the product findable and credible before the first hotel walk-in. Say the word and I can draft the privacy policy, terms, `/llms.txt`, and the sitemap fix directly into the repo — most of these are files I can add to `public/` right now.
