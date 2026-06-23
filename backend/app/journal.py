"""Service journal : ouvre/clôture les trades et calcule les statistiques.

Relie la logique pure (risk, stats) à la base de données.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Trade, TradeSide, TradeStatus
from .risk import AccountState, RiskConfig, RiskDecision, TradeProposal, evaluate_trade
from .stats import PerfStats, compute_stats


def _start_of_day_utc(now: datetime) -> datetime:
    return now.replace(hour=0, minute=0, second=0, microsecond=0)


def build_account_state(session: Session, equity: float, now: datetime | None = None) -> AccountState:
    """Reconstruit l'état du compte depuis le journal pour l'évaluation du risque."""
    now = now or datetime.now(timezone.utc)
    day_start = _start_of_day_utc(now)

    open_positions = session.scalar(
        select(Trade).where(Trade.status == TradeStatus.OPEN).with_only_columns(Trade.id).limit(1)
    )
    open_count = len(
        session.execute(select(Trade.id).where(Trade.status == TradeStatus.OPEN)).all()
    )

    closed_today = session.execute(
        select(Trade.pnl).where(
            Trade.status == TradeStatus.CLOSED, Trade.closed_at >= day_start
        )
    ).all()
    realized_today = sum((row[0] or 0.0) for row in closed_today)

    opened_today_rows = session.execute(
        select(Trade.opened_at).where(Trade.opened_at >= day_start)
    ).all()
    trades_today = len(opened_today_rows)
    last_trade_at = max((row[0] for row in opened_today_rows), default=None)

    _ = open_positions  # silence unused
    return AccountState(
        equity=equity,
        realized_pnl_today=realized_today,
        open_positions=open_count,
        trades_today=trades_today,
        last_trade_at=last_trade_at,
    )


def check_risk(
    session: Session, config: RiskConfig, equity: float, proposal: TradeProposal
) -> RiskDecision:
    """Évalue un trade candidat contre toutes les règles de risque."""
    account = build_account_state(session, equity)
    return evaluate_trade(config, account, proposal)


def open_trade(session: Session, **fields) -> Trade:
    trade = Trade(side=TradeSide.LONG, status=TradeStatus.OPEN, **fields)
    session.add(trade)
    session.commit()
    session.refresh(trade)
    return trade


def close_trade(
    session: Session, trade_id: int, exit_price: float, exit_reason: str | None = None
) -> Trade | None:
    trade = session.get(Trade, trade_id)
    if trade is None or trade.status == TradeStatus.CLOSED:
        return trade
    trade.exit_price = exit_price
    trade.exit_reason = exit_reason
    trade.pnl = (exit_price - trade.entry_price) * trade.quantity
    trade.pnl_pct = (exit_price / trade.entry_price - 1.0) * 100.0
    trade.status = TradeStatus.CLOSED
    trade.closed_at = datetime.now(timezone.utc)
    session.commit()
    session.refresh(trade)
    return trade


def list_trades(session: Session, status: TradeStatus | None = None) -> list[Trade]:
    stmt = select(Trade).order_by(Trade.opened_at.desc())
    if status is not None:
        stmt = stmt.where(Trade.status == status)
    return list(session.scalars(stmt).all())


def compute_journal_stats(session: Session, starting_equity: float = 0.0) -> PerfStats:
    """Statistiques de performance sur les trades clôturés (ordre chronologique)."""
    rows = session.execute(
        select(Trade.pnl)
        .where(Trade.status == TradeStatus.CLOSED, Trade.pnl.is_not(None))
        .order_by(Trade.closed_at.asc())
    ).all()
    pnls = [row[0] for row in rows]
    return compute_stats(pnls, starting_equity)
