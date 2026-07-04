#!/usr/bin/env bash
# ============================================================
# COCO AI CONCIERGE — Schedule Instagram Posts J1 → J9
# Run this from Git Bash or WSL on your Windows machine
# Prerequisite: npm install -g postiz
# ============================================================

set -e

# ── CONFIG ──────────────────────────────────────────────────
export POSTIZ_API_KEY="cc80bea26a0d77afbe696e8895dbee7273077e4508bd9be0c887e41a648bef9f"

# Folder containing your images (adjust if different)
IMAGES_DIR="$(cd "$(dirname "$0")" && pwd)"

# Post time: 19:00 ICT (UTC+7) = 12:00 UTC
# Dates: J1=21/06, J3=23/06, J5=25/06, J7=27/06, J9=29/06
DATE_J1="2026-06-21T12:00:00Z"
DATE_J3="2026-06-23T12:00:00Z"
DATE_J5="2026-06-25T12:00:00Z"
DATE_J7="2026-06-27T12:00:00Z"
DATE_J9="2026-06-29T12:00:00Z"

# ── STEP 1: Get Instagram integration ID ────────────────────
echo ""
echo "🔍 Fetching integrations..."
postiz integrations:list

echo ""
echo "⚠️  Copy your Instagram integration ID from the list above."
echo "    Then paste it below and press ENTER:"
read -r INSTAGRAM_ID

if [[ -z "$INSTAGRAM_ID" ]]; then
  echo "❌ No integration ID provided. Exiting."
  exit 1
fi

echo "✅ Using integration: $INSTAGRAM_ID"

# ── STEP 2: Upload images ────────────────────────────────────
echo ""
echo "📤 Uploading images to Postiz CDN..."

IMG1=$(postiz upload "$IMAGES_DIR/01_launch.jpg")
URL1=$(echo "$IMG1" | python3 -c "import sys,json; print(json.load(sys.stdin)['path'])" 2>/dev/null || echo "$IMG1" | grep -oP '"path"\s*:\s*"\K[^"]+')

IMG2=$(postiz upload "$IMAGES_DIR/02_features.jpg")
URL2=$(echo "$IMG2" | python3 -c "import sys,json; print(json.load(sys.stdin)['path'])" 2>/dev/null || echo "$IMG2" | grep -oP '"path"\s*:\s*"\K[^"]+')

IMG3=$(postiz upload "$IMAGES_DIR/04_local_expert.jpg")
URL3=$(echo "$IMG3" | python3 -c "import sys,json; print(json.load(sys.stdin)['path'])" 2>/dev/null || echo "$IMG3" | grep -oP '"path"\s*:\s*"\K[^"]+')

IMG4=$(postiz upload "$IMAGES_DIR/03_hotels.jpg")
URL4=$(echo "$IMG4" | python3 -c "import sys,json; print(json.load(sys.stdin)['path'])" 2>/dev/null || echo "$IMG4" | grep -oP '"path"\s*:\s*"\K[^"]+')

IMG5=$(postiz upload "$IMAGES_DIR/05_free_trial.jpg")
URL5=$(echo "$IMG5" | python3 -c "import sys,json; print(json.load(sys.stdin)['path'])" 2>/dev/null || echo "$IMG5" | grep -oP '"path"\s*:\s*"\K[^"]+')

echo "✅ Images uploaded:"
echo "   J1 → $URL1"
echo "   J3 → $URL2"
echo "   J5 → $URL3"
echo "   J7 → $URL4"
echo "   J9 → $URL5"

# ── STEP 3: Schedule posts ───────────────────────────────────
echo ""
echo "📅 Scheduling posts..."

# ─── PUB #1 · J1 · 21 juin · Reel "POV: you just landed" ───
echo ""
echo "📌 Scheduling Pub #1 — J1 — $(date -d "$DATE_J1" '+%d/%m/%Y %H:%M UTC' 2>/dev/null || echo "$DATE_J1")"
postiz posts:create \
  -c "POV: you just landed in Koh Samui and you don't know where to start. 🌴

What to eat. Which beach. What's a fair price.

Don't waste your first hours guessing — just ask Coco. 🥥
Your AI travel concierge for Samui. Real local answers in seconds. 6 languages. Free, no signup.

👉 Link in bio.

#kohsamui #travelthailand #samuiisland #pov #traveltips #thailandtravel #kohsamuithailand #islandlife #samuiholiday #aitravel" \
  -m "$URL1" \
  -s "$DATE_J1" \
  -i "$INSTAGRAM_ID"
echo "✅ Pub #1 scheduled!"

