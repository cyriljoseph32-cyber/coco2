# Coco — Passer du "bot" à une "app" vendable

**Décision retenue : PWA (Progressive Web App), pas une app sur les stores.**
Un hôtel ne fera jamais télécharger une app App Store à ses clients. La PWA s'installe en un geste depuis le QR code de la chambre, sans store, et te donne l'argument "app concierge brandée 24/7" pour vendre tes 3 500 THB/mois.

Plan en 3 étapes : **1) PWA → 2) Vente hôtels → 3) Dashboard hôtel.**

---

## ÉTAPE 1 — La PWA (fait, à déployer)

### Ce que j'ai ajouté à ton projet
Tout est dans le dossier déjà déployé sur Vercel :

- `public/manifest.json` — la carte d'identité de l'app (nom, couleurs, icônes, raccourcis "Ask Coco" et "WhatsApp").
- `public/sw.js` — le service worker : chargement rapide, fonctionne même avec une connexion faible. **Le chat (`/api/`) n'est jamais mis en cache → toujours en direct.**
- `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` — les icônes (logo Coco palmier). *À remplacer plus tard par ton vrai logo si tu en as un.*
- `public/index.html` — j'ai ajouté dans le `<head>` les balises manifest/theme/Apple, et avant `</body>` le bouton flottant "📲 Install Coco" + l'enregistrement du service worker.
- `vercel.json` — règles ajoutées pour que le manifest, le sw.js et les icônes soient bien servis (sinon la config actuelle renvoyait la page d'accueil à leur place).

### Déployer (2 minutes)
Depuis le dossier du projet :
```
vercel --prod
```
(ou `npm run deploy`). Pousser sur ton repo GitHub lié à Vercel marche aussi.

### Vérifier que c'est bien une app
1. Ouvre `https://coco-samui-ai.com/` sur ton téléphone.
2. **Android/Chrome** : un bandeau "Ajouter à l'écran d'accueil" apparaît, ou le bouton orange "Install Coco" en bas à droite.
3. **iPhone/Safari** : bouton Partager → "Sur l'écran d'accueil". (iOS ne montre pas de bouton auto, c'est normal — Apple impose le geste manuel.)
4. Une fois installée : icône Coco sur l'écran d'accueil, s'ouvre en plein écran sans barre de navigateur. → **C'est une app.**

### Test technique rapide (optionnel)
Chrome desktop → F12 → onglet **Lighthouse** → catégorie "Progressive Web App" → Analyze. Vise le badge PWA vert.

### Astuce mises à jour
Quand tu modifies le site, change `CACHE_VERSION = "coco-v1"` en `"coco-v2"` dans `sw.js` pour que les clients reçoivent bien la nouvelle version.

---

## ÉTAPE 2 — Vendre aux hôtels

Le parcours qui ferme la vente, sans jamais parler technique :

**"Vos clients scannent un QR dans leur chambre → Coco s'ouvre à votre nom → ils l'ajoutent à leur écran d'accueil comme une app → il répond en 6 langues, 24/7, et recommande VOS services en premier."**

### Argumentaire en 4 points (à ressortir tel quel)
1. **Zéro coût de staff** — Coco gère les questions répétitives 24h/24 en 6 langues. Pas de veille de nuit, pas de réception débordée.
2. **Vos services d'abord** — à l'installation je configure Coco pour pousser votre spa, votre resto, vos excursions maison avant tout le reste. C'est de la vente additionnelle, pas juste de l'info.
3. **Installé en minutes** — QR code en chambre + lien traçable par hôtel. Je m'occupe de tout.
4. **Sans risque** — essai gratuit 14 jours, sans carte, déjà à votre nom. 3 500 THB/mois ensuite, résiliable à tout moment.

### Le kit que tu as déjà
- `Coco_Pitch_Hotels.pptx` / `_EN.pptx` — présentation.
- `Coco_InRoom_Card.html` + `Coco_Hotel_Card_Generator.html` — carte chambre + générateur de QR par hôtel.
- `Coco_AI_Outreach_KIT.md` + `Coco_AI_Emails_Semaine1_PRETS.md` — emails de prospection prêts.

### À faire pour rendre la démo "app" imbattable
- Génère un QR pointant vers `https://coco-samui-ai.com/?hotel=NOMHOTEL&source=qr`.
- En rendez-vous : fais scanner le QR au manager **devant lui**, montre l'ajout à l'écran d'accueil en live. L'effet "c'est une vraie app à mon nom" vaut tous les slides.

---

## ÉTAPE 3 — Le dashboard hôtel (ce qui fidélise)

C'est ce qui transforme Coco d'un gadget en abonnement qu'on ne résilie pas. L'hôtel doit **voir la valeur** chaque mois.

### Ce que le dashboard doit montrer (V1 minimale)
- Nombre de conversations ce mois-ci.
- Top 10 des questions posées par les clients (langue détectée).
- Combien de fois Coco a recommandé les services maison (spa, resto, tours).
- Clics vers WhatsApp / réservations.

### Ce que ça permet côté config
- Modifier les "services à pousser en premier" sans te déranger.
- Changer le nom/branding affiché.
- Récupérer leur QR / lien d'intégration.

### Comment le construire simplement
Tu as déjà la moitié : ton `api/chat.js` et `api/hotels.js`.
1. **Logger chaque conversation** dans une base légère (Vercel KV, Supabase ou Vercel Postgres — gratuit pour démarrer), avec : hôtel, langue, question, services recommandés, date.
2. **Une page `/dashboard`** protégée par un code/login simple par hôtel, qui lit ces logs et affiche les stats (graphes basiques).
3. **Un mini formulaire de config** par hôtel qui écrit dans `hotels.js` / la base.

Outils possibles si tu veux aller vite sans tout coder à la main : **Base44** (app builder) ou **Supabase + une page React**. On peut le monter ensemble quand tu auras tes premiers hôtels payants — pas avant, ne sur-construis pas.

---

## Récap des priorités

| Étape | Effort | Quand |
|------|--------|-------|
| 1. Déployer la PWA | Fait — juste `vercel --prod` | Maintenant |
| 2. Vendre (QR + démo live "app") | Faible — kit déjà prêt | Cette semaine |
| 3. Dashboard hôtel | Moyen | Après 1er ou 2e client payant |

**Règle d'or : ne construis le dashboard qu'une fois que des hôtels paient.** La PWA + la démo live suffisent à vendre. Le dashboard, c'est pour les garder.
