# 🥥 Enrichissement de Coco — live + batch

Deux briques **côté Coco** (Vercel), même logique provider réutilisée
(`api/_providers.js`). Marche sans clés (renvoie les liens affiliés + notes).

## 1) Live — `api/enrich.js`
Endpoint que Coco appelle pendant les conversations. Modes :

- `/api/enrich?mode=places&q=seafood` → restos/POI (Google)
- `/api/enrich?mode=activities&q=Ang%20Thong` → activités (Viator, + lien affilié)
- `/api/enrich?mode=links&q=kayaking` → liens affiliés Klook/GYG/Viator
- `/api/enrich?mode=enrich&q=Coco%20Tams&type=restaurant` → fusion toutes sources

Brancher dans le chat : quand Coco doit recommander, `api/chat.js` peut faire
un `fetch('/api/enrich?...')` et glisser le résultat dans le contexte avant
d'appeler Claude. (Ou appeler directement les fonctions de `_providers.js`.)

## 2) Batch — `scripts/build-samui-data.mjs`
Pour le noyau curé stable. Édite `data/curated.json` (tes lieux choisis), puis :

```bash
cd "Coco Samui"
node --env-file=.env scripts/build-samui-data.mjs
```

Génère `data/samui_data.json` (champs `storable` uniquement — le contenu
TripAdvisor reste live, jamais écrit). Tu injectes ensuite ces données dans le
`SYSTEM_PROMPT` de `api/chat.js`.

## Clés — à mettre en variables d'environnement Vercel
Vercel → ton projet → Settings → Environment Variables :

| Variable | Pour |
|---|---|
| `GOOGLE_PLACES_API_KEY` | restos / POI |
| `VIATOR_API_KEY` | activités réservables |
| `TRIPADVISOR_API_KEY` | notes live (optionnel) |
| `KLOOK_AFFILIATE_ID` | commission Klook (le tien : 12425) |
| `GETYOURGUIDE_PARTNER_ID` | commission GYG (optionnel) |
| `VIATOR_AFFILIATE_PID` | commission Viator (optionnel) |

Après ajout des variables → `vercel --prod` pour redéployer.
En local, les mêmes clés peuvent vivre dans `.env` (déjà présent, gitignored)
et le batch les lit via `node --env-file=.env`.

## Note importante
- Ceci enrichit **Coco** (le chatbot Vercel).
- Le serveur `samui-concierge-mcp` (branché dans l'app Claude) sert de
  **back-office** : il me permet, à moi Claude, de t'aider à fabriquer/vérifier
  ces données. Les deux partagent la même logique.
