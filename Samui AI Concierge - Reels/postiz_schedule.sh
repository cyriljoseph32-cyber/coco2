#!/usr/bin/env bash
# ============================================================
# Samui AI Concierge — Planifie les 3 Reels via Postiz (turnkey)
# ============================================================
# UTILISATION (depuis ce dossier) :
#   export POSTIZ_API_KEY="ta_cle"
#   bash postiz_schedule.sh
#
# Le script : installe postiz si besoin, détecte tes comptes
# Instagram / TikTok / Facebook, uploade les 3 vidéos et crée
# 3 posts EN BROUILLON programmés. Vérifie-les dans Postiz avant publication.
set -e
cd "$(dirname "$0")"

[ -z "$POSTIZ_API_KEY" ] && { echo "❌ export POSTIZ_API_KEY=... d'abord"; exit 1; }
command -v postiz >/dev/null 2>&1 || npm install -g postiz
command -v jq >/dev/null 2>&1 || { echo "❌ installe jq (brew install jq / apt install jq)"; exit 1; }

LIST=$(postiz integrations:list)
ID () { echo "$LIST" | jq -r ".[] | select(.identifier==\"$1\") | .id" | head -1; }
IG=$(ID instagram); TT=$(ID tiktok); FB=$(ID facebook)
echo "Instagram=$IG  TikTok=$TT  Facebook=$FB"
CH=$(printf "%s,%s,%s" "$IG" "$TT" "$FB" | sed 's/,,*/,/g; s/^,//; s/,$//')
[ -z "$CH" ] && { echo "❌ aucun compte IG/TikTok/FB connecté dans Postiz"; exit 1; }

up () { postiz upload "$1" | jq -r '.path'; }
V3=$(up videos/reel3_pov_landed.mp4)
V1=$(up videos/reel1_locals_eat.mp4)
V2=$(up videos/reel2_koh_tao.mp4)

# Calendrier (ICT/UTC+7 -> UTC). Reel POV en premier.
postiz posts:create -t draft -s "2026-06-16T11:00:00Z" -i "$CH" -m "$V3" \
 -c "POV: you just landed in Samui and you've got a local friend in your pocket. 🌴📱 Beaches, food, prices, weather — just ask. Free to try 👉 link in bio . POV : tu viens d'atterrir à Samui et tu as un pote local dans ta poche. 🇫🇷 #kohsamui #pov #thailandtravel #traveltok #islandlife #samui #thailand #travelreels #digitalnomad #visitthailand"

postiz posts:create -t draft -s "2026-06-18T11:00:00Z" -i "$CH" -m "$V1" \
 -c "Stop eating where the tour buses stop. 🛑🌴 Ask Samui AI Concierge where the locals actually go — real spots, real prices, instant answers. Try it free 👉 link in bio . Arrête de manger là où s'arrêtent les bus touristiques. Demande à Samui AI Concierge les vraies adresses locales. 🇫🇷 #kohsamui #samui #thailandtravel #kohsamuifood #traveltips #lamai #chaweng #digitalnomad #islandlife #travelhack"

postiz posts:create -t draft -s "2026-06-20T04:00:00Z" -i "$CH" -m "$V2" \
 -c "Everything you need to know before booking Koh Tao 🤿 Ferries, prices, timing — Samui AI Concierge gives you the local answer in seconds. Try it free 👉 link in bio . Tout ce qu'il faut savoir avant de réserver Koh Tao. Réponse locale en quelques secondes. 🇫🇷 #kohtao #sailrock #scubadiving #kohsamui #thailand #divingthailand #gulfofthailand #samuitravel #backpacking"

echo "✅ 3 Reels créés en BROUILLON et programmés. Ouvre Postiz pour vérifier et publier."
