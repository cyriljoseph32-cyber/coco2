"""Risk manager — logique pure (aucune dépendance tierce, 100 % testable).

Toute décision d'ouverture de position passe par `evaluate_trade`. Si une seule
règle est violée, le trade est refusé. Ces garde-fous sont la priorité absolue
avant toute exécution en argent réel.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone


@dataclass(frozen=True)
class RiskConfig:
    """Paramètres de gestion du risque (valeurs par défaut prudentes)."""

    max_risk_per_trade_pct: float = 1.0      # % du capital risqué par trade
    daily_loss_limit_pct: float = 3.0        # arrêt si perte du jour ≥ ce %
    max_open_positions: int = 5              # positions simultanées maximum
    max_trades_per_day: int = 10             # protection anti-sur-trading
    min_minutes_between_trades: int = 5      # délai minimum entre deux entrées

    def __post_init__(self) -> None:
        if not 0 < self.max_risk_per_trade_pct <= 100:
            raise ValueError("max_risk_per_trade_pct doit être dans ]0, 100]")
        if not 0 < self.daily_loss_limit_pct <= 100:
            raise ValueError("daily_loss_limit_pct doit être dans ]0, 100]")
        if self.max_open_positions < 1:
            raise ValueError("max_open_positions doit être ≥ 1")
        if self.max_trades_per_day < 1:
            raise ValueError("max_trades_per_day doit être ≥ 1")
        if self.min_minutes_between_trades < 0:
            raise ValueError("min_minutes_between_trades doit être ≥ 0")


@dataclass
class AccountState:
    """Photo de l'état du compte au moment d'évaluer un trade."""

    equity: float                            # valeur totale du compte
    realized_pnl_today: float = 0.0          # P&L réalisé du jour (négatif = perte)
    open_positions: int = 0                  # positions actuellement ouvertes
    trades_today: int = 0                    # trades déjà passés aujourd'hui
    last_trade_at: datetime | None = None    # horodatage du dernier trade (UTC)


@dataclass
class TradeProposal:
    """Trade candidat à valider."""

    symbol: str
    entry: float
    stop: float                              # stop de protection (doit être < entry pour un long)


@dataclass
class RiskDecision:
    approved: bool
    quantity: int
    risk_amount: float                       # montant en $ risqué entre entrée et stop
    reasons: list[str] = field(default_factory=list)  # raisons de refus (vide si approuvé)


def position_size(capital: float, risk_pct: float, entry: float, stop: float) -> int:
    """Nombre d'actions pour risquer `risk_pct` % du capital entre entrée et stop."""
    risk_per_share = entry - stop
    if risk_per_share <= 0 or capital <= 0 or risk_pct <= 0:
        return 0
    return math.floor((capital * risk_pct / 100.0) / risk_per_share)


def evaluate_trade(
    config: RiskConfig,
    account: AccountState,
    proposal: TradeProposal,
    now: datetime | None = None,
) -> RiskDecision:
    """Applique toutes les règles de risque. Refuse si une seule est violée."""
    now = now or datetime.now(timezone.utc)
    reasons: list[str] = []

    # 1. Stop cohérent (sinon sizing impossible / risque non maîtrisé)
    if proposal.stop >= proposal.entry:
        reasons.append("Stop invalide : il doit être strictement sous le prix d'entrée.")

    # 2. Perte maximale quotidienne atteinte → coupe-circuit
    loss_limit = account.equity * config.daily_loss_limit_pct / 100.0
    if account.realized_pnl_today <= -loss_limit:
        reasons.append(
            f"Perte quotidienne max atteinte ({account.realized_pnl_today:.2f} $ ≤ "
            f"-{loss_limit:.2f} $). Aucun nouveau trade aujourd'hui."
        )

    # 3. Trop de positions ouvertes
    if account.open_positions >= config.max_open_positions:
        reasons.append(
            f"Limite de positions simultanées atteinte "
            f"({account.open_positions}/{config.max_open_positions})."
        )

    # 4. Sur-trading : nombre de trades/jour
    if account.trades_today >= config.max_trades_per_day:
        reasons.append(
            f"Limite de trades quotidiens atteinte "
            f"({account.trades_today}/{config.max_trades_per_day})."
        )

    # 5. Sur-trading : délai minimum entre deux trades
    if account.last_trade_at is not None and config.min_minutes_between_trades > 0:
        # Certains pilotes (SQLite) renvoient des datetimes naïfs : on suppose UTC.
        last = account.last_trade_at
        if last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        elapsed = now - last
        if elapsed < timedelta(minutes=config.min_minutes_between_trades):
            remaining = config.min_minutes_between_trades - elapsed.total_seconds() / 60.0
            reasons.append(
                f"Délai anti-sur-trading : encore {remaining:.1f} min avant un nouveau trade."
            )

    qty = position_size(
        account.equity, config.max_risk_per_trade_pct, proposal.entry, proposal.stop
    )
    risk_amount = qty * (proposal.entry - proposal.stop) if qty > 0 else 0.0

    # 6. Capital insuffisant pour au moins 1 action au risque défini
    if qty < 1 and not reasons:
        reasons.append("Capital insuffisant pour 1 action au risque configuré.")

    return RiskDecision(
        approved=not reasons,
        quantity=qty if not reasons else 0,
        risk_amount=risk_amount if not reasons else 0.0,
        reasons=reasons,
    )
