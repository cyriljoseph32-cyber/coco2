"""Tests du risk manager — exécutables avec python3 seul (aucune dépendance).

    python3 -m tests.test_risk
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.risk import (
    AccountState,
    RiskConfig,
    TradeProposal,
    evaluate_trade,
    position_size,
)

NOW = datetime(2026, 6, 22, 15, 0, tzinfo=timezone.utc)


def test_position_size() -> None:
    # risque 1 % de 10 000 $ = 100 $ ; risque/action 50-48 = 2 $ → 50 actions
    assert position_size(10_000, 1, 50, 48) == 50
    assert position_size(10_000, 1, 50, 50) == 0   # stop = entrée
    assert position_size(10_000, 1, 50, 51) == 0   # stop au-dessus
    assert position_size(0, 1, 50, 48) == 0


def test_approve_normal_trade() -> None:
    cfg = RiskConfig()
    acc = AccountState(equity=10_000)
    d = evaluate_trade(cfg, acc, TradeProposal("AAPL", 100, 96), now=NOW)
    assert d.approved
    assert d.quantity == 25          # 1 % de 10 000 = 100 $ ; /4 = 25
    assert abs(d.risk_amount - 100) < 1e-9


def test_reject_invalid_stop() -> None:
    d = evaluate_trade(RiskConfig(), AccountState(equity=10_000),
                       TradeProposal("AAPL", 100, 100), now=NOW)
    assert not d.approved and d.quantity == 0
    assert any("Stop invalide" in r for r in d.reasons)


def test_reject_daily_loss_limit() -> None:
    cfg = RiskConfig(daily_loss_limit_pct=3)
    acc = AccountState(equity=10_000, realized_pnl_today=-300)  # -3 % atteint
    d = evaluate_trade(cfg, acc, TradeProposal("AAPL", 100, 96), now=NOW)
    assert not d.approved
    assert any("Perte quotidienne" in r for r in d.reasons)


def test_reject_max_open_positions() -> None:
    cfg = RiskConfig(max_open_positions=5)
    acc = AccountState(equity=10_000, open_positions=5)
    d = evaluate_trade(cfg, acc, TradeProposal("AAPL", 100, 96), now=NOW)
    assert not d.approved
    assert any("positions simultanées" in r for r in d.reasons)


def test_reject_overtrading_count() -> None:
    cfg = RiskConfig(max_trades_per_day=10)
    acc = AccountState(equity=10_000, trades_today=10)
    d = evaluate_trade(cfg, acc, TradeProposal("AAPL", 100, 96), now=NOW)
    assert not d.approved
    assert any("trades quotidiens" in r for r in d.reasons)


def test_reject_min_delay_between_trades() -> None:
    cfg = RiskConfig(min_minutes_between_trades=5)
    acc = AccountState(equity=10_000, last_trade_at=NOW - timedelta(minutes=2))
    d = evaluate_trade(cfg, acc, TradeProposal("AAPL", 100, 96), now=NOW)
    assert not d.approved
    assert any("anti-sur-trading" in r for r in d.reasons)
    # après le délai → autorisé
    acc2 = AccountState(equity=10_000, last_trade_at=NOW - timedelta(minutes=6))
    assert evaluate_trade(cfg, acc2, TradeProposal("AAPL", 100, 96), now=NOW).approved


def test_reject_insufficient_capital() -> None:
    cfg = RiskConfig(max_risk_per_trade_pct=1)
    acc = AccountState(equity=10)  # 1 % = 0,10 $ ; risque/action 4 $ → 0 action
    d = evaluate_trade(cfg, acc, TradeProposal("AAPL", 100, 96), now=NOW)
    assert not d.approved
    assert any("Capital insuffisant" in r for r in d.reasons)


def test_config_validation() -> None:
    for bad in (
        lambda: RiskConfig(max_risk_per_trade_pct=0),
        lambda: RiskConfig(daily_loss_limit_pct=200),
        lambda: RiskConfig(max_open_positions=0),
        lambda: RiskConfig(max_trades_per_day=0),
    ):
        try:
            bad()
        except ValueError:
            continue
        raise AssertionError("ValueError attendue")


def _run() -> None:
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for fn in fns:
        fn()
        print(f"  ✓ {fn.__name__}")
    print(f"risk : {len(fns)} tests OK ✅")


if __name__ == "__main__":
    _run()
