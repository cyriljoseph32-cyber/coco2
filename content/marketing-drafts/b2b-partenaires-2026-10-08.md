# Série B2B partenaires — villas & excursions/activités (08/10/2026)

**BROUILLON — rien n'est publié sans validation de Cyril.**

> Généré par `growth-concierge` le 08/10/2026. Objectif : élargir le recrutement de
> partenaires au-delà des hôtels/resorts déjà ciblés dans `Coco_Partenariats_Pipeline.md`
> (15 resorts avant le 15/12), vers deux segments pas encore couverts par ce pipeline :
> **gestionnaires de villas/conciergeries privées** et **prestataires d'excursions/
> activités** (plongée, bateau, kayak). Convention de nommage créée pour ce livrable —
> aucun fichier `b2b-*` n'existait avant dans `content/marketing-drafts/`.
>
> **Contexte explicitement laissé de côté** : un premier post B2B avait été produit dans
> une session précédente sur l'angle "votre front desk répond aux 10 mêmes questions
> chaque jour" (hôtels/resorts, carrousel IG/FB) — mais n'a jamais été committé (généré
> hors-session). Ce fichier ne le reprend pas : ses deux posts ci-dessous ciblent les
> segments villas et excursions, pas les hôtels/resorts. Si Cyril veut aussi un nouvel
> angle hôtels/resorts, c'est à produire dans une prochaine session.
>
> ⚠️ **Écart détecté entre deux documents du dépôt — signalé plutôt que tranché seul**
> (règle §5 de l'agent) : `site/src/pages/hotels.astro` (page live, prix affiché) indique
> un tarif unique **3 500 THB/mois**, tandis que `COCO_Pricing_Sheet.md` décrit **3 paliers**
> (FREE / PRO 2 900 THB+3 000 THB setup / PREMIUM 6 900–9 900 THB) et positionne
> explicitement "villas" sur le palier PRO. Les deux documents sont d'accord sur
> **l'essai gratuit 14 jours, sans carte** — c'est la seule donnée de prix reprise
> ci-dessous dans les posts publics. **Aucun chiffre THB précis n'est utilisé dans les
> captions tant que Cyril n'a pas confirmé quelle grille est actuelle** — CTA orienté
> "réserve une démo pour le tarif" à la place. [À COMPLÉTER PAR CYRIL : grille de prix
> actuelle à confirmer avant toute prochaine campagne B2B chiffrée.]
>
> **Vérifié contre le produit réel avant d'écrire ces posts :**
> - `site/src/pages/hotels.astro` : la page cible explicitement "FOR HOTELS, VILLAS &
>   RESORTS", champ de formulaire "Property name" (pas seulement "hôtel") — les villas
>   sont donc déjà couvertes côté produit, pas une promesse inventée.
> - `api/lead.js` : le champ `hotel` du formulaire accepte bien n'importe quel nom de
>   propriété (aucune restriction au type "hôtel" dans la validation) — compatible villas.
> - `COCO_Pricing_Sheet.md`, section "Commission partenaires (dive shops, tour
>   operators)" : modèle confirmé pour les prestataires d'activités — **commission 10–15 %
>   sur le réservé tracké, rien facturé d'avance** — différent du modèle d'abonnement
>   hôtels/villas. C'est l'argument utilisé dans le post excursions ci-dessous, pas un
>   chiffre inventé.
> - `api/chat.js` (SYSTEM_PROMPT) : confirme que Coco donne déjà de vrais prix d'excursions
>   en THB (ex. Sail Rock 4 235 THB, Ang Thong ~1 500–2 000 THB, snorkeling Koh Tao) — donc
>   l'argument "Coco recommande vos sorties avec de vrais prix" est honnête.
>
> **Visuels Bloom** générés le 08/10/2026 (brand "Coco",
> `e32bd8b2-9537-447d-a7ac-1be78b76dad1`, 46 crédits dispo avant génération) — statut
> `completed` pour les deux images. ⚠️ Le sandbox ne permet pas de télécharger les images
> trybloom.ai pour inspection pixel par pixel dans cette session (blocage réseau sortant
> connu, cf. notes DanceSoulTherapy) — **vérifier visuellement avant publication** qu'aucun
> texte ou logo factice ne s'est glissé dans l'écran de chat généré (un post précédent,
> 05/10, avait fait apparaître un faux nom de restaurant à l'écran).

---

## Post A — Villas & conciergeries privées — format **awareness** (valeur d'abord)

**Plateforme proposée :** LinkedIn en priorité (décideurs villas/conciergeries, contenu
B2B pur) ; version courte identique diffusable sur Instagram/Facebook si Cyril veut aussi
relayer dans des groupes pro Samui (villa managers, expats business).

**Angle (propre au segment villas, pas repris des posts hôtels) :** un hôtel a une
réception 24/7 ; une villa privée n'en a pas. Quand un invité a une question à 23h
(piscine, wifi, resto ouvert tard, transfert du lendemain), il n'y a personne — sauf si le
gestionnaire est de garde sur son téléphone personnel. Coco comble ce vide précis, pas en
remplaçant un service existant mais en couvrant une absence réelle.

**Légende (EN + FR) :**
> Your villa guests don't have a front desk to call at 11pm. You do — on your personal
> phone, every single time. Coco can be the always-on concierge your villa doesn't have:
> branded to your property, answering guest questions 24/7 in 6 languages, so you're not
> the night shift anymore. Free 14-day trial, no card. Book a 15-min demo — link in bio /
> DM us.
> .
> Vos clients de villa n'ont pas de réception à appeler à 23h. Vous, si — sur votre
> téléphone perso, chaque fois. Coco peut être le concierge disponible 24/7 que votre villa
> n'a pas : à votre marque, 6 langues, pour que vous ne soyez plus l'astreinte de nuit.
> Essai gratuit 14 jours, sans carte. Réservez une démo de 15 min — lien en bio / DM. 🇫🇷

**Visuel généré (Bloom, brand "Coco") :**
https://www.trybloom.ai/img/cece8388-c609-48e4-a142-9caa6f1e888e
(villa privée avec piscine éclairée la nuit, entrée vide — pas de réception — une tablette
sur une table d'appoint affichant un écran de chat IA générique, pas de logo réel, lumière
chaude, plantes tropicales ; ambiance calme mais volontairement "personne n'est là".)

**Hashtags :** #samuivillas #villamanagement #conciergeservice #hospitalitytech
#kohsamui #aiconcierge

**Garde-fou prix :** aucun chiffre THB cité (voir écart de pricing signalé plus haut) —
seule l'offre "essai 14 jours gratuit, sans carte" est reprise, confirmée identique dans
`site/src/pages/hotels.astro` et `COCO_Pricing_Sheet.md`.

**Cibles suggérées pour `partenariats-concierge`** (segment villas, source
`samui_contacts_complets.md` — conciergeries locales déjà identifiées, aucun nom
inventé) : **Samui & Koh** (gestion villas + conciergerie) · **Lime Samui Villas**
(clientèle villa premium) · **Samui Villa Finder** (forte audience en ligne) ·
**Private Concierge Samui** (VIP/lifestyle, cible francophone haut de gamme) ·
**Samujana Villas** (déjà dans le registre `Coco_Partenariats_Pipeline.md` côté
Choeng Mon) — ce segment "conciergeries villas" n'a pas encore de section dédiée dans le
pipeline, à proposer à `partenariats-concierge`.

---

## Post B — Excursions & activités (plongée, bateau, kayak) — format **direct-response**

**Plateforme proposée :** Instagram/Facebook en priorité (ces prestataires et leurs
clients sont plus actifs là que sur LinkedIn), version B2B adaptée publiable aussi sur
LinkedIn ou en groupes Facebook pro Samui si Cyril veut viser les gérants directement.

**Angle (propre au segment excursions, pas repris des posts hôtels/villas) :** ces
prestataires n'ont pas de problème de qualité de service — ils ont un problème de
visibilité face aux voyageurs qui demandent "que faire aujourd'hui" à n'importe qui sauf à
eux. Coco est déjà interrogée par des voyageurs sur ces questions (confirmé : le
SYSTEM_PROMPT de `api/chat.js` répond déjà avec de vrais prix de plongée/excursions) — the
pitch is "Coco recommande déjà des sorties à ses utilisateurs ; soyez la recommandation,
pas l'option payée d'avance."

**Légende (EN + FR) :**
> Every day, travelers ask Coco "what should I do today in Samui" — and Coco already
> answers with real activity prices (diving, boat trips, kayaking). We want your trips to
> be the ones recommended. No upfront cost: Coco refers travelers to you, you pay a
> commission only on bookings that actually convert — nothing paid in advance, nothing if
> it doesn't book. DM us or WhatsApp +66 63 375 3316 to get listed.
> .
> Chaque jour, des voyageurs demandent à Coco "que faire aujourd'hui à Samui" — et Coco
> répond déjà avec de vrais prix d'activités (plongée, bateau, kayak). On veut que vos
> sorties soient celles recommandées. Zéro coût d'avance : Coco oriente les voyageurs vers
> vous, vous ne payez une commission que sur ce qui se réserve vraiment. DM ou WhatsApp
> +66 63 375 3316 pour être référencé. 🇫🇷

**Visuel généré (Bloom, brand "Coco") :**
https://www.trybloom.ai/img/8ecf333f-d8cd-4e4c-a727-e6960976585a
(petit comptoir d'agence de plongée/excursion en bois, un smartphone posé dessus affichant
un écran de chat IA générique — pas de logo réel — recommandant une sortie bateau/snorkeling,
en arrière-plan flou un speedboat sur un ponton, matériel de snorkeling, mer turquoise,
lumière du matin.)

**Hashtags :** #kohsamuidiving #boattour #samuiexcursions #hospitalitytech #kohsamui
#aiconcierge

**Garde-fou offre :** le modèle "commission 10-15 % sur le réservé tracké, rien facturé
d'avance" vient tel quel de `COCO_Pricing_Sheet.md` (section "Commission partenaires —
dive shops, tour operators") — la fourchette exacte (10-15 %) n'est **pas** citée dans la
caption ci-dessus pour rester prudent tant que Cyril n'a pas confirmé qu'elle est toujours
d'actualité ; si confirmée, elle peut être ajoutée en toute sécurité (source écrite dans le
dépôt, pas un chiffre inventé).

