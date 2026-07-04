# AUDIT BRUTAL — SAMUI AI CONCIERGE (« Coco »)
**Date : 21 juin 2026 · Auditeur : posture investisseur / opérateur SaaS**
**Verdict en une ligne : un MVP réel, vivant et bien plus avancé que 95 % des "idées" — mais qui se vend comme un produit B2B alors qu'il n'a pas encore le seul morceau qui retient un hôtel (le dashboard) ni le morceau qui rapporte en B2C (l'affiliation est éteinte). Tu n'as pas un problème de produit. Tu as un problème de preuve et de monétisation.**

> Je ne te ménage pas, c'est ce que tu as demandé. Mais lis bien la dernière section : le projet est sauvable et même prometteur si tu changes 3 décisions cette semaine.

---

## 0. CE QUI EXISTE VRAIMENT (état des lieux factuel, pas le pitch)

J'ai lu le code, la data, les variables d'environnement, les kits de prospection et les supports. Voici la réalité, pas la brochure :

**Ce qui est construit et marche :**
- Une app web déployée sur Vercel (`coco-samui-ai.com`) : SPA + fonctions serverless.
- `api/chat.js` : chatbot propulsé par Claude, **avec un énorme prompt système codé en dur** contenant hôtels, centres de plongée, tours, prix en THB. Détection + réponse en 6 langues (EN/FR/DE/SV/TH/ZH). Rate-limiting basique.
- Enrichissement live optionnel : Google Places, Viator, OpenWeather (clés présentes), TripAdvisor (absente). Dégradation gracieuse si une clé manque.
- PWA complète (manifest, service worker, bouton "Install", icônes).
- `widget.js` (intégration site), `hotel-setup.html`, QR par hôtel avec UTM trackés (`?hotel=slug&utm_source=inroom`).
- `api/lead.js` (capture de leads), `api/enrich.js`, données `samui_data.json` (~60 listings notés) + `curated.json`.
- Un serveur MCP séparé (`samui-concierge-mcp`) avec providers Google/TripAdvisor/Viator/affiliate.
- Arsenal commercial : 2 pitch decks (FR+EN), 1-pagers, cartes de chambre, générateur de QR, kit outreach complet, 34 brouillons Gmail, tableur de prospection (~60 cibles), kit comptes sociaux, plan reels.

**Ce qui N'EST PAS construit (mais que tes instructions de projet décrivent comme si ça l'était) :**
- ❌ **La base Supabase, le scoring de confiance, l'anti-hallucination, l'admin back-office, les pages SEO générées** — tout ça est une *architecture rêvée* dans les consignes du projet. La réalité est : un prompt statique + un petit JSON. **C'est l'écart le plus dangereux du projet** (voir §3 et §6).
- ❌ **Le dashboard hôtel** — explicitement reporté "après le 1er client payant". Or c'est LA chose qui empêche un hôtel de résilier.
- ❌ **Stockage des leads** : `api/lead.js` écrit dans `/tmp/leads.jsonl` — **éphémère sur Vercel, donc tes leads sont perdus** — et `LEAD_NOTIFY_WEBHOOK` est vide. Si un hôtel remplit le formulaire ce soir, tu ne le sauras jamais.
- ❌ **Monétisation B2C** : `VIATOR_AFFILIATE_PID` est **vide**. Toute l'infra d'affiliation existe mais ne génère **0 THB**. Tu fais de la pub gratuite pour Viator.

**Traduction investisseur :** tu as un produit qui *démontre* bien et *encaisse* mal. C'est exactement l'inverse de ce qu'il faut pour lever ou pour vivre du projet.

---

## 1. AUDIT EXÉCUTIF — NOTES SUR 10

