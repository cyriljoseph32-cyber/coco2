# Trading Platform — Backend (Python / FastAPI)

Backend professionnel de la plateforme de trading multi-actifs US (actions, ETF, secteurs, matières premières, obligations, crypto activable).

**Modules livrés :** Risk Management · Journal de trades · Indicateurs · Scoring 0-100 · Scanner multi-actifs.

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

**🔍 Scanner + Scoring 0-100** (`app/scoring.py`, `app/scanner.py`, `app/universe.py`) :
- note chaque actif sur 100 (tendance, repli RSI, régime RSI14, volume, volatilité), avec explications lisibles et catégorie (≥90 très forte · 70-89 intéressante · 50-69 surveillance · <50 ignorer) ;
- scanne l'univers en parallèle, trié par score ;
- source de données **pluggable** : Yahoo par défaut (sans clé), remplaçable par Polygon/Alpaca en gardant la signature de `fetch_candles`.

### Endpoints

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/health` | sonde |
| GET | `/risk/config` | paramètres de risque actifs |
| POST | `/risk/check?equity=` | valide un trade candidat |
| POST | `/trades?equity=` | ouvre une position (refusée si risque violé) |
| POST | `/trades/{id}/close` | clôture (calcule le P&L) |
| GET | `/trades` | journal (filtre `?status=open\|closed`) |
| GET | `/stats?starting_equity=` | métriques de performance |
| GET | `/scan?include_crypto=&min_score=` | scanne l'univers, opportunités notées |
| GET | `/scan/{symbol}` | analyse un actif (ex. `/scan/TSLA`) |

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
python3 -m tests.test_risk      # 9 tests : risk manager
python3 -m tests.test_stats     # 7 tests : métriques de performance
python3 -m tests.test_scoring   # 10 tests : indicateurs + scoring
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
    indicators.py # SMA, RSI, ATR, volume moyen — logique pure
    scoring.py    # ⭐ moteur de scoring 0-100 — logique pure
    universe.py   # univers d'actifs (extensible)
    scanner.py    # récupération données (pluggable) + scan parallèle
    journal.py    # service journal (écrit/lit les trades, calcule les stats)
    main.py       # API FastAPI
  tests/
    test_risk.py     # exécutable avec python3 seul
    test_stats.py    # exécutable avec python3 seul
    test_scoring.py  # exécutable avec python3 seul
  requirements.txt
```

## Roadmap restante

- Backtesting avancé (vectorbt) : comparaison de stratégies, walk-forward anti-overfitting.
- Assistant conversationnel (Claude) : « pourquoi ce trade », « analyse Tesla ».
- Exécution réelle multi-broker : **après** validation manuelle + paper trading prolongé.
- Source de données pro (Polygon/Alpaca) + timeframes intraday + TimescaleDB hypertable.

> ⚠️ Outil d'aide à la décision. Aucune performance n'est garantie. Paper trading prolongé et limites de risque strictes obligatoires avant l'argent réel.
