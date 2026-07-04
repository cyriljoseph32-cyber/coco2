# Viator Affiliate — Activation Guide

> The code is already written. One env var in Vercel = affiliate links live on every activity recommendation.

---

## Step 1 — Find your Viator Partner ID

1. Go to **[partner.viator.com](https://partner.viator.com)**
2. Sign in to your account
3. Navigate to **Account** → **Partner Details** (or **Account Settings**)
4. Your Partner ID looks like: `P00XXXXXX` or `XXXXXXXXXXXXX`
   - It may also appear as **mcid** or **pid** in your dashboard URLs
   - Example: `P00123456` or `12345678`

> If you can't find it, check any affiliate link you've already generated — it will contain `?pid=` followed by your ID.

---

## Step 2 — Add to Vercel

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click your project → **Settings** → **Environment Variables**
3. Click **Add New**:

| Name | Value |
|------|-------|
| `VIATOR_AFFILIATE_PID` | `P00XXXXXX` ← your actual Partner ID |

4. Select all environments: ✅ Production ✅ Preview ✅ Development
5. Click **Save**
6. **Redeploy** (Vercel → Deployments → click the 3-dot menu on latest → Redeploy, OR push any commit)

---

## Step 3 — Verify it's working

After redeploy, open **[coco-samui-ai.com](https://coco-samui-ai.com)** and ask:

> "What can I do near Koh Tao? I want to go diving."

You should see a **🔗 Réserver / Book** block at the bottom of Coco's reply with a Viator link like:

```
https://www.viator.com/searchResults/all?text=Koh+Tao+diving&pid=P00XXXXXX
```

If `pid=` appears → affiliate tracking is live. ✅

---

## How it works (no action needed)

Every time a guest asks about activities, diving, tours, or experiences, `chat.js` automatically:

1. Detects the activity intent (regex match)
2. Builds a tracked Viator search URL via `bookingLinks(query)` in `_providers.js`
3. Appends it at the bottom of Coco's reply as a "Réserver / Book" block

The `VIATOR_AFFILIATE_PID` is read from Vercel env at runtime. No URLs are hardcoded.

---

## Optional: Klook + GetYourGuide

Same pattern — add these env vars in Vercel for additional affiliate revenue:

| Variable | Where to find it |
|---|---|
| `KLOOK_AFFILIATE_ID` | [affiliate.klook.com](https://affiliate.klook.com) → Dashboard → Affiliate ID |
| `GETYOURGUIDE_PARTNER_ID` | [affiliate.getyourguide.com](https://partner.getyourguide.com) → Account → Partner ID |

---

## Activities now tracked in `data/samui_data.json`

16 top Koh Samui activities with pre-built Viator search URLs (PID appended at runtime):

| Activity | Type | Est. Commission |
|---|---|---|
| Ang Thong Marine Park Day Tour | Activity | ~8–12% of 1,800–2,500 THB |
| Koh Tao Snorkeling Day Trip | Activity | ~8–12% of 1,500–2,200 THB |
| Koh Tao Scuba Diving Day Trip | Activity | ~8–12% of 2,500–4,500 THB |
| Sail Rock Diving from Samui | Activity | ~8–12% of 3,000–5,000 THB |
| Samui Elephant Sanctuary | Activity | ~8–12% of 2,500–3,500 THB |
| Samui Sunset Dinner Cruise | Activity | ~8–12% of 1,800–3,500 THB |
| Thai Cooking Class | Activity | ~8–12% of 1,200–1,800 THB |
| ATV Jungle Tour | Activity | ~8–12% of 1,200–2,000 THB |
| Zipline Canopy Adventure | Activity | ~8–12% of 1,200–2,500 THB |
| Muay Thai Training | Activity | ~8–12% of 500–1,200 THB |
| Koh Phangan Day Trip | Activity | ~8–12% of 600–1,200 THB |
| Namuang Safari Park | Activity | ~8–12% of 600–1,500 THB |
| Big Buddha Island Tour | Attraction | ~8–12% of 500–1,200 THB |
| Fisherman's Village Bophut | Attraction | — |
| Wat Plai Laem | Attraction | — |
| Sa Being Lae Restaurant | Restaurant | — |

> Viator standard affiliate commission: **8%** on completed bookings.
> At 50 activity recommendations/month with 5% conversion → ~**$100–300/month passive** at scale.

---

## Note on `VIATOR_API_KEY`

This is **separate** from the affiliate PID. The API key enables live product search (real product names, photos, prices). The affiliate PID enables commission tracking. You can have commission tracking **without** the API key — Viator search links still work, guests just land on a search results page instead of a specific product.

To get the API key: **[partnerresources.viator.com](https://partnerresources.viator.com)** → apply for API access (takes 1–5 business days after approval of partner account).
