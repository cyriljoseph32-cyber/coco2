---
name: concierge-data
description: >
  Lance l'agent data-concierge : base de listings du Coco Samui Concierge — refresh batch,
  contrôle qualité/fraîcheur, conformité TripAdvisor. Utiliser quand Cyril veut enrichir
  ou vérifier les données du concierge, ou tape /concierge-data [catégorie ou demande].
---

# /concierge-data — données du Coco Samui Concierge

Réponds à la demande : `$ARGUMENTS`

1. Lis `.claude/agents/data-concierge.md` et `CLAUDE.md`.
2. Si l'agent `data-concierge` est disponible comme sous-agent, délègue-lui via le tool
   Agent (subagent_type: `data-concierge`). Sinon, applique toi-même ses instructions.
3. Workflow selon la demande : refresh
   (`node --env-file=samui-concierge-mcp/.env scripts/build-samui-data.mjs` + vérification
   du résultat), audit qualité d'une catégorie (contacts, liens, doublons, fermetures), ou
   contrôle de conformité (aucun contenu TripAdvisor stocké, shape `Listing` respectée).

Un listing non vérifiable n'entre pas en base ; toute anomalie est signalée à Cyril.
