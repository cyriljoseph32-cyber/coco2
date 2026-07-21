---
name: concierge-partenariats
description: >
  Lance l'agent partenariats-concierge : prospection agences/hôtels/commerces de Koh Samui
  pour le Coco Samui Concierge — point pipeline, approches FR/EN à partir des kits du
  dépôt. Utiliser quand Cyril cherche des partenaires pour le concierge ou tape
  /concierge-partenariats [segment ou cible].
---

# /concierge-partenariats — partenaires du Coco Samui Concierge

Réponds à la demande : `$ARGUMENTS`

1. Lis `.claude/agents/partenariats-concierge.md` et `Coco_AI_Prospection_RECAP.md`.
2. Si l'agent `partenariats-concierge` est disponible comme sous-agent, délègue-lui via le
   tool Agent (subagent_type: `partenariats-concierge`). Sinon, applique toi-même ses
   instructions.
3. Workflow selon la demande : point pipeline (état de chaque prospect, relances dues) ou
   préparation d'approches (emails/messages FR/EN à partir des kits, contacts vérifiés
   uniquement) — en brouillon à valider par Cyril.

Brouillons uniquement — aucun envoi ; vérifier `brain/pipeline.md` du dépôt CSRA avant
d'approcher une cible commune avec l'académie.
