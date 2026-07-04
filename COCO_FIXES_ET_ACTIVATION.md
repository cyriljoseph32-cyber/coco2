# COCO — CE QUI A ÉTÉ CORRIGÉ + COMMENT L'ACTIVER
*21 juin 2026. À faire dans l'ordre. ~30 minutes en tout.*

---

## CE QUE J'AI CHANGÉ DANS LE CODE

1. **Capture de leads réparée** (`api/lead.js`)
   - Avant : écriture dans `/tmp` (effacé à chaque invocation Vercel) → **tes leads étaient perdus**.
   - Après : stockage **persistant** dans Vercel KV/Upstash + notification webhook (Slack/Discord). Le formulaire renvoie maintenant `persisted: true/false` pour que tu saches si c'est bien sauvegardé.

2. **Logging des conversations** (`api/chat.js`)
   - Chaque conversation enregistre désormais (sans ralentir la réponse) : hôtel, langue, question, si tes services maison ont été recommandés, si des liens de réservation ont été affichés. **C'est ce qui alimente le dashboard.**
   - ⚠️ Je n'ai **pas touché** aux liens d'affiliation (chemin du revenu) — zéro risque.

3. **Nouveau store** (`api/_store.js`) — petite couche KV sans dépendance, dégradation gracieuse si non configuré.

4. **API stats** (`api/stats.js`) — sert le dashboard, protégé par code.

5. **Dashboard hôtel V1** (`public/dashboard.html`, route `/dashboard`) — login hôtel + code, KPIs, langues, top questions.

6. **`vercel.json`** — route `/dashboard` ajoutée. **`.env.example`** — nouvelles variables documentées.

---

## À ACTIVER (TOI, dans Vercel — le code est prêt)

### 1. Affiliation = REVENU (5 min) 🔴 priorité absolue
Aujourd'hui `VIATOR_AFFILIATE_PID` est **vide** → 0 THB. Le code lit déjà la variable au runtime.
1. Vercel → ton projet → **Settings → Environment Variables**.
2. Ajoute : `VIATOR_AFFILIATE_PID` = ton Partner ID Viator (voir `VIATOR_AFFILIATE_SETUP.md`).
3. (Idéalement aussi `KLOOK_AFFILIATE_ID` et `GETYOURGUIDE_PARTNER_ID`.)
4. **Redeploy.** Teste : demande "diving Koh Tao" sur le site → un lien avec `?pid=` doit apparaître.

### 2. Stockage persistant = LEADS + DASHBOARD (10 min) 🔴
1. Vercel → ton projet → onglet **Storage** → **Create** → **KV** (Upstash, gratuit). Connecte-le au projet.
   → Vercel injecte automatiquement `KV_REST_API_URL` et `KV_REST_API_TOKEN`.
2. **Redeploy.** À partir de là, leads stockés ET conversations comptées.

### 3. Alerte leads instantanée (5 min) 🟠
1. Crée un webhook entrant **Slack** (ou Discord) — une URL `https://hooks.slack.com/...`.
2. Vercel → Env Var : `LEAD_NOTIFY_WEBHOOK` = cette URL. Redeploy.
3. Désormais chaque lead te ping en direct sur ton téléphone.

### 4. Code dashboard (2 min) 🟠
1. Vercel → Env Var : `DASHBOARD_MASTER_CODE` = une longue chaîne aléatoire (ton passe-partout).
2. Tu ouvres `coco-samui-ai.com/dashboard`, tu entres l'**Hotel ID** (slug, ex. `anantara-bophut`) + ton code maître → tu vois les stats de n'importe quel hôtel.
3. Pour donner un accès à un hôtel client : on lui crée un code dédié (fonction `setHotelCode` déjà prête côté store — dis-moi quand tu as un client, je te fais un mini-endpoint admin pour le définir en un clic).

---

## VÉRIFICATION RAPIDE APRÈS DÉPLOIEMENT
- [ ] Lien `?pid=` visible dans une réponse "tour/diving" → **affiliation ON**.
- [ ] Remplir le formulaire `/hotel-setup` → recevoir le ping Slack + `persisted: true` → **leads OK**.
- [ ] Chatter 2-3 fois avec `?hotel=anantara-bophut` puis ouvrir `/dashboard` → voir les conversations comptées → **dashboard OK**.

---

## NOTE D'INGÉNIERIE (honnête)
- Le dashboard V1 mesure **conversations, langues, top questions, recos services maison, liens de réservation affichés**. Le *clic* réel sur un lien d'affiliation n'est pas encore tracké (j'ai évité de réécrire les URLs de revenu pour ne rien casser). C'est un ajout propre quand tu auras des clients payants.
- Tant qu'un client ne paie pas, **ne construis rien de plus**. Cette V1 suffit à prouver la valeur en RDV et à retenir.