# ─── PUB #2 · J3 · 23 juin · Carrousel "5 mistakes" ─────────
echo ""
echo "📌 Scheduling Pub #2 — J3 — $(date -d "$DATE_J3" '+%d/%m/%Y %H:%M UTC' 2>/dev/null || echo "$DATE_J3")"
postiz posts:create \
  -c "Koh Samui is paradise. Unless you make these 5 mistakes. 🌴🚫

❌ Renting a scooter without an international license → police fine ฿2,000+
❌ Taking a taxi without asking the price first → you'll pay 3x
❌ Booking a beach bar at Fisherman's Village on a Tuesday → it's closed
❌ Trusting 5-star Google reviews near hotels → tourist trap
❌ Going to the east coast in November → stormy season, go west

We've seen them all.

Saved this post → you're already ahead of 90% of tourists.

Got more questions? Ask Coco — your free AI local guide 🥥
👉 Link in bio.

#kohsamui #traveltips #thailand #samuitravel #kohsamuiisland #travelthailand #smarttravel #islandlife #samuiholiday #backpackingthailand" \
  -m "$URL2" \
  -s "$DATE_J3" \
  -i "$INSTAGRAM_ID"
echo "✅ Pub #2 scheduled!"

# ─── PUB #3 · J5 · 25 juin · Reel "Where locals eat" ────────
echo ""
echo "📌 Scheduling Pub #3 — J5 — $(date -d "$DATE_J5" '+%d/%m/%Y %H:%M UTC' 2>/dev/null || echo "$DATE_J5")"
postiz posts:create \
  -c "Stop eating where the tour buses stop. 🛑

Ask Coco where the locals actually go — real spots, real prices in THB, no tourist traps.

🥥 Free to try, no signup: link in bio.

#kohsamui #samuifood #kohsamuifood #thaifood #lamai #chaweng #localfood #traveltips #travelthailand #islandlife" \
  -m "$URL3" \
  -s "$DATE_J5" \
  -i "$INSTAGRAM_ID"
echo "✅ Pub #3 scheduled!"

# ─── PUB #4 · J7 · 27 juin · Static B2B "Hotel owners" ──────
echo ""
echo "📌 Scheduling Pub #4 — J7 — $(date -d "$DATE_J7" '+%d/%m/%Y %H:%M UTC' 2>/dev/null || echo "$DATE_J7")"
postiz posts:create \
  -c "Hotel owners, villa managers, resort GMs — this post is for you. 👋

Your guests ask the same questions every day:
🔹 Where to eat?
🔹 How to get to Koh Tao?
🔹 Can you book us a massage?
🔹 What's the weather tomorrow?

Coco answers all of these. 24/7. In 6 languages. Branded with your hotel's name.
And it recommends YOUR services first.

14-day free trial. No setup cost.
DM us "PARTNER" or tap the link in bio. 🥥

#kohsamui #hotelmanagement #hospitalitytech #kohsamuihotel #boutiquehotel #villamanager #traveltech #aitravel #samuibusiness #hotelkohsamui" \
  -m "$URL4" \
  -s "$DATE_J7" \
  -i "$INSTAGRAM_ID"
echo "✅ Pub #4 scheduled!"

# ─── PUB #5 · J9 · 29 juin · Reel "Silver Beach" ────────────
echo ""
echo "📌 Scheduling Pub #5 — J9 — $(date -d "$DATE_J9" '+%d/%m/%Y %H:%M UTC' 2>/dev/null || echo "$DATE_J9")"
postiz posts:create \
  -c "Chaweng is beautiful. But in peak season? 🫠

Silver Beach is Koh Samui's best-kept secret.
Crystal water, almost no crowds, easy parking, great for snorkeling. 🤿

Ask Coco for more hidden spots on the island 🥥
Link in bio.

#kohsamui #silverbeach #samuibeach #hiddenbeach #travelthailand #kohsamuiisland #samuiisland #beach #beachthailand #traveltips" \
  -m "$URL5" \
  -s "$DATE_J9" \
  -i "$INSTAGRAM_ID"
echo "✅ Pub #5 scheduled!"

# ── DONE ─────────────────────────────────────────────────────
echo ""
echo "🎉 All 5 posts scheduled successfully!"
echo ""
echo "Summary:"
echo "  Pub #1 · POV: you just landed  → 21 juin à 19:00 (ICT)"
echo "  Pub #2 · 5 mistakes tourists make → 23 juin à 19:00 (ICT)"
echo "  Pub #3 · Where locals eat       → 25 juin à 19:00 (ICT)"
echo "  Pub #4 · Hotel owners — B2B     → 27 juin à 19:00 (ICT)"
echo "  Pub #5 · Silver Beach hidden gem → 29 juin à 19:00 (ICT)"
echo ""
echo "To verify: postiz posts:list"
