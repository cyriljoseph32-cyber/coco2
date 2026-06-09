# 📈 Signal Bot — Actifs US

Bot de signaux de trading sur les actifs américains (S&P 500, Nasdaq, grandes capitalisations), accessible sur **`/trading.html`**.

## Ce que fait le bot

- **Lecture du marché US** : tendance (vs MM200) et momentum (RSI) sur SPY, QQQ, DIA, IWM + 16 grandes valeurs US, données Yahoo Finance rafraîchies toutes les 5 minutes.
- **Signaux d'entrée / sortie** : 🟢 ACHETER · 🔴 SORTIR · 🟡 CONSERVER · ⚪ ATTENDRE, avec pour chaque entrée le prix, le stop de protection, la règle de sortie et la **taille de position** calculée selon votre capital et votre risque par trade.
- **Backtest intégré** : pour chaque actif, le taux réel de trades gagnants de la stratégie sur les 2 dernières années est affiché (« Réussite hist. ») — c'est ce qui permet de vérifier l'objectif de ~70 % de positions positives.

## La stratégie (retour à la moyenne RSI-2)

- **Entrée** : cours > moyenne mobile 200 jours (tendance haussière) **et** RSI(2) < 10 (repli excessif).
- **Sortie** : clôture > moyenne mobile 5 jours (profit), ou stop à `entrée − 2,5 × ATR(14)`, ou 10 séances max.
- **Risque** : taille de position calibrée pour ne risquer que 0,5–2 % du capital par trade.

Cette famille de stratégies vise historiquement ~65–75 % de trades gagnants sur les actifs US liquides (gains fréquents et petits, pertes rares coupées par le stop).

> ⚠️ **Avertissement** : outil d'aide à la décision, pas un conseil en investissement. Les performances passées ne préjugent pas des performances futures. Aucun taux de réussite n'est garanti.

## Lancer en local

```bash
npm install
npm run dev
# puis ouvrir http://localhost:5173/trading.html
```

En production (Vercel), la fonction `api/market.ts` sert de proxy vers Yahoo Finance ; en dev local, le proxy Vite (`vite.config.ts`) fait le même travail.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
