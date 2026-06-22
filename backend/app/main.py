"""API FastAPI — Risk management + Journal de trades."""

from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import journal
from .config import risk_config_from_env
from .db import engine, get_session
from .models import Base, TradeStatus
from .risk import TradeProposal
from .schemas import (
    RiskCheckRequest,
    RiskCheckResponse,
    StatsResponse,
    TradeClose,
    TradeOpen,
    TradeOut,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trading Platform API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RISK = risk_config_from_env()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/risk/config")
def get_risk_config() -> dict[str, float | int]:
    return {
        "max_risk_per_trade_pct": RISK.max_risk_per_trade_pct,
        "daily_loss_limit_pct": RISK.daily_loss_limit_pct,
        "max_open_positions": RISK.max_open_positions,
        "max_trades_per_day": RISK.max_trades_per_day,
        "min_minutes_between_trades": RISK.min_minutes_between_trades,
    }


@app.post("/risk/check", response_model=RiskCheckResponse)
def risk_check(
    req: RiskCheckRequest,
    equity: float,
    session: Session = Depends(get_session),
) -> RiskCheckResponse:
    """Valide un trade candidat contre toutes les règles de risque avant exécution."""
    decision = journal.check_risk(
        session, RISK, equity, TradeProposal(req.symbol, req.entry, req.stop)
    )
    return RiskCheckResponse(
        approved=decision.approved,
        quantity=decision.quantity,
        risk_amount=decision.risk_amount,
        reasons=decision.reasons,
    )


@app.post("/trades", response_model=TradeOut)
def open_trade(
    body: TradeOpen,
    equity: float,
    session: Session = Depends(get_session),
) -> TradeOut:
    """Ouvre une position — refusée si une règle de risque est violée."""
    decision = journal.check_risk(
        session, RISK, equity, TradeProposal(body.symbol, body.entry_price, body.stop_price)
    )
    if not decision.approved:
        raise HTTPException(status_code=409, detail={"reasons": decision.reasons})
    trade = journal.open_trade(
        session,
        symbol=body.symbol,
        quantity=body.quantity,
        entry_price=body.entry_price,
        stop_price=body.stop_price,
        take_profit=body.take_profit,
        strategy=body.strategy,
        setup=body.setup,
        paper=body.paper,
    )
    return TradeOut.model_validate(trade)


@app.post("/trades/{trade_id}/close", response_model=TradeOut)
def close_trade(
    trade_id: int,
    body: TradeClose,
    session: Session = Depends(get_session),
) -> TradeOut:
    trade = journal.close_trade(session, trade_id, body.exit_price, body.exit_reason)
    if trade is None:
        raise HTTPException(status_code=404, detail="Trade introuvable")
    return TradeOut.model_validate(trade)


@app.get("/trades", response_model=list[TradeOut])
def list_trades(
    status: str | None = None,
    session: Session = Depends(get_session),
) -> list[TradeOut]:
    st = TradeStatus(status) if status else None
    return [TradeOut.model_validate(t) for t in journal.list_trades(session, st)]


@app.get("/stats", response_model=StatsResponse)
def stats(
    starting_equity: float = 0.0,
    session: Session = Depends(get_session),
) -> StatsResponse:
    s = journal.compute_journal_stats(session, starting_equity)
    return StatsResponse(
        trades=s.trades, wins=s.wins, losses=s.losses, win_rate=s.win_rate,
        total_pnl=s.total_pnl, avg_win=s.avg_win, avg_loss=s.avg_loss,
        profit_factor=(s.profit_factor if s.profit_factor != float("inf") else -1.0),
        expectancy=s.expectancy, max_drawdown=s.max_drawdown,
        max_drawdown_pct=s.max_drawdown_pct, sharpe=s.sharpe,
        equity_curve=s.equity_curve,
    )
