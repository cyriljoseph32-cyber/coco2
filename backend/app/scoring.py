"""Moteur de scoring 0-100 — logique pure (aucune dépendance tierce).

Note un actif selon plusieurs composantes pondérées. Plus le score est haut,
plus l'opportunité d'achat (long) est forte selon la méthode retour-à-la-moyenne
en tendance haussière. Chaque composante est bornée pour éviter qu'une seule
domine — robustesse avant tout.

    90-100 : très forte opportunité
    70-89  : opportunité intéressante
    50-69  : surveillance
    <50    : ignorer
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .indicators import Candle, atr, avg_volume, rsi, sma


@dataclass
class ScoreResult:
    symbol: str
    score: int                       # 0..100
    label: str                       # catégorie lisible
    last_close: float
    trend: str                       # "haussier" | "baissier"
    rsi2: float | None
    rsi14: float | None
    components: dict[str, float] = field(default_factory=dict)  # détail par composante
    reasons: list[str] = field(default_factory=list)           # explications lisibles


# Pondérations maximales par composante (somme = 100)
W_TREND = 30.0
W_PULLBACK = 25.0
W_RSI_REGIME = 15.0
W_VOLUME = 15.0
W_VOLATILITY = 15.0


def label_for(score: int) -> str:
    if score >= 90:
        return "Très forte opportunité"
    if score >= 70:
        return "Opportunité intéressante"
    if score >= 50:
        return "Surveillance"
    return "Ignorer"


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def compute_score(symbol: str, candles: list[Candle]) -> ScoreResult | None:
    """Calcule le score d'un actif à partir de ses bougies journalières."""
    if len(candles) < 205:
        return None

    closes = [c.close for c in candles]
    last = closes[-1]
    sma200 = sma(closes, 200)[-1]
    sma50 = sma(closes, 50)[-1]
    rsi2v = rsi(closes, 2)[-1]
    rsi14v = rsi(closes, 14)[-1]
    atr14 = atr(candles, 14)[-1]
    avg_vol = avg_volume(candles, 20)
    last_vol = candles[-1].volume

    comp: dict[str, float] = {}
    reasons: list[str] = []

    # 1. Tendance de fond : cours > MM200 et MM50 > MM200
    trend_score = 0.0
    bullish = sma200 is not None and last > sma200
    if bullish:
        trend_score += W_TREND * 0.6
        reasons.append("Cours au-dessus de la MM200 (tendance haussière).")
        if sma50 is not None and sma200 is not None and sma50 > sma200:
            trend_score += W_TREND * 0.4
            reasons.append("MM50 > MM200 (structure haussière confirmée).")
    else:
        reasons.append("Cours sous la MM200 — tendance non haussière.")
    comp["trend"] = round(trend_score, 1)

    # 2. Repli excessif court terme (RSI2 bas) — uniquement utile en tendance haussière
    pullback = 0.0
    if rsi2v is not None and bullish:
        # RSI2 de 0 → score max ; RSI2 ≥ 30 → 0
        pullback = W_PULLBACK * _clamp((30.0 - rsi2v) / 30.0, 0.0, 1.0)
        if rsi2v < 10:
            reasons.append(f"Repli excessif (RSI2={rsi2v:.0f}) : rebond probable.")
    comp["pullback"] = round(pullback, 1)

    # 3. Régime RSI14 sain (ni surachat extrême ni effondrement)
    rsi_regime = 0.0
    if rsi14v is not None:
        # optimum vers 40-55 (achat de repli sain) ; pénalise >70 et <25
        rsi_regime = W_RSI_REGIME * _clamp(1.0 - abs(rsi14v - 47.0) / 35.0, 0.0, 1.0)
    comp["rsi_regime"] = round(rsi_regime, 1)

    # 4. Volume : participation supérieure à la moyenne = intérêt
    volume = 0.0
    if avg_vol and last_vol > 0:
        ratio = last_vol / avg_vol
        volume = W_VOLUME * _clamp((ratio - 0.7) / 0.8, 0.0, 1.0)  # 0.7x→0, 1.5x→max
        if ratio > 1.5:
            reasons.append(f"Volume élevé ({ratio:.1f}× la moyenne).")
    comp["volume"] = round(volume, 1)

    # 5. Volatilité dans une bande saine (ni morte, ni explosive)
    volatility = 0.0
    if atr14 is not None and last > 0:
        atr_pct = atr14 / last * 100.0
        # optimum ~1.5-3 % ; pénalise <0.5 % (illiquide) et >6 % (chaotique)
        volatility = W_VOLATILITY * _clamp(1.0 - abs(atr_pct - 2.25) / 4.0, 0.0, 1.0)
    comp["volatility"] = round(volatility, 1)

    total = trend_score + pullback + rsi_regime + volume + volatility
    score = int(round(_clamp(total, 0.0, 100.0)))

    return ScoreResult(
        symbol=symbol,
        score=score,
        label=label_for(score),
        last_close=last,
        trend="haussier" if bullish else "baissier",
        rsi2=rsi2v,
        rsi14=rsi14v,
        components=comp,
        reasons=reasons,
    )