| Dimension | Note | Justification courte |
|---|---|---|
| **Produit** | 6/10 | MVP réel, multilingue, déployé, PWA. Mais cœur = prompt statique qui périme, leads perdus, affiliation éteinte. |
| **Marché** | 5/10 | Koh Samui ≈ 200-300 hôtels adressables + villas. Marché réel mais **étroit et saisonnier**. Pas un marché à 500 k€. |
| **Différenciation** | 4/10 | "Local + 6 langues + pousse vos services" est crédible mais **non défendable** : ChatGPT fait 80 % gratuitement, et n'importe qui peut copier le prompt en un week-end. |
| **UX** | 6/10 | Chat propre, install PWA maligne, QR en chambre = bon vecteur. Mais SPA mono-page, conversion non instrumentée. |
| **Branding** | 6/10 | "Coco 🥥" est mémorable, chaleureux, juste pour Samui. Identité visuelle légère (icônes placeholder, pas de vrai logo). |
| **Scalabilité** | 3/10 | Connaissance codée en dur par île = **non scalable** tel quel. Chaque nouvelle destination = réécrire un prompt à la main. Pas de DB, pas d'admin. |
| **Acquisition** | 4/10 | 100 % manuel (Gmail perso, 5-8 mails/jour, Excel). Honnête mais **ne passe pas l'échelle** et plafonne au temps d'un homme. |
| **Rétention** | 2/10 | **Point le plus faible.** Aucun dashboard, aucune preuve de valeur mensuelle → un hôtel qui paie 3 500 THB résiliera au 2e mois s'il ne "voit" rien. |
| **Rentabilité** | 4/10 | Coûts quasi nuls (Vercel + API Claude). Mais revenu réel aujourd'hui = **0** (aucun payant confirmé, affiliation off). Marge théorique excellente, marge réelle inexistante. |
| **Potentiel global** | 5/10 | Bon "lifestyle business" possible (1-3 k€/mois net) ; **faible** comme startup VC-scalable. Le potentiel dépend entièrement d'un repositionnement. |

**Moyenne pondérée ≈ 4,5 / 10.** Pour un projet solo sans budget, c'est honorable. Pour un investisseur à 500 k€, c'est un "non" en l'état — pas à cause de l'exécution (qui est impressionnante en solo) mais à cause de la **taille de marché** et du **fossé concurrentiel inexistant**.

---

## 2. AUDIT INVESTISSEUR

**Investirais-je 500 000 € ? → Non. Mettrais-je 15-20 k€ ou mon temps ? → Peut-être, sous conditions.**

- **Pourquoi non à 500 k€ :** le marché total adressable (Koh Samui hôtels + villas) ne peut pas, mathématiquement, rendre 500 k€. ~250 hôtels × 3 500 THB × 12 = ~10,5 M THB/an ≈ **260 k€ de plafond théorique absolu** si tu prends 100 % du marché (impossible). Réaliste : 20-40 clients = 28-56 k€ ARR. Un fonds ne touche pas ça. Ce n'est pas un défaut de toi, c'est un défaut de **cadrage** : tu pitches une "plateforme" mais tu décris une **agence locale outillée par l'IA**.
- **Risque principal #1 :** la concurrence à coût zéro. Le voyageur a déjà ChatGPT/Gemini/Google Maps gratuits dans sa poche. Ton seul rempart B2C est "données locales fraîches + commission" — et l'affiliation est éteinte.
- **Risque principal #2 (le vrai tueur) :** la **rétention B2B**. Sans dashboard, ta valeur perçue tombe à zéro après la nouveauté. Churn = mort lente.
- **Levier principal :** **toi.** Instructeur de plongée + éducateur + opérateur local trilingue, sur l'île, avec un réseau. Ton vrai produit n'est pas le chatbot, c'est **"un local de confiance qui distribue des clients aux prestataires et fait gagner du temps aux hôtels"**. Le chatbot est le prétexte qui ouvre la porte.
- **Potentiel réel à 3 ans (honnête) :**
  - *Scénario pessimiste :* side-project, 5-10 hôtels, ~1 000 €/mois, abandonné quand tu pars en Suède.
  - *Scénario réaliste :* 25-40 clients B2B + affiliation activée = **3-6 k€/mois net**, un vrai revenu d'appoint familial, transférable/vendable ~30-60 k€.
  - *Scénario optimiste :* tu transformes Coco en **agence d'affiliation locale** (Samui + Phangan + Tao), revenu mixte abo + commissions = **8-12 k€/mois**, vendable à un acteur du tourisme local.

