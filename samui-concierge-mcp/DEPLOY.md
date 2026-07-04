# 🚀 Déploiement — Samui Concierge MCP

✅ Construit, testé, tourne **sans clés**. Un serveur MCP stdio tourne en local,
lancé automatiquement par l'app Claude. Il ne reste qu'**un enregistrement unique**.

## État
- Build : `dist/index.js` ✅
- `.env` créé (clés vides) ✅ — le serveur le lit automatiquement au lancement
- 8 outils vérifiés ✅ — `samui_booking_links` marche déjà ; les outils Google/
  Viator/TripAdvisor renvoient un message clair tant qu'il n'y a pas de clé.

## Enregistrer le serveur dans Claude Desktop (1 seule fois)

1. Ouvre le fichier de config :
   `C:\Users\Cyril\AppData\Roaming\Claude\claude_desktop_config.json`
   (s'il n'existe pas, crée-le avec le contenu de `claude_mcp_config.snippet.json`)
2. Fusionne le bloc `"samui-concierge"` de `claude_mcp_config.snippet.json`
   dans la section `"mcpServers"` (ne supprime pas tes autres serveurs).
3. Ferme et rouvre Claude Desktop. Le serveur apparaît dans les outils MCP.

## Ajouter des clés plus tard (sans retoucher l'app)
Édite simplement `samui-concierge-mcp\.env` et relance Claude. C'est tout —
le lancement utilise `--env-file-if-exists`, donc une seule source de clés.

## Lancer/tester à la main
```bash
cd samui-concierge-mcp
npm start          # = node --env-file-if-exists=.env dist/index.js
```
