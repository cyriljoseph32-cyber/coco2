"""Indicateurs techniques — logique pure (aucune dépendance tierce).

Réplique côté backend les indicateurs du frontend (cohérence des signaux)
et en ajoute (volume moyen) pour le scoring.
"""

from __future__ import annotations

import math
from dataclasses import dataclass


@dataclass
class Candle:
    time: int
    open: float
    high: float
    low: float
    close: float
    volume: float = 0.0


def sma(values: list[float], period: int) -> list[float | None]:
    out: list[float | None] = [None] * len(values)
    total = 0.0
    for i, v in enumerate(values):
        total += v
        if i >= period:
            total -= values[i - period]
        if i >= period - 1:
            out[i] = total / period
    return out


def rsi(values: list[float], period: int) -> list[float | None]:
    """RSI de Wilder."""
    out: list[float | None] = [None] * len(values)
    if len(values) <= period:
        return out

    gain = loss = 0.0
    for i in range(1, period + 1):
        diff = values[i] - values[i - 1]
        if diff > 0:
            gain += diff
        else:
            loss -= diff
    gain /= period
    loss /= period
    out[period] = 100.0 if loss == 0 else 100.0 - 100.0 / (1 + gain / loss)

    for i in range(period + 1, len(values)):
        diff = values[i] - values[i - 1]
        g = diff if diff > 0 else 0.0
        ll = -diff if diff < 0 else 0.0
        gain = (gain * (period - 1) + g) / period
        loss = (loss * (period - 1) + ll) / period
        out[i] = 100.0 if loss == 0 else 100.0 - 100.0 / (1 + gain / loss)
    return out


def atr(candles: list[Candle], period: int) -> list[float | None]:
    """ATR de Wilder (amplitude moyenne vraie)."""
    n = len(candles)
    out: list[float | None] = [None] * n
    if n <= period:
        return out

    tr = [0.0] * n
    tr[0] = candles[0].high - candles[0].low
    for i in range(1, n):
        c = candles[i]
        prev = candles[i - 1].close
        tr[i] = max(c.high - c.low, abs(c.high - prev), abs(c.low - prev))

    avg = sum(tr[1 : period + 1]) / period
    out[period] = avg
    for i in range(period + 1, n):
        avg = (avg * (period - 1) + tr[i]) / period
        out[i] = avg
    return out


def avg_volume(candles: list[Candle], period: int) -> float | None:
    """Volume moyen sur les `period` dernières bougies (hors dernière)."""
    if len(candles) < period + 1:
        return None
    window = candles[-period - 1 : -1]
    vols = [c.volume for c in window if c.volume > 0]
    if not vols:
        return None
    return sum(vols) / len(vols)


def stdev(values: list[float]) -> float:
    n = len(values)
    if n < 2:
        return 0.0
    mean = sum(values) / n
    return math.sqrt(sum((v - mean) ** 2 for v in values) / (n - 1))