---

## 3. AUDIT BUSINESS MODEL

**Modèle actuel : abonnement B2B (3 500 THB/mois) + affiliation B2C (éteinte).**

**Ce qui cloche :**
1. **Le prix unique 3 500 THB ne segmente rien.** Un Four Seasons et un guesthouse à 600 THB/nuit paient pareil ? Le luxe paierait 3-5×, le budget ne paiera jamais 3 500. Tu laisses de l'argent sur la table en haut et tu te fermes le bas.
2. **Revenu = abo seul, alors que ton actif unique c'est l'affiliation.** Tu as inversé les priorités. L'abonnement est *difficile* à vendre (il faut convaincre, facturer, retenir). L'affiliation est *automatique* (commission sur chaque réservation) et c'est ton avantage de local. **Active Viator/Klook AVANT de vendre un seul abo.**
3. **Coûts cachés réels :** support client en 6 langues (c'est TOI, 24/7), maintenance de la donnée (les prix codés en dur périment → un hôtel qui voit Coco citer un prix faux te vire), churn, et surtout **ton temps** — le coût le plus cher et invisible.
4. **CAC actuel ≈ ton temps × taux de conversion bas du cold email** (1-3 % de réponse positive en cold email hôtelier). Pour 40 clients il te faut ~1 500-2 000 contacts. Insoutenable en solo manuel.
5. **LTV fragile** sans rétention : si churn = 50 %/an, LTV ≈ 2× le mensuel ≈ 7 000 THB ≈ 180 €. Avec un CAC en temps réel élevé, l'unit economics ne tient que parce que tu ne te paies pas.

**Business model amélioré (recommandé) :**

| Brique | Aujourd'hui | Proposé |
|---|---|---|
| **Affiliation B2C** | Éteinte (0) | **Pilier #1.** Activer Viator + Klook + GetYourGuide. Commission 5-12 % sur tours/plongée/transferts. Revenu sans vendre. |
| **Abo B2B segmenté** | 3 500 THB flat | **Free** (widget basique, ta marque) → **Pro 2 900 THB** (white-label + QR trackés) → **Premium 6 900-9 900 THB** (dashboard + "vos services d'abord" + reporting mensuel) pour le luxe. |
| **Setup fee** | 0 | 3 000-5 000 THB one-shot d'installation/branding → finance ton temps, qualifie le sérieux du client. |
| **Commission partenaires** | Évoquée | Contrats simples avec dive shops / tour ops : Coco les pousse, tu prends 10-15 % sur le réservé tracké. **C'est ça ton vrai métier.** |
| **Revenu "data/contenu"** | 0 | Plus tard : pages SEO monétisées (affiliation) — voir §6. |

**Cible 12 mois réaliste :** 15 abos Premium/Pro (~60 k THB/mois) + affiliation (20-50 k THB/mois selon trafic) = **80-110 k THB/mois ≈ 2-2,8 k€/mois**. MRR/ARR : viser **3 000 € MRR / 36 k€ ARR** fin d'année 1. Crédible. 500 k€ : non.

---

## 4. AUDIT B2C

**Intérêt voyageur : réel mais faible en valeur captée.** Un touriste *utilisera* Coco s'il tombe dessus (QR chambre, lien hôtel), mais ne le *cherchera* pas.

- **Concurrence ChatGPT/Gemini :** brutale. "Que faire à Koh Samui par temps de pluie ?" → ChatGPT répond très bien, gratuitement, sans QR. **Ton seul avantage : fraîcheur locale vérifiée + liens de réservation.** Or les prix sont codés en dur (périment) et l'affiliation est off. Donc aujourd'hui **tu n'as aucun avantage activé** face à ChatGPT.
- **Concurrence Google :** Maps + Search + avis = le réflexe par défaut. Coco ne gagne que dans le contexte "je suis dans la chambre, j'ai un QR, c'est à la marque de l'hôtel".
- **Concurrence TikTok :** c'est là que se fait la *découverte* ("things to do Koh Samui"). Coco devrait y être présent en contenu (tes reels existent — bien) pour capter en haut du funnel.
- **Probabilité d'adoption directe (B2C autonome) :** faible. **Probabilité via hôtel/QR :** moyenne-bonne. → **Conclusion : le B2C n'est pas un canal d'acquisition, c'est un canal de monétisation (affiliation) alimenté par le B2B.**

**Améliorations B2C prioritaires :**
1. **Activer l'affiliation immédiatement** (sinon le B2C ne sert à rien financièrement).
2. **Garantir la fraîcheur** : basculer les prix/horaires sensibles vers Google Places live au lieu du prompt statique, OU afficher "prix indicatif, vérifié [date]" — sinon une seule erreur de prix détruit la confiance.
3. **Capturer l'email/WhatsApp** du voyageur en échange d'un itinéraire PDF personnalisé → tu construis une audience réutilisable.

---

## 5. AUDIT B2B — SEGMENTS CLASSÉS DU PLUS AU MOINS RENTABLE

| Rang | Segment | Douleur réelle | Intérêt | Proba d'achat | Prix acceptable | Cycle de vente | Verdict |
|---|---|---|---|---|---|---|---|
| 🥇 1 | **Villa managers / property managers** | Messages clients 24/7 répétitifs, petites équipes, multi-langues | **Élevé** | **Moyen-élevé** | 2 000-5 000 THB/mois/portfolio | Court (décideur = opérateur) | **Meilleure cible.** Décideur accessible, douleur aiguë, pas de réception 24/7. |
| 🥈 2 | **Dive shops / tour operators** | Veulent + de réservations | Élevé (en tant que **partenaires**, pas clients) | Élevé sur la commission | 0 abo / **commission** | Court | Ne les fais pas payer un abo — **fais-les gagner**. C'est ton réseau (plongée). Revenu d'affiliation B2B. |
| 🥉 3 | **Boutique hotels 3-4★ (15-60 ch.)** | Réception débordée, pas de concierge dédié | Moyen | Moyen | 2 900-4 900 THB | Moyen | Bon cœur de cible. Décideur = GM/owner, joignable. |
| 4 | **Wellness / spas / retreats** | Veulent expérience "on-brand", calme | Moyen | Moyen | 3 000-6 000 THB | Moyen-long | Aime le white-label. Sensibles au design. |
| 5 | **Resorts 5★ (chaînes)** | En ont déjà (apps de groupe, conciergerie) | Faible-moyen | **Faible** | 8 000-15 000 THB si oui | **Long** (siège, légal, IT) | Prestige mais **piège temporel** : décision centralisée hors île. Garde pour la preuve sociale, pas pour le cash rapide. |
| 6 | **Agences immobilières** | Pas leur métier de gérer des séjours | Faible | Faible | — | — | **Hors cible.** Drop. |

**Erreur stratégique actuelle :** ta prospection vise d'abord les **phares 5★** (Ritz, Four Seasons, Banyan Tree…). Ce sont les **plus longs à fermer et les plus durs**. Tu épuises ton énergie sur le segment le moins probable. **Inverse :** attaque villas + boutique hotels + partenaires plongée d'abord. Ferme 5 clients rapides, sers-t'en comme preuve pour monter en gamme ensuite.

---

## 6. AUDIT SEO

**État :** correct sur les bases techniques (title, meta description, canonical, robots.txt, sitemap.xml, Open Graph, JSON-LD, google-site-verification présents), **mais c'est une SPA mono-page** → contenu mince, **zéro page de destination thématique**. Tu es invisible sur les requêtes qui valent de l'or.

**Le vrai gisement (que tes consignes de projet décrivent mais qui n'est PAS construit) :** des pages SEO locales du type *"Best things to do in Koh Samui"*, *"Koh Samui 3-day itinerary"*, *"How to get from Samui to Koh Tao"*, *"Best family beaches Koh Samui"*. Ce sont **exactement** les requêtes des voyageurs en phase de planification → trafic gratuit → monétisable par affiliation. **C'est le canal B2C qui pourrait réellement marcher** (mieux que le chat autonome).

**Roadmap SEO 12 mois :**
- **M1-2 :** quitter la SPA pure → générer de vraies pages indexables (Next.js SSG). Publier 10 pages piliers (itinéraires 1/3/5/7 j, transferts inter-îles, plages familles, plongée débutant, pluie). Chaque page = liens d'affiliation + CTA "Ask Coco".
- **M3-4 :** 20-30 pages "longue traîne" par zone (restaurants Bophut, spas Lamai, etc.) **uniquement à partir de données vérifiées** (sinon tu hallucines et Google te punit).
- **M5-6 :** schema FAQ + hreflang multilingue (FR/DE/SV/ZH) — ton avantage : peu de contenu Samui existe en suédois/allemand/chinois.
- **M7-9 :** netliens : partenariats blogs voyage, échanges avec hôtels clients (lien depuis leur site), TripAdvisor forum, Reddit r/thailand.
- **M10-12 :** mesurer (Search Console), doubler ce qui ranke, élaguer le reste.

**Avertissement dur :** ne génère JAMAIS de pages SEO à partir du prompt statique. Données fausses indexées = sanction Google **et** perte de confiance. Construis d'abord la couche données vérifiée (même un Google Sheet + script suffit pour commencer).

---

## 7. AUDIT UX/UI

- **Homepage :** chat fonctionnel, propre. Mais une SPA "chat-only" ne convertit pas un voyageur en planification ni un hôtel en lead. Manque une vraie structure (héros B2C + bande "Hotels & partners" séparée).
- **Navigation :** quasi inexistante (single page). OK pour le chat, nul pour le SEO et la conversion B2B.
- **Mobile :** PWA = excellent choix (install via QR chambre = vrai argument). Bien joué.
- **Vitesse :** SPA légère, service worker → rapide. RAS.
- **Conversion :** **non instrumentée** = tu ne sais pas combien de gens chattent, cliquent un lien de réservation, remplissent le formulaire. Et le formulaire perd les leads (/tmp). **Tu pilotes à l'aveugle.**

**Wireframes optimisés (à implémenter) :**
1. **Page B2C (voyageur) :** Héros "Ask Coco anything about Koh Samui" + 6 chips de questions populaires (clic = pré-rempli) → réponses avec **bloc Réserver visible** (affiliation) → capture email pour itinéraire PDF.
2. **Page B2B (`/hotels`) :** séparée. Démo live encadrée + 3 bénéfices (24/7 / 6 langues / vos services d'abord) + tarifs 3 paliers + formulaire **qui marche** (vers DB/Slack) + bouton "Book a 15-min demo" (Calendly).
3. **`/dashboard` (hôtel) :** conversations/mois, top questions, recommandations services maison, clics réservation. **Même une V1 fake-til-you-make (1 graphe) suffit à retenir.**

---

## 8. AUDIT AUTOMATISATION — priorités

| Priorité | À automatiser | État | Action |
|---|---|---|---|
| 🔴 P0 | **Capture lead** (le formulaire perd tout) | Cassé (/tmp + webhook vide) | Brancher Supabase/Sheet + alerte WhatsApp/Slack. **Avant tout le reste.** |
| 🔴 P0 | **Affiliation** (revenu) | Éteinte | Ajouter `VIATOR_AFFILIATE_PID` en prod + Klook/GYG. 15 min. |
| 🟠 P1 | **Prospection** (cold email + relances) | 100 % manuel Gmail | Outil type Instantly/Lemlist (séquence + relances auto J+2/J+7) OU au minimum HubSpot Free + templates. |
| 🟠 P1 | **CRM / pipeline** | Excel | HubSpot Free (gratuit) : statut, relances, conversion. Tu as déjà la connexion dispo. |
| 🟡 P2 | **Onboarding hôtel** | Manuel | `hotel-setup.html` → génération auto config + QR + email de bienvenue. |
| 🟡 P2 | **Facturation / abo** | Inexistant | Stripe/PayPal lien d'abo récurrent + relance impayés. |
| 🟢 P3 | **Support client** | Toi 24/7 | FAQ auto dans le chat + escalade WhatsApp seulement si besoin. |
| 🟢 P3 | **Réservations** | Liens affiliés | OK via affiliation ; intégration directe plus tard. |

**Règle :** n'automatise pas la prospection avant d'avoir réparé la capture de leads et l'affiliation. Sinon tu automatises une fuite.

---

## 9. AUDIT CONCURRENCE

**Directs (concierge IA / Samui-tourisme tech) :**
- Apps de conciergerie hôtelière généralistes (ex. type "guest app" SaaS internationaux) : plus chères, pas locales, pas multilingues Samui. **Ton angle local te protège ici.**
- Concierges locaux humains (Concierge Samui, Private Concierge, MrSamui) : c'est ton vrai concurrent terrain ET ton partenaire potentiel.

**Indirects (les vrais tueurs) :**
- **ChatGPT / Gemini / Claude** dans la poche du voyageur : gratuits, excellents, génériques. **80 % de ta proposition de valeur B2C, gratuite.**
- **Google Maps / Search / Travel** : réflexe par défaut.
- **TripAdvisor / Klook / GetYourGuide / Viator** : découverte + réservation. (Tu peux être leur affilié plutôt que leur concurrent — fais ça.)
- **Les groupes Facebook expats Samui / forums** : recommandations gratuites en temps réel.

**Comparaison synthétique :**
| Acteur | Local frais | Multilingue | Réservation | Coût pour le voyageur | Menace |
|---|---|---|---|---|---|
| Coco | Oui (si données à jour) | Oui (6) | Via affilié | Gratuit | — |
| ChatGPT | Non (générique) | Oui | Non | Gratuit | 🔴 Élevée |
| Google | Partiel | Oui | Partiel | Gratuit | 🔴 Élevée |
| Klook/Viator | Non | Oui | Oui | Gratuit | 🟠 (= partenaire) |
| Concierge humain | Oui | Partiel | Oui | Payant | 🟡 (= partenaire) |

**Conclusion concurrence :** ton fossé n'est PAS la techno (copiable en un week-end). C'est **toi + tes données locales vérifiées + tes contrats partenaires**. Construis le fossé là, pas dans le code.

---

## 10. ROADMAP 90 JOURS

**Phase 1 — RÉPARER & ENCAISSER (J1-J30)**
- *Objectif :* arrêter les fuites, allumer le revenu passif, fermer 3 clients faciles.
- J1-3 : **Réparer la capture de leads** (Supabase/Sheet + alerte WhatsApp). **Activer Viator + Klook + GetYourGuide en prod.** Vérifier qu'un lien `?pid=` apparaît.
- J4-7 : Brancher **analytics** (Plausible/GA4) : conversations, clics réservation, soumissions formulaire.
- J8-15 : Repositionner la cible : sortir 30 **villas + boutique hotels + dive shops** (pas les 5★). Séquence email + relances auto.
- J16-30 : 10 démos live (QR scanné devant le décideur). Signer le **setup fee** dès la démo. Objectif : **3 clients payants** (Pro/Premium) + **2 partenaires commission**.
- *KPI J30 :* affiliation active (≥1 conversion trackée), leads sauvegardés, 3 abos + 2 partenaires, baseline analytics.

**Phase 2 — RETENIR & PROUVER (J31-J60)**
- *Objectif :* construire la rétention et la preuve sociale.
- Construire **dashboard hôtel V1** (conversations/mois, top questions, recos services maison, clics). Même minimal.
- Envoyer à chaque client un **rapport mensuel 1 page** (PDF auto) → c'est ça qui empêche le churn.
- Récolter 2-3 **témoignages/logos** clients → mettre sur `/hotels`.
- Lancer 8-10 **pages SEO piliers** (depuis données vérifiées).
- *KPI J60 :* 6-8 clients, churn 0, dashboard live, 3 témoignages, pages SEO indexées.

**Phase 3 — SCALER PROPREMENT (J61-J90)**
- *Objectif :* rendre l'acquisition répétable et la donnée durable.
- CRM (HubSpot) propre + séquences. Setup fee systématique.
- Migrer la donnée critique (prix/horaires) du prompt statique vers **Google Places live + une couche data vérifiée** (anti-péremption).
- Décliner sur **Koh Phangan + Koh Tao** (même moteur, nouvelle data) = élargir le TAM sans réécrire le produit.
- *KPI J90 :* 10-15 clients payants, MRR ≥ 50 k THB, affiliation ≥ 20 k THB/mois, 15 pages SEO, pipeline 30 leads.

---

## 11. PLAN DE PROSPECTION

**Cibles idéales (par ordre d'attaque, pas par prestige) :**
1. Villa management companies (LUXE Samui, Samui Villa Finder, Samui & Koh, Lime Samui…).
2. Boutique hotels 3-4★ (The Stay, Cactus, OZO, Briza, Cielo, Peace Resort…).
3. Dive shops & tour ops **en partenaires commission** (Discovery Divers, Oceana, Silent Divers, 100 Degrees East, Ang Thong tours).
4. Wellness/spas (Tamarind Springs, The Spa Samui, Eranda…).
5. (Plus tard, pour la preuve) phares 5★.

**Argumentaire (1 ligne) :** *"Vos clients scannent un QR dans la chambre → un concierge IA à VOTRE nom répond en 6 langues 24/7, pousse VOS services d'abord, et vous voyez chaque mois ce qu'ils demandent. Essai 14 jours, je m'occupe de tout."*

**Cold email (court, qui convertit mieux que le tien actuel — trop long) :**
> **Objet :** A 24/7 concierge for [Hotel]'s guests — 6 languages, your brand
> Hi [Name], I'm Cyril, based here on Samui. I built Coco — an AI concierge your guests open from an in-room QR. It answers 24/7 in 6 languages and recommends *your* spa, restaurant and tours first. 2-min look (no signup): coco-samui-ai.com — could I set up a free 14-day trial branded for [Hotel]? Cyril · WhatsApp +66 63 375 3316

**WhatsApp J+2 :**
> Hi [Name], Cyril here 🌴 — did Coco land OK? Happy to brand a free 14-day trial for [Hotel] and show it live in 10 min. Want me to set it up?

**Script de RDV (10-15 min) :**
1. (1 min) "Combien de questions répétitives votre réception reçoit par jour, en combien de langues ?"
2. (3 min) **Faire scanner le QR devant le décideur** + montrer l'install écran d'accueil.
3. (3 min) Poser 3 questions live (en allemand/chinois) → effet "wow multilingue".
4. (2 min) Montrer "vos services d'abord" sur SON resto/spa.
5. (2 min) Prix + setup fee + essai 14 j. **Demander la signature maintenant** (setup fee = engagement).
6. (1 min) Calendrier d'installation.

**Script de démo (objections prêtes) :** prix → essai gratuit puis paliers ; "on a déjà une réception" → Coco prend le 24/7 répétitif, votre équipe garde le haut de gamme ; data → rien n'est stocké côté client ; install → 3 lignes ou un QR, je fais tout.

---

## 12. DOCUMENTS À PRODUIRE

Plusieurs existent déjà partiellement (pitch decks FR/EN, 1-pagers, kit outreach, objections=FAQ embryon, plan campagne). Pour éviter de te livrer 11 docs redondants et superficiels, **je te demande lesquels prioriser** (voir ma question juste après ce document). Je peux produire chacun en version solide et cohérente avec ce qui existe :
Executive Summary · Business Plan · Pitch Deck Investisseur · Pitch Deck Commercial (refonte) · Pricing Sheet (3 paliers) · FAQ · Sales Deck · SOP d'exploitation · Plan Marketing · Plan SEO · Plan Réseaux Sociaux.

---

## 13. ANALYSE FINALE — "Si c'était mon argent et mon temps, mes 30 prochains jours"

Sans complaisance, voici exactement ce que je ferais, dans l'ordre, en partant demain matin :

**Semaine 1 — Arrêter de saigner (technique, ~2 jours de travail).**
1. Réparer la capture de leads (Supabase gratuit + alerte WhatsApp). Un lead perdu = un client perdu.
2. **Activer l'affiliation** (Viator PID + Klook + GetYourGuide) en prod et vérifier une vraie conversion trackée. C'est le seul revenu qui rentre pendant que tu dors.
3. Brancher un analytics simple (Plausible). Sans chiffres, tu décides à l'instinct — l'instinct ne lève pas de clients.
4. Séparer la page `/hotels` du chat et créer un **Calendly** "Book a 10-min demo".

**Semaine 2 — Repositionner et viser juste.**
5. Abandonner l'obsession des 5★. Sortir une liste de **30 villas + boutique hotels + 10 dive/tour partenaires**.
6. Réécrire le cold email en version courte (la tienne est trop longue, elle perd les GM débordés).
7. Lancer la séquence (5-8/jour) avec relances **automatiques**. Mettre tout dans HubSpot Free, pas Excel.
8. Signer **3 partenaires commission** (plongée/tours) — ton réseau, vente facile, revenu immédiat sans abo.

**Semaine 3 — Vendre en personne (ton vrai super-pouvoir).**
9. 10 démos live en face-à-face ou WhatsApp vidéo. Tu es sur l'île, sympathique, crédible : **utilise-le**, le cold email seul ne fermera pas.
10. Introduire le **setup fee 3-5 k THB** dès la démo = filtre les curieux, finance ton temps, crée l'engagement.
11. Viser **3 hôtels/villas payants** d'ici fin de semaine 3.

**Semaine 4 — Construire la rétention (sinon les 3 partent).**
12. Monter le **dashboard V1** (même 1 graphe + top 10 questions) et envoyer le **1er rapport mensuel PDF** à chaque client. C'est ce qui transforme "gadget sympa" en "abo qu'on ne résilie pas".
13. Publier **5 pages SEO piliers** (itinéraires + transferts) à partir de données vérifiées, avec liens d'affiliation. Premier trafic gratuit + premier revenu passif scalable.
14. Récolter 2 témoignages, les mettre sur `/hotels`.

**À ne PAS faire ce mois-ci :** ne construis pas la grande architecture Supabase/scoring/anti-hallucination de tes consignes. **C'est de la sur-ingénierie** tant que tu n'as pas 5 clients payants. Le code parfait ne paie pas le loyer ; 5 clients et 3 partenaires, si.

**La vérité finale, sans ego :** Coco est un excellent *outil de vente* et un médiocre *produit autonome*. Sa valeur n'est pas le chatbot — c'est **toi, local, qui distribues des clients aux prestataires et fais gagner du temps aux hôtels, avec l'IA comme prétexte d'entrée**. Repositionne-le en **agence d'affiliation locale outillée par l'IA**, allume l'affiliation, répare les leads, vends en personne aux petits avant les gros, et construis la rétention. Fais ça, et tu as un vrai revenu familial dans 90 jours. Continue à le pitcher comme une "plateforme SaaS scalable à 500 k€", et tu vas t'épuiser à courir après des Four Seasons qui ne signeront jamais.

---
*Audit fondé sur l'inspection directe du code (`api/`, `data/`, `.env.local`, `vercel.json`), des supports commerciaux et des kits de prospection présents dans les dossiers du projet, au 21 juin 2026.*
