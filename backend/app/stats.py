"""Métriques de performance — logique pure (aucune dépendance tierce).

Calcule sur une liste de trades clôturés : taux de réussite, profit factor,
drawdown maximum, ratio de Sharpe, espérance, courbe d'équité. Sert au journal
et au dashboard.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field


@dataclass
class PerfStats:
    trades: int = 0
    wins: int = 0
    losses: int = 0
    win_rate: float = 0.0          # 0..1
    total_pnl: float = 0.0
    avg_win: float = 0.0
    avg_loss: float = 0.0          # négatif
    profit_factor: float = 0.0     # somme gains / |somme pertes| (inf si aucune perte)
    expectancy: float = 0.0        # P&L moyen par trade
    max_drawdown: float = 0.0      # plus forte baisse depuis un pic (valeur ≤ 0)
    max_drawdown_pct: float = 0.0  # idem en % du pic
    sharpe: float = 0.0            # ratio de Sharpe (par trade, non annualisé)
    equity_curve: list[float] = field(default_factory=list)


def compute_stats(pnls: list[float], starting_equity: float = 0.0) -> PerfStats:
    """`pnls` = P&L (en $) de chaque trade clôturé, dans l'ordre chronologique."""
    s = PerfStats()
    if not pnls:
        return s

    s.trades = len(pnls)
    wins = [p for p in pnls if p > 0]
    losses = [p for p in pnls if p < 0]
    s.wins = len(wins)
    s.losses = len(losses)
    s.win_rate = s.wins / s.trades
    s.total_pnl = sum(pnls)
    s.avg_win = sum(wins) / len(wins) if wins else 0.0
    s.avg_loss = sum(losses) / len(losses) if losses else 0.0
    s.expectancy = s.total_pnl / s.trades

    gross_profit = sum(wins)
    gross_loss = abs(sum(losses))
    s.profit_factor = (gross_profit / gross_loss) if gross_loss > 0 else math.inf

    # Courbe d'équité cumulée
    equity = starting_equity
    curve = [equity]
    for p in pnls:
        equity += p
        curve.append(equity)
    s.equity_curve = curve

    # Drawdown maximum (depuis le pic le plus haut atteint)
    peak = curve[0]
    max_dd = 0.0
    max_dd_pct = 0.0
    for v in curve:
        peak = max(peak, v)
        dd = v - peak
        if dd < max_dd:
            max_dd = dd
            max_dd_pct = (dd / peak * 100.0) if peak > 0 else 0.0
    s.max_drawdown = max_dd
    s.max_drawdown_pct = max_dd_pct

    # Sharpe par trade = moyenne / écart-type des P&L (0 si pas de variation)
    mean = s.expectancy
    if s.trades > 1:
        var = sum((p - mean) ** 2 for p in pnls) / (s.trades - 1)
        std = math.sqrt(var)
        s.sharpe = (mean / std) if std > 0 else 0.0
    return s
