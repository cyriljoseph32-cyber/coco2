"""Scanner de marché : récupère les bougies puis score chaque actif.

Source de données pluggable. Par défaut Yahoo Finance (sans clé) via la
bibliothèque standard. En production, remplacer `fetch_candles` par un
fournisseur pro (Polygon, Alpaca Market Data) en gardant la même signature.
"""

from __future__ import annotations

import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from .indicators import Candle
from .scoring import ScoreResult, compute_score

_YAHOO = "https://query1.finance.yahoo.com/v8/finance/chart/{sym}?range={rng}&interval=1d"
_HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; SignalBot/1.0)"}


def fetch_candles(symbol: str, rng: str = "2y", timeout: float = 10.0) -> list[Candle]:
    """Récupère les bougies journalières d'un actif (Yahoo Finance)."""
    url = _YAHOO.format(sym=urllib.parse.quote(symbol), rng=rng)
    req = urllib.request.Request(url, headers=_HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as resp:  # noqa: S310
        data = json.loads(resp.read().decode("utf-8"))

    result = (data.get("chart") or {}).get("result") or []
    if not result:
        raise ValueError(f"Données indisponibles pour {symbol}")
    r0 = result[0]
    ts = r0.get("timestamp") or []
    quote = ((r0.get("indicators") or {}).get("quote") or [{}])[0]
    opens, highs = quote.get("open") or [], quote.get("high") or []
    lows, closes = quote.get("low") or [], quote.get("close") or []
    vols = quote.get("volume") or []

    candles: list[Candle] = []
    for i in range(len(ts)):
        o, h, l, c = opens[i], highs[i], lows[i], closes[i]
        if None in (o, h, l, c):
            continue
        candles.append(Candle(ts[i], o, h, l, c, vols[i] or 0.0))
    return candles


def scan_symbol(symbol: str) -> ScoreResult | None:
    """Récupère + score un actif. Renvoie None si données insuffisantes/erreur."""
    try:
        candles = fetch_candles(symbol)
        return compute_score(symbol, candles)
    except Exception:
        return None


def scan_universe(symbols: list[str], max_workers: int = 8) -> list[ScoreResult]:
    """Scanne un univers en parallèle, trié par score décroissant."""
    results: list[ScoreResult] = []
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        for res in pool.map(scan_symbol, symbols):
            if res is not None:
                results.append(res)
    results.sort(key=lambda r: r.score, reverse=True)
    return results
