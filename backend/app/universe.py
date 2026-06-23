"""Univers d'actifs surveillés. Conçu pour s'étendre facilement (nouvelles
classes d'actifs = nouvelles entrées, le reste du moteur est agnostique)."""

from __future__ import annotations

# Indices / ETF larges
INDEX_ETFS = ["SPY", "QQQ", "DIA", "IWM"]

# ETF sectoriels, matières premières, obligations
SECTOR_ETFS = ["XLK", "XLF", "XLE", "XLV", "XLY", "XLI", "GLD", "SLV", "USO", "TLT"]

# Grandes capitalisations US (NYSE / NASDAQ)
US_STOCKS = [
    "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "AVGO",
    "JPM", "V", "UNH", "XOM", "KO", "PG", "HD", "COST",
]

# Crypto (activable) — symboles Yahoo
CRYPTO = ["BTC-USD", "ETH-USD", "SOL-USD"]

DEFAULT_UNIVERSE = INDEX_ETFS + SECTOR_ETFS + US_STOCKS

NAMES: dict[str, str] = {
    "SPY": "S&P 500", "QQQ": "Nasdaq 100", "DIA": "Dow Jones", "IWM": "Russell 2000",
    "XLK": "Tech", "XLF": "Finance", "XLE": "Énergie", "XLV": "Santé",
    "XLY": "Conso. cyclique", "XLI": "Industrie", "GLD": "Or", "SLV": "Argent",
    "USO": "Pétrole", "TLT": "Oblig. 20 ans+",
    "AAPL": "Apple", "MSFT": "Microsoft", "NVDA": "Nvidia", "AMZN": "Amazon",
    "GOOGL": "Alphabet", "META": "Meta", "TSLA": "Tesla", "AVGO": "Broadcom",
    "JPM": "JPMorgan", "V": "Visa", "UNH": "UnitedHealth", "XOM": "ExxonMobil",
    "KO": "Coca-Cola", "PG": "Procter & Gamble", "HD": "Home Depot", "COST": "Costco",
    "BTC-USD": "Bitcoin", "ETH-USD": "Ethereum", "SOL-USD": "Solana",
}


def resolve_universe(include_crypto: bool = False) -> list[str]:
    return DEFAULT_UNIVERSE + (CRYPTO if include_crypto else [])
