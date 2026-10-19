#!/usr/bin/env bash
# ============================================================
# Coco Samui Concierge — Programme les 2 posts de la semaine du 12/10
# via Postiz. À LANCER PAR CYRIL (pas par l'agent) : clé API perso requise.
# ============================================================
# UTILISATION :
#   export POSTIZ_API_KEY="ta_cle_postiz_valide"
#   bash content/marketing-drafts/postiz-semaine-2026-10-12.sh
#
# Rythme 2×/semaine (lundi + jeudi). Les visuels sont les URLs Bloom
# (content/marketing-drafts/semaine-2026-10-12-version-cyril.md) — télécharge-les et remplace les
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

# --- Post 1 — lundi 12/10 19h ICT (12:00 UTC) — plan B quand il pleut ---
postiz posts:create -t draft -s "2026-10-12T12:00:00Z" -i "$CH" \
  -m "https://www.trybloom.ai/img/18790156-5e9c-478e-8b9e-2b9cb43e6d48" \
  -c "Rain in Samui? Don't cancel the day — change the plan. Ask Coco what to do right now: spas, food, indoor spots, backup ideas. Free, 24/7. Ask Coco — link in bio. 🌧️🌴 . Il pleut à Samui ? N'annule pas ta journée, change de plan. Demande à Coco quoi faire maintenant : spas, restos, idées à l'abri. Gratuit, 24/7. Demande à Coco, lien en bio. 🇫🇷 #kohsamui #samui #thailandtravel #rainyday #traveltips #aiconcierge #rainyseason #planb #travelhack #thailand"

# --- Post 2 — jeudi 15/10 19h ICT (12:00 UTC) — Coco parle ta langue ---
postiz posts:create -t draft -s "2026-10-15T12:00:00Z" -i "$CH" \
  -m "https://www.trybloom.ai/img/be3bf1dd-60df-4021-9f3d-447b9e17357e" \
  -c "Ask Coco in your own language. English, French, German, Swedish, Thai or Chinese — Coco answers in yours. Beaches, food, trips, getting around. Free, 24/7. Ask Coco — link in bio. 🌴 . Demande à Coco dans ta langue. Anglais, français, allemand, suédois, thaï ou chinois : Coco te répond dans la tienne. Plages, restos, sorties, transport. Gratuit, 24/7. Demande à Coco, lien en bio. 🇫🇷 #kohsamui #samui #thailandtravel #traveltips #aiconcierge #multilingual #travelwithease #islandlife #solotravel"

echo "✅ 2 posts créés EN BROUILLON dans Postiz — à vérifier et publier/activer toi-même avant qu'ils partent."
