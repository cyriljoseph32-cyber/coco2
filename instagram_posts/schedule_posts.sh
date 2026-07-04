#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Coco AI — Instagram Post Scheduler via Postiz
#  Account: @samui.coco.ai
#  Posts: 6 posts, every 2 days, starting tomorrow at 09:00 UTC
# ─────────────────────────────────────────────────────────────

# ⚠️  SET YOUR API KEY HERE (or export it before running)
export POSTIZ_API_KEY="cc80bea26a0d77afbe696e8895dbee7273077e4508bd9be0c887e41a648bef9f"
export PATH="$PATH"  # postiz must be installed: npm install -g postiz

# ─── CONFIG ───────────────────────────────────────────────────
POSTS_DIR="$(dirname "$0")"
INTERVAL_DAYS=2   # days between posts
START_HOUR=9      # post time: 09:00 UTC (16:00 Bangkok)

# ─── STEP 1: Verify API key ────────────────────────────────────
if [ -z "$POSTIZ_API_KEY" ]; then
  echo "❌  POSTIZ_API_KEY is empty. Edit line 9 in this script."
  exit 1
fi

echo "🔍  Checking Postiz integrations..."
INTEGRATIONS=$(postiz integrations:list 2>&1)
echo "$INTEGRATIONS" | head -30

# ─── STEP 2: Get Instagram integration ID ─────────────────────
INSTA_ID=$(echo "$INTEGRATIONS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for i in data:
        if 'instagram' in i.get('identifier','').lower():
            print(i['id'])
            break
except:
    pass
" 2>/dev/null)

if [ -z "$INSTA_ID" ]; then
  echo ""
  echo "❌  Instagram not connected in Postiz."
  echo ""
  echo "   To connect @samui.coco.ai:"
  echo "   1. Go to your Postiz dashboard"
  echo "   2. Settings → Integrations → Add Integration"
  echo "   3. Choose Instagram → Authorize @samui.coco.ai"
  echo "   4. Re-run this script"
  echo ""
  echo "   Available integrations:"
  echo "$INTEGRATIONS"
  exit 1
fi

echo "✅  Instagram integration found: $INSTA_ID"
echo ""

# ─── STEP 3: Define posts ─────────────────────────────────────
declare -a IMAGES=(
  "01_launch.jpg"
  "02_features.jpg"
  "03_hotels.jpg"
  "04_local_expert.jpg"
  "05_free_trial.jpg"
  "06_testimonial.jpg"
)

declare -a CAPTIONS=(
"🌴 Introducing Coco AI — Koh Samui's very first AI travel concierge!

Whether you're looking for the best hidden restaurant, planning your next dive trip, or discovering a secret beach — Coco knows Koh Samui inside out.

✨ 24/7 tips · restaurants · activities · local secrets

Available for travelers & hotels. Free to try!
👉 samui.coco.ai

#KohSamui #TravelAI #CocoAI #KohSamuiTravel #ThailandTravel #TravelTips #AITravel #VisitThailand #IslandLife"

"Ask Coco anything about Koh Samui 🤖

🍜 Best restaurants? Done.
🏄 Activities & adventures? Sorted.
🗺️ Hidden spots no one knows? On it.

Your 24/7 local AI guide — always on, always accurate, always local.

Try it free → samui.coco.ai

#KohSamui #AITravel #TravelGuide #CocoAI #KohSamuiFood #ThailandAdventure #TravelTech #SmartTravel"

"Hotel owners & managers 🏨 — this one's for you.

Give your guests a 24/7 AI concierge that knows Koh Samui better than anyone.

✦ Reduce front desk requests
✦ Boost guest satisfaction
✦ White-label option available
✦ Easy to integrate

Let's talk → samui.coco.ai

#HotelTech #KohSamui #GuestExperience #HospitalityTech #CocoAI #BoutiqueHotel #HotelManagement #TourismTech"

"Local knowledge. AI speed. 🌊

Sail Rock · Fisherman's Village · Lamai · Chaweng · Nathon Pier

Coco AI knows every corner of Koh Samui — from the best sunset spot to the freshest seafood market.

Authentic tips, zero tourist traps. Free to try.
samui.coco.ai

#KohSamui #LocalExpert #HiddenGems #KohSamuiLife #ThailandTravel #IslandLife #OffTheBeatenPath"

"Your 14-day free trial is waiting 🤖✨

No credit card. No sign-up hassle. Cancel anytime.

Pure local AI knowledge about Koh Samui — at your fingertips, 24/7.

Start now → samui.coco.ai

#CocoAI #KohSamui #FreeTrial #TravelApp #AITravel #SmartTravel #KohSamuiTravel #TravelThailand"

"⭐⭐⭐⭐⭐ \"Coco found us the most amazing restaurant we never would have discovered on our own!\"

Join thousands of happy travelers discovering the real Koh Samui with Coco AI.

Free to try → samui.coco.ai

#KohSamui #TravelReview #CocoAI #TravelerTips #ThailandTravel #KohSamuiRestaurants #HappyTraveler"
)

# ─── STEP 4: Calculate schedule dates ─────────────────────────
echo "📅  Scheduling 6 posts every ${INTERVAL_DAYS} days at ${START_HOUR}:00 UTC..."
echo ""

for i in "${!IMAGES[@]}"; do
  IMAGE="${POSTS_DIR}/${IMAGES[$i]}"
  CAPTION="${CAPTIONS[$i]}"

  # Calculate date: today + 1 day + (i * interval_days)
  OFFSET=$(( (i * INTERVAL_DAYS) + 1 ))
  POST_DATE=$(date -u -d "+${OFFSET} days" +"%Y-%m-%dT${START_HOUR}:00:00Z" 2>/dev/null \
           || date -u -v+${OFFSET}d +"%Y-%m-%dT${START_HOUR}:00:00Z")  # macOS fallback

  echo "─────────────────────────────────────"
  echo "Post $((i+1))/6: ${IMAGES[$i]}"
  echo "Scheduled: $POST_DATE"

  # Upload image to Postiz CDN
  echo "  ↑ Uploading image..."
  UPLOAD_RESULT=$(postiz upload "$IMAGE" 2>&1)
  IMAGE_URL=$(echo "$UPLOAD_RESULT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('path', ''))
except:
    pass
" 2>/dev/null)

  if [ -z "$IMAGE_URL" ]; then
    echo "  ❌ Upload failed: $UPLOAD_RESULT"
    continue
  fi
  echo "  ✅ Uploaded: $IMAGE_URL"

  # Schedule post
  echo "  📤 Scheduling..."
  POST_RESULT=$(postiz posts:create \
    -c "$CAPTION" \
    -m "$IMAGE_URL" \
    -s "$POST_DATE" \
    --settings '{"post_type":"post"}' \
    -i "$INSTA_ID" 2>&1)

  POST_ID=$(echo "$POST_RESULT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    pid = data.get('id') or (data.get('posts') or [{}])[0].get('id','')
    print(pid)
except:
    pass
" 2>/dev/null)

  if [ -n "$POST_ID" ]; then
    echo "  ✅ Scheduled! Post ID: $POST_ID"
  else
    echo "  ⚠️  Result: $POST_RESULT"
  fi

  echo ""
done

echo "═══════════════════════════════════════"
echo "✅  Done! Check your Postiz dashboard."
echo "   Posts scheduled every ${INTERVAL_DAYS} days."
echo ""
echo "📋  View all posts:"
postiz posts:list 2>&1 | head -40
