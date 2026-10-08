#!/usr/bin/env bash
# ============================================================
# Coco Samui Concierge — Programme les 2 posts de la semaine du 05/10
# via Postiz. À LANCER PAR CYRIL (pas par l'agent) : clé API perso requise.
# ============================================================
# UTILISATION :
#   export POSTIZ_API_KEY="ta_cle_postiz_valide"
#   bash content/marketing-drafts/postiz-semaine-2026-10-05.sh
#
# Rythme 2×/semaine (lundi + jeudi). Les visuels sont les URLs Bloom
# (content/marketing-drafts/semaine-2026-10-05.md) — télécharge-les et remplace les
# chemins ci-dessous si Postiz ne sait pas fetcher une URL trybloom.ai directement, ou
# uploade-les d'abord avec `postiz upload <fichier>` et colle le chemin renvoyé.
#
# ⚠️ Avant d'exécuter : vérifier visuellement les deux visuels Bloom (aucun texte/logo
# factice dans l'écran de chat généré — non vérifié depuis le sandbox de génération).
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

# --- Post 1 — lundi 05/10 19h ICT (12:00 UTC) — Ask Coco (10 onglets) ---
postiz posts:create -t draft -s "2026-10-05T12:00:00Z" -i "$CH" \
  -m "https://www.trybloom.ai/img/f4c0fcae-d1de-492e-adc6-d91cff2e3988" \
  -c "Stop juggling 10 tabs to plan your day in Samui. Weather, food, activities, getting around — one chat, real answers, free. 🌴 Ask Coco — link in bio. . Arrête de jongler avec 10 onglets pour organiser ta journée à Samui. Météo, restos, activités, transport — un seul chat, de vraies réponses, gratuit. Demande à Coco, lien en bio. 🇫🇷 #kohsamui #samui #thailandtravel #traveltips #aiconcierge #travelplanning #traveltech #islandlife #onestopapp"

# --- Post 2 — jeudi 08/10 19h ICT (12:00 UTC) — Practical tips (prix excursions) ---
postiz posts:create -t draft -s "2026-10-08T12:00:00Z" -i "$CH" \
  -m "https://www.trybloom.ai/img/c8ff7c61-43c1-42fa-afa6-4de35aa612f0" \
  -c "Before you book that island day trip, ask Coco if the price is actually fair. Ang Thong, Koh Tao, Sail Rock — Coco knows the real going rates, not the tourist-desk markup. Free, 24/7. Ask Coco — link in bio. . Avant de réserver ton excursion à la journée, demande à Coco si le prix est juste. Ang Thong, Koh Tao, Sail Rock — Coco connaît les vrais tarifs, pas le prix gonflé du comptoir touristique. Gratuit, 24/7. Demande à Coco, lien en bio. 🇫🇷 #kohsamui #samui #thailandtravel #traveltips #aiconcierge #angthong #kohtao #daytrip #travelhack"

echo "✅ 2 posts créés EN BROUILLON dans Postiz — à vérifier et publier/activer toi-même avant qu'ils partent."
