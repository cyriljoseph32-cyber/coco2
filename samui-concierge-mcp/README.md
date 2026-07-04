# 🥥 Samui Concierge MCP Server

Enrichit la base de données de **Coco** (le concierge IA de Koh Samui) avec des
listings **live et structurés**, et ajoute des **liens affiliés** pour monétiser
chaque recommandation.

## Ce qu'il fait

| Source | Pour quoi | Stockable ? |
|---|---|---|
| **Google Places (New)** | Restaurants, POI, notes, horaires, photos | Oui (cache court) |
| **Viator Partner API** | Tours & activités réservables + **commission** | Oui (TTL < 24h) |
| **TripAdvisor Content API** | Notes/avis live | ❌ Non — affichage live, **on ne stocke que le `location_id`** |
| **Klook / GetYourGuide / Viator** | Liens de réservation affiliés | Liens uniquement |

> ⚠️ Règle importante : TripAdvisor **interdit** de cacher/stocker son contenu
> (sauf le `location_id`). Le serveur marque ces données `cacheable: false` pour
> que Coco ne les enregistre jamais. Google et Viator sont cachés avec un TTL court.

## Outils MCP exposés

- `samui_search_restaurants` — restaurants/POI (Google)
- `samui_get_place_details` — détail d'un `place_id` (horaires, site, tél.)
- `samui_search_activities` — tours & activités (Viator, + lien affilié)
- `samui_get_activity_details` — détail d'un `productCode` Viator
- `samui_tripadvisor_search` — trouve un `location_id` (seul champ stockable)
- `samui_tripadvisor_rating` — note live (affichage seulement)
- `samui_booking_links` — liens affiliés Klook / GYG / Viator (aucune API requise)
- `samui_enrich_listing` — **outil workflow** : prend un lieu de ta base (nom + type)
  et l'enrichit d'un coup sur toutes les sources, en renvoyant un sous-ensemble
  `storable` (seulement ce que tu as le droit de persister).

## Installation

```bash
cd samui-concierge-mcp
npm install
cp .env.example .env      # remplis les clés que tu as
npm run build
```

## Quelles clés obtenir, dans quel ordre

1. **Google Places (New)** — rapide à obtenir.
   console.cloud.google.com → activer *Places API (New)* → Credentials → clé.
   Mets un quota/budget pour éviter les surprises.
2. **Klook + GetYourGuide affiliés** — pas d'API, juste un ID affilié.
   affiliate.klook.com et partner.getyourguide.com. Tu gagnes des commissions
   tout de suite via les liens.
3. **Viator Partner API** — demande d'approbation (quelques jours).
   viator.com/partner. Donne le catalogue activités + commission.
4. **TripAdvisor Content API** — approbation aussi, contraintes d'affichage.
   tripadvisor.com/developers. Optionnel (notes live uniquement).

Le serveur **tourne même sans toutes les clés** : un outil sans clé renvoie un
message clair expliquant comment l'obtenir.

## Brancher le serveur sur Claude (Desktop / Cowork)

Ajoute ceci à ta config MCP client (`claude_desktop_config.json` ou équivalent) :

```json
{
  "mcpServers": {
    "samui-concierge": {
      "command": "node",
      "args": ["C:\\Users\\Cyril\\Claude\\Projects\\Coco Samui\\samui-concierge-mcp\\dist\\index.js"],
      "env": {
        "GOOGLE_PLACES_API_KEY": "...",
        "VIATOR_API_KEY": "...",
        "TRIPADVISOR_API_KEY": "...",
        "KLOOK_AFFILIATE_ID": "...",
        "GETYOURGUIDE_PARTNER_ID": "...",
        "VIATOR_AFFILIATE_PID": "..."
      }
    }
  }
}
```

(Tu peux aussi mettre les clés dans `.env` et lancer `npm start`.)

## Brancher sur le chatbot Coco (Vercel)

Coco tourne sur Vercel et n'est pas un client MCP. Deux options :

- **Option A (simple)** : utilise ce serveur ici, dans Claude, pour générer/rafraîchir
  un fichier de données enrichi (`samui_data.json`) que tu colles dans le
  `SYSTEM_PROMPT` de `api/chat.js`. C'est du batch périodique.
- **Option B (live)** : réutilise les fichiers `src/providers/*` directement dans
  une fonction serverless Vercel (`api/enrich.js`) que `api/chat.js` appelle. Le
  code provider est déjà découplé du protocole MCP exprès pour ça.

## Développement

```bash
npm run dev     # tsx watch
npm run build   # compile vers dist/
npm start       # node dist/index.js (stdio)
```
