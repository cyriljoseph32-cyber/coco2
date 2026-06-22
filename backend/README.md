# Trading Platform — Backend (Python / FastAPI)

Backend professionnel de la plateforme de trading multi-actifs. **Module 1 livré : Risk Management + Journal de trades** — la fondation indispensable avant toute exécution en argent réel.

## Pourquoi ce module en premier

Avant de scanner des milliers d'actifs ou de scorer des opportunités, il faut une discipline de risque qui ne peut **jamais** être contournée, et un journal qui mesure la performance réelle. C'est ce que fournit ce module :

- **Risk manager** (`app/risk.py`) — logique pure, sans dépendance, 100 % testable :
  - taille de position automatique (risque % du capital via la distance au stop)
  - **perte maximale quotidienne** : bloque tout nouveau trade si la perte du jour dépasse le seuil
  - **nombre maximum de positions simultanées**
  - **protection anti-sur-trading** : nombre max de trades/jour + délai minimum entre deux trades
- **Statistiques** (`app/stats.py`) — logique pure : taux de réussite, profit factor, drawdown maximum, ratio de Sharpe, espérance, courbe d'équité.
- **Journal & API** (`app/models.py`, `app/journal.py`, `app/main.py`) — persistance PostgreSQL/TimescaleDB des trades et exposition REST (FastAPI).

La logique critique (risque + stats) est **isolée du framework et de la base** : elle se teste avec `python3` seul, sans rien installer (voir `tests/`).

## Lancer

```bash
cd backend
python3 -m pip install -r requirements.txt
# Base : par défaut SQLite (dev). En prod : export DATABASE_URL=postgresql+psycopg://...
uvicorn app.main:app --reload
# Docs interactives : http://localhost:8000/docs
```

## Tests (sans aucune dépendance)

```bash
cd backend
python3 -m tests.test_risk
python3 -m tests.test_stats
```

## Arborescence

```
backend/
  app/
    config.py     # configuration (DATABASE_URL, paramètres de risque par défaut)
    db.py         # session SQLAlchemy
    models.py     # tables Trade / Account (Timescale-friendly)
    schemas.py    # contrats Pydantic (API)
    risk.py       # ⭐ risk manager — logique pure
    stats.py      # ⭐ métriques de performance — logique pure
    journal.py    # service journal (écrit/lit les trades, calcule les stats)
    main.py       # API FastAPI
  tests/
    test_risk.py  # exécutable avec python3 seul
    test_stats.py # exécutable avec python3 seul
  requirements.txt
```

## Prochains modules (roadmap)

2. Scanner multi-actifs / multi-timeframes · 3. Scoring IA 0-100 · 4. Backtesting Sharpe (vectorbt) · 5. Assistant conversationnel (Claude) · 6. Exécution réelle (après validation manuelle).

> ⚠️ Outil d'aide à la décision. Aucune performance n'est garantie. Paper trading prolongé et limites de risque strictes obligatoires avant l'argent réel.
