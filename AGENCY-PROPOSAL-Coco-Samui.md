# 🥥 Service Proposal — Coco (AI Concierge Koh Samui)

**Prepared for:** Cyril Joseph, Founder — coco-samui-ai.com
**Date:** 2026-07-04
**Basis:** 5-team Agency Onboard audit (composite 44/100, Grade C) + Phase-1 fixes already shipped

---

## Where things stand

The onboard audit scored Coco **44/100**. Since then, the entire **legal/compliance layer and the GEO technical foundation have already been implemented** (privacy + terms + AI/affiliate disclaimers, consent-gated lead form, `llms.txt`, Service/Offer/Person schema, repaired sitemap). That work alone lifts the two lowest dimensions materially:

| Dimension | Audit score | After Phase-1 fixes | Still needs |
|---|---|---|---|
| ⚖️ Legal | 19 (F) | ~70 (A−)* | Lawyer review, mailbox setup |
| 🤖 GEO | 56 (B−) | ~68 (B)* | Static topical pages, backlinks, indexing |
| 📣 Marketing | 42 (C) | 42 | Content, proof, funnel split |
| ⭐ Reputation | 27 (D) | 27 | GBP, reviews, social profiles |
| 💼 Sales | 68 (B) | 68 | Pilot case studies, in-person motion |

\* *estimated post-deploy; pending `vercel --prod` and a legal review of the templates.*

This proposal covers the **remaining** work as three tiers. Cyril can execute Tier 1 largely himself (it's mostly the free/low-cost quick-wins); Tiers 2–3 are what an agency would run on his behalf, priced at market.

---

## Tier 1 — Essentials · **$500–1,500/month** (or DIY this month)

The credibility floor. Everything a hotel GM checks before replying.

- Deploy the shipped legal/GEO fixes to production; set up `hello@` + `privacy@` mailboxes (forwarding).
- Create & verify **Google Business Profile**; claim `@cocosamuiai` on IG/FB/LinkedIn and link in footer.
- Submit sitemap to Google Search Console + Bing Webmaster Tools; force indexing.
- Seed **first 5–10 reviews** from early travellers/trial hotels via WhatsApp follow-up.
- Monthly reporting: indexing status, review count, uptime.

**Included value:** removes 100% of the legal-risk dimension and the "product is invisible / has no proof" blockers. Most line items are free — the fee is for done-for-you execution + monitoring.

---

## Tier 2 — Growth · **$2,000–3,500/month**

Turn "findable" into "chosen." This is the revenue-driver tier.

- Everything in Essentials, plus:
- **Funnel split**: dedicated `/hotels` B2B landing (Thai + English), 2-min white-label demo video, "Why Coco beats ChatGPT" comparison block.
- **Content/GEO engine**: 3–5 static topical pages (`/beaches`, `/diving-sail-rock`, `/getting-around`) written in direct-answer format → captures Koh Samui search + AI-Overview citations that feed *both* affiliate revenue and B2B leads.
- **Review-generation campaign** (post-chat + trial-hotel requests) → category leadership (competitors are review-thin).
- CRO on `/hotel-setup`: testimonials, demo-booking calendar, exit-intent trial offer.
- Monthly strategy call.

**Included value:** builds the distribution engine the audit found missing (Marketing 42 → target 70+, GEO 68 → 80+).

---

## Tier 3 — Full Agency · **$4,500–6,500/month**

Growth, done-for-you, plus an active sales motion.

- Everything in Growth, plus:
- **In-person sales enablement**: pilot-pitch kit, one-pager per segment, multi-property bundle pricing, case-study production from the first 1–2 pilot hotels.
- **AI-platform citation monitoring** (ChatGPT / Perplexity / Gemini / AI Overviews for Koh Samui queries).
- Ongoing compliance monitoring + affiliate-disclosure upkeep.
- Reputation monitoring & AI-error social listening (crisis early-warning).
- Quarterly strategy review + geographic-expansion plan (Phangan / Phuket).

---

## ROI projection

Coco has **two** revenue lines, so improvements compound:

**B2B (subscriptions):** Samui has ~634 accommodation providers. At 3,500 THB (~$100)/mo:
| Hotels signed | MRR (THB) | MRR (USD) | Annual |
|---|---|---|---|
| 5 (achievable from 2 pilots + referrals) | 17,500 | ~$500 | ~$6,000 |
| 15 | 52,500 | ~$1,500 | ~$18,000 |
| 30 (≈5% penetration) | 105,000 | ~$3,000 | ~$36,000 |

**B2C (affiliate):** at ~50 activity recommendations/mo × 5% conversion × ~8% Viator commission → **~$100–300/mo passive**, scaling with traffic once the content/GEO engine (Tier 2) drives organic visits.

**The unlock:** a single named pilot-hotel case study (Tier 1→2) is what converts the next 20 B2B conversations — the audit's clearest lever. One walk-in pilot pays for months of Tier 1.

---

## Recommendation

Given Coco is a solo-founder product at a ~$100/mo price point, the honest advice is **not** to buy an agency retainer yet. The sequence that fits:

1. **This month (DIY, ~$0):** deploy fixes, mailboxes, GBP, socials, 10 reviews, submit sitemap. → Tier-1 outcomes for free.
2. **Weeks 3–6:** land 1–2 free 90-day pilots → first case study.
3. **Then**, if time is the constraint, hand Tier-2 content/GEO to an agency (or me) so you stay on the beach selling in person — your unfair advantage no remote competitor has.

---

## 90-Day Timeline

| Weeks | Focus | Owner |
|---|---|---|
| 1–2 | Deploy fixes, mailboxes, GBP, socials, Search Console, seed reviews | Founder (Tier 1) |
| 3–6 | 1–2 pilot hotels → case study; `/hotels` landing + demo video | Founder + agency (Tier 2) |
| 7–12 | Static topical pages, review campaign, in-person outreach wave (low season) | Agency (Tier 2–3) |

## Case studies
*(placeholders — to be filled after first pilots)*
- **[Pilot Hotel #1]** — "Coco answered ___ guest questions in 90 days; ___ bookings via QR."
- **[Pilot Hotel #2]** — quote from GM on multilingual after-hours coverage.

---

## Next step
Deploy Phase 1 to production (`vercel --prod`) and book two pilot walk-ins this week. Everything else follows from that first case study.
