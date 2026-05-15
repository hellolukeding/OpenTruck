from __future__ import annotations

from decimal import Decimal

from sqlalchemy import Boolean, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.common import TimestampMixin, UUIDPrimaryKeyMixin


class PaymentPlan(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "payment_plans"

    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, default="active", nullable=False)
    price_amount: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False)
    credit_amount: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="CNY", nullable=False)
    quota_units: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    badge_text: Mapped[str | None] = mapped_column(String(64), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
