from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.common import TimestampMixin, UUIDPrimaryKeyMixin


class PaymentOrder(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "payment_orders"

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    order_number: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, default="pending", nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False)
    credited_amount: Mapped[Decimal] = mapped_column(Numeric(18, 6), default=Decimal("0"), nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="CNY", nullable=False)
    payment_provider: Mapped[str | None] = mapped_column(String(32), nullable=True)
    payment_channel: Mapped[str | None] = mapped_column(String(32), nullable=True)
    checkout_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    note: Mapped[str | None] = mapped_column(String(255), nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    tenant = relationship("Tenant", back_populates="payment_orders")
    wallet_entries = relationship("WalletLedger", back_populates="payment_order")
