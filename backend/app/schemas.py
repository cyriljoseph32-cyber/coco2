"""Contrats Pydantic exposés par l'API."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class TradeOpen(BaseModel):
    symbol: str = Field(min_length=1, max_length=20)
    quantity: int = Field(gt=0)
    entry_price: float = Field(gt=0)
    stop_price: float = Field(gt=0)
    take_profit: float | None = Field(default=None, gt=0)
    strategy: str = "rsi2"
    setup: str | None = None
    paper: bool = True


class TradeClose(BaseModel):
    exit_price: float = Field(gt=0)
    exit_reason: str | None = None


class TradeOut(BaseModel):
    id: int
    symbol: str
    side: str
    status: str
    quantity: int
    entry_price: float
    stop_price: float
    take_profit: float | None
    exit_price: float | None
    pnl: float | None
    pnl_pct: float | None
    strategy: str
    setup: str | None
    exit_reason: str | None
    paper: bool
    opened_at: datetime
    closed_at: datetime | None

    model_config = {"from_attributes": True}


class RiskCheckRequest(BaseModel):
    symbol: str
    entry: float = Field(gt=0)
    stop: float = Field(gt=0)


class RiskCheckResponse(BaseModel):
    approved: bool
    quantity: int
    risk_amount: float
    reasons: list[str]


class StatsResponse(BaseModel):
    trades: int
    wins: int
    losses: int
    win_rate: float
    total_pnl: float
    avg_win: float
    avg_loss: float
    profit_factor: float
    expectancy: float
    max_drawdown: float
    max_drawdown_pct: float
    sharpe: float
    equity_curve: list[float]


class ScoreOut(BaseModel):
    symbol: str
    name: str | None = None
    score: int
    label: str
    last_close: float
    trend: str
    rsi2: float | None
    rsi14: float | None
    components: dict[str, float]
    reasons: list[str]
