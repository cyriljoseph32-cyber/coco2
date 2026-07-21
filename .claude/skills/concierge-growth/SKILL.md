---
name: concierge-growth
description: >
  Lance l'agent growth-concierge : exécution des plans marketing/SEO/réseaux sociaux du
  Coco Samui Concierge — contenus et campagnes en brouillon, point d'avancement des plans.
  Utiliser quand Cyril veut faire avancer l'acquisition du concierge ou tape
  /concierge-growth [plan ou livrable].
---

# /concierge-growth — croissance du Coco Samui Concierge

Réponds à la demande : `$ARGUMENTS`

1. Lis `.claude/agents/growth-concierge.md` et les plans à la racine du dépôt
   (`COCO_Plan_Marketing.md`, `COCO_Plan_SEO.md`, `COCO_Plan_Reseaux_Sociaux.md`,
   `Plan_Campagne_Samui_AI_Concierge_4semaines.md`).
2. Si l'agent `growth-concierge` est disponible comme sous-agent, délègue-lui via le tool
   Agent (subagent_type: `growth-concierge`). Sinon, applique toi-même ses instructions.
3. Workflow selon la demande : point d'avancement des plans (où on en est, prochaine
   action au meilleur impact) ou production d'un livrable prévu (post, contenu SEO, texte
   de campagne) — en brouillon à valider.

Brouillons uniquement — rien n'est publié ; chiffres et prix non fixés =
`[À COMPLÉTER PAR CYRIL]`.
