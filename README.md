# 🥥 Coco — Koh Samui AI Concierge

Chatbot IA pour les voyageurs à Koh Samui. Powered by Claude (Anthropic).

## Déploiement Vercel (4 étapes)

### 1. Clé API Anthropic
→ Va sur https://console.anthropic.com → API Keys → Create Key
→ Mets un spending limit ! (ex: $10/mois pour commencer)

### 2. Installe Vercel CLI
```bash
npm install -g vercel
```

### 3. Déploie (depuis ce dossier)
```bash
npm install
vercel
```
→ Appuie sur Entrée à toutes les questions

### 4. Ajoute ta clé API sur Vercel
→ vercel.com → ton projet → Settings → Environment Variables
→ Nom : `ANTHROPIC_API_KEY`
→ Valeur : ta clé sk-ant-...
→ Click Save → puis dans ton terminal :
```bash
vercel --prod
```

## Tester en local
```bash
cp .env.example .env.local
# Edite .env.local avec ta vraie clé
vercel dev
```
→ Ouvre http://localhost:3000

## Structure
```
├── api/
│   └── chat.js          ← Serverless function (appelle Claude)
├── public/
│   └── index.html       ← Interface chat (frontend)
├── package.json
├── vercel.json
└── .env.example
```

## Personnalisation
- Modifier le système prompt dans `api/chat.js` pour ajouter des infos
- Modifier les couleurs/design dans `public/index.html`
- Changer le modèle Claude dans `api/chat.js` (claude-haiku = rapide/économique)
