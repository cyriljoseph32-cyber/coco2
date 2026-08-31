#!/usr/bin/env bash
# ============================================================
# Coco Samui Concierge — Programme les 4 posts de la semaine du 31/08
# via Postiz. À LANCER PAR CYRIL (pas par l'agent) : clé API perso requise.
# ============================================================
# UTILISATION :
#   export POSTIZ_API_KEY="ta_cle_postiz_valide"
#   bash content/marketing-drafts/postiz-semaine-2026-08-31.sh
#
# Les visuels sont les URLs Bloom (content/marketing-drafts/semaine-2026-08-31.md) —
# télécharge-les et remplace les chemins ci-dessous si Postiz ne sait pas
# fetcher une URL trybloom.ai directement, ou uploade-les d'abord avec
# `postiz upload <fichier>` et colle le chemin renvoyé.
set -e

[ -z "$POSTIZ_API_KEY" ] && { echo "❌ export POSTIZ_API_KEY=... d'abord (clé perso Cyril)"; exit 1; }
command -v postiz >/dev/null 2>&1 || npm install -g postiz
command -v jq >/dev/null 2>&1 || { echo "❌ installe jq d'abord"; exit 1; }

LIST=$(postiz integrations:list)
ID () { echo "$LIST" | jq -r ".[] | select(.identifier==\"$1\") | .id" | head -1; }
IG=$(ID instagram); FB=$(ID facebook); TT=$(ID tiktok)
CH=$(printf "%s,%s,%s" "$IG" "$FB" "$TT" | sed 's/,,*/,/g; s/^,//; s/,$//')
[ -z "$CH" ] && { echo "❌ aucun compte IG/FB/TikTok connecté dans Postiz"; exit 1; }
echo "Comptes détectés: $CH"

# --- Post 1 — lundi 31/08 19h ICT (12:00 UTC) — Ask Coco ---
postiz posts:create -t draft -s "2026-08-31T12:00:00Z" -i "$CH" \
  -m "https://www.trybloom.ai/img/d292cbac-4ced-488e-abd9-9197dd76dabe" \
  -c "Stop guessing where to eat, what's fair price, or which beach isn't packed with tour buses. 🌴 Ask Coco anything about Koh Samui — real answers, real prices, in seconds. Try it free 👉 link in bio . Arrête de deviner où manger ou quel est le juste prix. Demande à Coco, le concierge IA de Koh Samui. Essai gratuit, lien en bio. 🇫🇷 #kohsamui #samui #thailandtravel #traveltips #aiconcierge #kohsamuitravel #digitalnomad #islandlife #travelhack"

# --- Post 2 — mercredi 02/09 19h ICT (12:00 UTC) — Hidden gems ---
postiz posts:create -t draft -s "2026-09-02T12:00:00Z" -i "$CH" \
  -m "https://www.trybloom.ai/img/394e7247-f53b-4062-8b07-0f98178a5e49" \
  -c "Not every quiet cove on this island is in the guidebooks. 🤫 Coco knows the spots locals actually go — ask before you land, not after you've paid the tourist price. Try it free 👉 link in bio . Toutes les criques tranquilles de l'île ne sont pas dans les guides. Coco connaît les vraies adresses locales. Lien en bio. 🇫🇷 #kohsamui #hiddengem #samuibeach #thailandtravel #islandlife #travelthailand #offthebeatenpath #samui #gulfofthailand"

# --- Post 3 — vendredi 04/09 19h ICT (12:00 UTC) — Practical tips ---
postiz posts:create -t draft -s "2026-09-04T12:00:00Z" -i "$CH" \
  -m "https://www.trybloom.ai/img/a2dc615d-47c9-4336-a942-db41c4630922" \
  -c "3 things every first-timer in Samui should ask before they book anything: 🛵 What's a fair scooter rental price today? 🍜 Where do locals eat near where I'm staying? 🌦️ Is today actually a good beach day? Coco answers all three, free, 24/7. Link in bio. . 3 questions à poser avant de réserver quoi que ce soit à Samui. Coco répond gratuitement, lien en bio. 🇫🇷 #kohsamui #traveltips #thailandtravel #scootersafety #islandlife #samuitravel #backpackingthailand #travelhacks"

# --- Post 4 — dimanche 06/09 19h ICT (12:00 UTC) — Hôtels (B2B) ---
postiz posts:create -t draft -s "2026-09-06T12:00:00Z" -i "$CH" \
  -m "https://www.trybloom.ai/img/a241f1b0-b6a0-45e5-80e5-5b010bca4661" \
  -c "Your guests ask the same questions every day. Coco answers them 24/7, branded for your property. Free 14-day trial for Samui hotels & villas. DM us or WhatsApp +66 63 375 3316. . Vos clients posent toujours les mêmes questions. Coco y répond 24/7, à votre marque. Essai gratuit de 14 jours. 🇫🇷 #kohsamuihotels #hospitalitytech #hoteliers #samui #aiconcierge #hotelmarketing #guestexperience #thailandhospitality"

echo "✅ 4 posts créés EN BROUILLON dans Postiz — à vérifier et publier/activer toi-même avant qu'ils partent."
