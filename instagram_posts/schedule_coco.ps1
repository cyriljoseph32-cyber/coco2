$env:POSTIZ_API_KEY = "cc80bea26a0d77afbe696e8895dbee7273077e4508bd9be0c887e41a648bef9f"
$INTEGRATION = "cmqgigpl301iio80yfzquv1sf"
$SETTINGS = "{`"post_type`":`"post`"}"

# ── PUB #1 · J1 · 21 juin 19:00 ICT ────────────────────────
$cap1 = @"
POV: you just landed in Koh Samui and you don't know where to start. 🌴

What to eat. Which beach. What's a fair price.

Don't waste your first hours guessing — just ask Coco. 🥥
Your AI travel concierge for Samui. Real local answers in seconds. 6 languages. Free, no signup.

👉 Link in bio.

#kohsamui #travelthailand #samuiisland #pov #traveltips #thailandtravel #kohsamuithailand #islandlife #samuiholiday #aitravel
"@
Write-Host "📌 Scheduling Pub #1 — J1 (21 juin 19:00 ICT)..."
postiz posts:create -c $cap1 -m "https://uploads.postiz.com/EMMc3LZIoc.jpg" -s "2026-06-21T12:00:00Z" --settings $SETTINGS -i $INTEGRATION
Write-Host "✅ Pub #1 done!`n"

# ── PUB #2 · J3 · 23 juin 19:00 ICT ────────────────────────
$cap2 = @"
Koh Samui is paradise. Unless you make these 5 mistakes. 🌴🚫

❌ Renting a scooter without an international license → police fine ฿2,000+
❌ Taking a taxi without asking the price first → you'll pay 3x
❌ Booking a beach bar at Fisherman's Village on a Tuesday → it's closed
❌ Trusting 5-star Google reviews near hotels → tourist trap
❌ Going to the east coast in November → stormy season, go west

We've seen them all. Saved this post → you're already ahead of 90% of tourists.

Got more questions? Ask Coco — your free AI local guide 🥥
👉 Link in bio.

#kohsamui #traveltips #thailand #samuitravel #kohsamuiisland #travelthailand #smarttravel #islandlife #samuiholiday #backpackingthailand
"@
Write-Host "📌 Scheduling Pub #2 — J3 (23 juin 19:00 ICT)..."
postiz posts:create -c $cap2 -m "https://uploads.postiz.com/3Jbs1FH9De.jpg" -s "2026-06-23T12:00:00Z" --settings $SETTINGS -i $INTEGRATION
Write-Host "✅ Pub #2 done!`n"

# ── PUB #3 · J5 · 25 juin 19:00 ICT ────────────────────────
$cap3 = @"
Stop eating where the tour buses stop. 🛑

Ask Coco where the locals actually go — real spots, real prices in THB, no tourist traps.

🥥 Free to try, no signup: link in bio.

#kohsamui #samuifood #kohsamuifood #thaifood #lamai #chaweng #localfood #traveltips #travelthailand #islandlife
"@
Write-Host "📌 Scheduling Pub #3 — J5 (25 juin 19:00 ICT)..."
postiz posts:create -c $cap3 -m "https://uploads.postiz.com/vzLjIE2CH7.jpg" -s "2026-06-25T12:00:00Z" --settings $SETTINGS -i $INTEGRATION
Write-Host "✅ Pub #3 done!`n"

# ── PUB #4 · J7 · 27 juin 19:00 ICT ────────────────────────
$cap4 = @"
Hotel owners, villa managers, resort GMs — this post is for you. 👋

Your guests ask the same questions every day:
🔹 Where to eat?
🔹 How to get to Koh Tao?
🔹 Can you book us a massage?
🔹 What's the weather tomorrow?

Coco answers all of these. 24/7. In 6 languages. Branded with your hotel's name.
And it recommends YOUR services first.

14-day free trial. No setup cost.
DM us "PARTNER" or tap the link in bio. 🥥

#kohsamui #hotelmanagement #hospitalitytech #kohsamuihotel #boutiquehotel #villamanager #traveltech #aitravel #samuibusiness #hotelkohsamui
"@
Write-Host "📌 Scheduling Pub #4 — J7 (27 juin 19:00 ICT)..."
postiz posts:create -c $cap4 -m "https://uploads.postiz.com/arr1igHXeh.jpg" -s "2026-06-27T12:00:00Z" --settings $SETTINGS -i $INTEGRATION
Write-Host "✅ Pub #4 done!`n"

# ── PUB #5 · J9 · 29 juin 19:00 ICT ────────────────────────
$cap5 = @"
Chaweng is beautiful. But in peak season? 🫠

Silver Beach is Koh Samui's best-kept secret.
Crystal water, almost no crowds, easy parking, great for snorkeling. 🤿

Ask Coco for more hidden spots on the island 🥥
Link in bio.

#kohsamui #silverbeach #samuibeach #hiddenbeach #travelthailand #kohsamuiisland #samuiisland #beach #beachthailand #traveltips
"@
Write-Host "📌 Scheduling Pub #5 — J9 (29 juin 19:00 ICT)..."
postiz posts:create -c $cap5 -m "https://uploads.postiz.com/gcjWfHMH7P.jpg" -s "2026-06-29T12:00:00Z" --settings $SETTINGS -i $INTEGRATION
Write-Host "✅ Pub #5 done!`n"

Write-Host "🎉 All 5 posts scheduled on @samui.coco.ai!"
Write-Host "Run 'postiz posts:list' to verify."
