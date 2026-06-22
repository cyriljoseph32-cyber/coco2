"""Configuration centrale (lue depuis l'environnement)."""

from __future__ import annotations

import os

from .risk import RiskConfig

# Par défaut SQLite en dev ; en prod : postgresql+psycopg://user:pwd@host/db
DATABASE_URL: str = os.environ.get("DATABASE_URL", "sqlite:///./trading.db")


def risk_config_from_env() -> RiskConfig:
    """Construit la config de risque depuis l'environnement (valeurs prudentes par défaut)."""
    return RiskConfig(
        max_risk_per_trade_pct=float(os.environ.get("RISK_PER_TRADE_PCT", "1")),
        daily_loss_limit_pct=float(os.environ.get("DAILY_LOSS_LIMIT_PCT", "3")),
        max_open_positions=int(os.environ.get("MAX_OPEN_POSITIONS", "5")),
        max_trades_per_day=int(os.environ.get("MAX_TRADES_PER_DAY", "10")),
        min_minutes_between_trades=int(os.environ.get("MIN_MINUTES_BETWEEN_TRADES", "5")),
    )
