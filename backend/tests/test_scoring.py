"""Tests indicateurs + scoring — python3 seul.

    python3 -m tests.test_scoring
"""

from __future__ import annotations

import math

from app.indicators import Candle, atr, avg_volume, rsi, sma
from app.scoring import compute_score, label_for


def _series(closes: list[float], vol: float = 1_000_000.0) -> list[Candle]:
    out = []
    for i, c in enumerate(closes):
        hi = c * 1.005
        lo = c * 0.995
        out.append(Candle(i, c, hi, lo, c, vol))
    return out


def test_sma() -> None:
    vals = [1, 2, 3, 4, 5]
    out = sma(vals, 3)
    assert out[0] is None and out[1] is None
    assert abs(out[2] - 2.0) < 1e-9
    assert abs(out[4] - 4.0) < 1e-9


def test_rsi_bounds() -> None:
    vals = [float(i % 7) + 100 for i in range(60)]
    out = rsi(vals, 14)
    assert all(v is None or 0 <= v <= 100 for v in out)


def test_rsi_all_up_is_100() -> None:
    out = rsi([100 + i for i in range(20)], 2)
    assert out[-1] == 100.0


def test_atr_positive() -> None:
    out = atr(_series([100 + i for i in range(40)]), 14)
    assert all(v is None or v > 0 for v in out[15:])


def test_avg_volume() -> None:
    candles = _series([100] * 25, vol=500.0)
    assert abs(avg_volume(candles, 20) - 500.0) < 1e-9


def test_label_thresholds() -> None:
    assert label_for(95) == "Très forte opportunité"
    assert label_for(75) == "Opportunité intéressante"
    assert label_for(55) == "Surveillance"
    assert label_for(20) == "Ignorer"


def test_score_insufficient_history() -> None:
    assert compute_score("X", _series([100] * 50)) is None


def test_score_uptrend_pullback_is_high() -> None:
    # tendance haussière longue + repli final = score élevé, tendance haussière
    closes = [100 + i * 0.5 for i in range(240)]
    closes[-1] = closes[-2] * 0.95   # repli brutal sur la dernière bougie
    closes[-2] = closes[-3] * 0.97
    r = compute_score("UP", _series(closes))
    assert r is not None
    assert r.trend == "haussier"
    assert 0 <= r.score <= 100
    assert r.score >= 50          # opportunité au moins en surveillance
    assert r.components["trend"] > 0


def test_score_downtrend_is_low() -> None:
    # tendance baissière = pas de composante repli, score faible
    closes = [300 - i * 0.5 for i in range(240)]
    r = compute_score("DN", _series(closes))
    assert r is not None
    assert r.trend == "baissier"
    assert r.components["pullback"] == 0.0
    assert r.score < 50


def test_score_components_bounded() -> None:
    closes = [100 + math.sin(i / 5) * 5 + i * 0.2 for i in range(240)]
    r = compute_score("OSC", _series(closes))
    assert r is not None
    assert 0 <= r.score <= 100
    for v in r.components.values():
        assert v >= 0


def _run() -> None:
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for fn in fns:
        fn()
        print(f"  ✓ {fn.__name__}")
    print(f"scoring/indicators : {len(fns)} tests OK ✅")


if __name__ == "__main__":
    _run()
