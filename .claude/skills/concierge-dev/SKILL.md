---
name: concierge-dev
description: >
  Lance l'agent dev-concierge : modifications de code du Coco Samui Concierge (app Astro +
  API serverless + serveur MCP) avec smoke test avant livraison. Utiliser quand Cyril
  demande un changement de code sur coco2 ou tape /concierge-dev [demande].
---

# /concierge-dev — développement du Coco Samui Concierge

Réponds à la demande : `$ARGUMENTS`

1. Lis `.claude/agents/dev-concierge.md` et `CLAUDE.md`.
2. Si l'agent `dev-concierge` est disponible comme sous-agent, délègue-lui via le tool
   Agent (subagent_type: `dev-concierge`). Sinon, applique toi-même ses instructions.
3. Workflow : branche de travail → modification (règles TripAdvisor/affiliés respectées,
   racine `public/` jamais touchée) →
   `node --env-file=samui-concierge-mcp/.env scripts/smoke-test.mjs` → commit clair →
   signaler à Cyril (et mettre à jour la mémoire centrale si significatif).

Ne pas confondre avec assistant-ai (front desk) ; gotcha mobile : propriété `translate`,
jamais `transform`.
