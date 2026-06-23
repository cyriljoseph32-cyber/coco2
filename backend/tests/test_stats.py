"""Tests des métriques de performance — python3 seul.

    python3 -m tests.test_stats
"""

from __future__ import annotations

import math

from app.stats import compute_stats


def test_empty() -> None:
    s = compute_stats([])
    assert s.trades == 0 and s.total_pnl == 0.0 and s.win_rate == 0.0


def test_basic_counts() -> None:
    s = compute_stats([100, -50, 200, -30, 80])
    assert s.trades == 5
    assert s.wins == 3 and s.losses == 2
    assert abs(s.win_rate - 0.6) < 1e-9
    assert abs(s.total_pnl - 300) < 1e-9
    assert abs(s.expectancy - 60) < 1e-9


def test_profit_factor() -> None:
    # gains = 300, pertes = 80 → PF = 3.75
    s = compute_stats([100, 200, -50, -30])
    assert abs(s.profit_factor - 3.75) < 1e-9
    # aucune perte → infini
    assert math.isinf(compute_stats([10, 20]).profit_factor)


def test_avg_win_loss() -> None:
    s = compute_stats([100, 200, -40, -60])
    assert abs(s.avg_win - 150) < 1e-9
    assert abs(s.avg_loss - (-50)) < 1e-9


def test_drawdown() -> None:
    # équité : 0 → 100 → 60 → 160 ; pic 100, creux 60 → DD = -40
    s = compute_stats([100, -40, 100], starting_equity=0)
    assert abs(s.max_drawdown - (-40)) < 1e-9
    assert s.equity_curve == [0, 100, 60, 160]


def test_drawdown_pct() -> None:
    # depuis 1000 : +0 → pic 1000 ; -200 → 800 → DD% = -20 %
    s = compute_stats([-200, 100], starting_equity=1000)
    assert abs(s.max_drawdown - (-200)) < 1e-9
    assert abs(s.max_drawdown_pct - (-20)) < 1e-9


def test_sharpe() -> None:
    # P&L constants → écart-type 0 → Sharpe 0 (pas de récompense au risque mesurable)
    assert compute_stats([50, 50, 50]).sharpe == 0.0
    # P&L variables → Sharpe positif si moyenne > 0
    assert compute_stats([100, -20, 80, -10, 60]).sharpe > 0


def _run() -> None:
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for fn in fns:
        fn()
        print(f"  ✓ {fn.__name__}")
    print(f"stats : {len(fns)} tests OK ✅")


if __name__ == "__main__":
    _run()
