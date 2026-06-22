"""Tables SQLAlchemy. Le journal de trades est conçu pour Postgres/TimescaleDB
(la table `trades` peut devenir une hypertable sur `opened_at`)."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, Float, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

import enum


class Base(DeclarativeBase):
    pass


class TradeStatus(str, enum.Enum):
    OPEN = "open"
    CLOSED = "closed"


class TradeSide(str, enum.Enum):
    LONG = "long"
    SHORT = "short"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Trade(Base):
    """Un trade = une position, de l'ouverture à la clôture. Cœur du journal."""

    __tablename__ = "trades"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(20), index=True)
    side: Mapped[TradeSide] = mapped_column(Enum(TradeSide), default=TradeSide.LONG)
    status: Mapped[TradeStatus] = mapped_column(
        Enum(TradeStatus), default=TradeStatus.OPEN, index=True
    )

    quantity: Mapped[int] = mapped_column(Integer)
    entry_price: Mapped[float] = mapped_column(Float)
    stop_price: Mapped[float] = mapped_column(Float)
    take_profit: Mapped[float | None] = mapped_column(Float, nullable=True)
    exit_price: Mapped[float | None] = mapped_column(Float, nullable=True)

    # P&L réalisé (rempli à la clôture)
    pnl: Mapped[float | None] = mapped_column(Float, nullable=True)
    pnl_pct: Mapped[float | None] = mapped_column(Float, nullable=True)

    strategy: Mapped[str] = mapped_column(String(40), default="rsi2")
    setup: Mapped[str | None] = mapped_column(String(80), nullable=True)
    exit_reason: Mapped[str | None] = mapped_column(String(40), nullable=True)
    paper: Mapped[bool] = mapped_column(default=True)  # paper trading par défaut

    opened_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, index=True)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
