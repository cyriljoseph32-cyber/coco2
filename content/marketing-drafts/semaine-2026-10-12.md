# Posts Instagram — semaine du 12/10/2026 (BROUILLON — à valider par Cyril)

> Demandé par Cyril le 12/10 : « mets deux post coco ». Rythme 2×/semaine (lundi + jeudi)
> confirmé le 05/10. Appliquent la règle §4bis de `growth-concierge` (CTA trafic,
> alternance direct-response / awareness, partenaires suggérés). Rien n'est publié.
> Les deux visuels Bloom ont été **vérifiés à l'œil** : aucun texte lisible, aucun logo,
> aucun nom de lieu ou de marque dans les écrans de chat (barres et bulles abstraites).

---

## Post 1 — "Ask Coco" (pilier voyageurs, lundi 12/10) — format **direct-response**

**Angle :** le plan B quand il pleut. Octobre est en saison des pluies : un voyageur
bloqué sous l'averse cherche quoi faire. Vérifié contre `api/chat.js` : Coco récupère la
météo en direct (`getCurrentWeather`) et connaît restaurants, spas, massages, activités
couvertes — l'affirmation est réelle. Angle neuf (le 07/09 était un post "saison des
pluies" général ; celui-ci vise le moment précis où l'on est coincé).

**Visuel (Bloom, brand "Coco") :** https://www.trybloom.ai/img/18790156-5e9c-478e-8b9e-2b9cb43e6d48
(main tenant un smartphone sous une terrasse en bois pendant une averse, palmiers
ruisselants, mer turquoise floue, café et noix de coco. Écran = bulles abstraites.)

**Légende (EN + FR) :**
> Rain in Samui? Don't cancel the day — change the plan. Ask Coco what to do right now:
> spas, food, indoor spots, backup ideas. Free, 24/7. Ask Coco — link in bio. 🌧️🌴
> .
> Il pleut à Samui ? N'annule pas ta journée, change de plan. Demande à Coco quoi faire
> maintenant : spas, restos, idées à l'abri. Gratuit, 24/7. Demande à Coco, lien en bio. 🇫🇷
>
> #kohsamui #samui #thailandtravel #rainyday #traveltips #aiconcierge

**Hashtags secondaires :** #rainyseason #planb #travelhack #thailand

**Partenaires locaux suggérés (thème : activités à l'abri / spas, zone Bophut — source
`samui_contacts_complets.md`, jamais suggérés par un post précédent) :**
Anantara Bophut Koh Samui · Bandara Resort & Spa · Hansar Samui Resort & Spa. Angle
pour `partenariats-concierge` : « vos clients bloqués par la pluie vous demandent un plan B
à la réception — Coco répond à votre place ». Aucun n'est contacté à ce jour.

---

## Post 2 — Practical tips (pilier voyageurs, jeudi 15/10) — format **awareness**

**Angle :** Coco parle ta langue. Le prompt système de `api/chat.js` détecte et répond en
6 langues : anglais, français, allemand, suédois, thaï, chinois. Angle neuf : aucun post
précédent n'a mis la langue en avant. Pas de chiffre de performance, pas de promesse
hors produit.

**Visuel (Bloom, brand "Coco") :** https://www.trybloom.ai/img/be3bf1dd-60df-4021-9f3d-447b9e17357e
(trois voyageurs qui rient à une table de plage au coucher du soleil, chacun sur son
téléphone, un écran tourné vers l'objectif avec des bulles abstraites.)

**Légende (EN + FR) :**
> Ask Coco in your own language. English, French, German, Swedish, Thai or Chinese — Coco
> answers in yours. Beaches, food, trips, getting around. Free, 24/7. Ask Coco — link in
> bio. 🌴
> .
> Demande à Coco dans ta langue. Anglais, français, allemand, suédois, thaï ou chinois :
> Coco te répond dans la tienne. Plages, restos, sorties, transport. Gratuit, 24/7.
> Demande à Coco, lien en bio. 🇫🇷
>
> #kohsamui #samui #thailandtravel #traveltips #aiconcierge

**Hashtags secondaires :** #multilingual #travelwithease #islandlife #solotravel

**Partenaires locaux suggérés (thème : clientèle internationale, zone Chaweng — source
`samui_contacts_complets.md`, jamais suggérés avant) :** Centara Reserve Samui · SALA Samui
Chaweng Beach · Amari Koh Samui. Angle : « vos clients viennent de partout, Coco leur répond
dans leur langue ». Aucun n'est contacté à ce jour.

---

## Récap livraison

| # | Jour | Pilier | Format | Visuel | Statut |
|---|---|---|---|---|---|
| 1 | Lundi 12/10 | Ask Coco (plan B pluie) | Direct-response | ✅ généré et vérifié | Brouillon — à valider |
| 2 | Jeudi 15/10 | Practical tips (6 langues) | Awareness | ✅ généré et vérifié | Brouillon — à valider |

**Programmation :** `postiz-semaine-2026-10-12.sh` (à lancer par Cyril avec sa clé API).