**Cibles suggérées pour `partenariats-concierge`** (segment excursions/activités — source
`data/concierge-db/10-excursions-bateau-yachts-iles.json` et
`data/concierge-db/11-plongee-snorkeling-sports-nautiques.json`, fichiers de données
vérifiés le 12/07/2026 par l'agent `data-concierge`, aucun nom inventé) :
**100 Degrees East Dive Team** (PADI 5★, Bangrak) · **Silent Divers** (PADI 5★ IDC,
Chaweng) · **Blue Stars Kayaking** (kayak/snorkeling Ang Thong depuis 1997) ·
**The Red Baron** (croisières jonque, sunset/îles). ⚠️ Ces quatre fiches n'ont pas de
téléphone/email publics dans le fichier source (`contact_status: "partial"` — contact
prévu via formulaire/site web uniquement) : à transmettre tel quel à
`partenariats-concierge`, qui devra approcher via ces canaux plutôt qu'un contact direct
non vérifié. Ce segment "excursions/activités" n'existe pas encore comme section dans
`Coco_Partenariats_Pipeline.md` (qui ne couvre aujourd'hui que les resorts) — à proposer
d'y ajouter une section dédiée.

---

## Récap livraison

| # | Segment | Plateforme proposée | Format | Visuel Bloom | Statut |
|---|---|---|---|---|---|
| A | Villas / conciergeries privées | LinkedIn (+ IG/FB optionnel) | Awareness | ✅ généré | Brouillon — à valider |
| B | Excursions / activités | Instagram/Facebook (+ LinkedIn optionnel) | Direct-response | ✅ généré | Brouillon — à valider |

**Prochaine étape pour Cyril :**
1. Confirmer quelle grille de prix est à jour (3 500 THB unique du site, ou les 3 paliers
   de `COCO_Pricing_Sheet.md`) — tant que ce n'est pas tranché, aucun chiffre n'a été
   utilisé dans les captions ci-dessus au-delà de "essai 14 jours gratuit, sans carte".
2. Vérifier visuellement les deux images Bloom avant publication (texte/logo factice
   éventuel dans l'écran de chat généré — non vérifiable depuis ce sandbox).
3. Choisir la plateforme définitive (LinkedIn vs IG/FB) pour chaque post.
4. Transmettre les listes de cibles ci-dessus à `partenariats-concierge` pour créer les
   sections "villas" et "excursions/activités" dans `Coco_Partenariats_Pipeline.md`
   (actuellement focalisé resorts uniquement).
5. Si la fourchette de commission 10-15 % est confirmée toujours active, l'ajouter
   explicitement à la caption du Post B.
