from __future__ import annotations

from decimal import Decimal

from sqlalchemy import Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.common import TimestampMixin, UUIDPrimaryKeyMixin


class Tenant(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "tenants"

    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, default="active", nullable=False)
    quota_balance: Mapped[Decimal] = mapped_column(Numeric(18, 6), default=Decimal("0"), nullable=False)
    rate_limit_rpm: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    rate_limit_tpm: Mapped[int] = mapped_column(Integer, default=120000, nullable=False)

    api_keys = relationship("ApiKey", back_populates="tenant", cascade="all, delete-orphan")
    gateway_usage_entries = relationship("GatewayUsageLedger", back_populates="tenant", cascade="all, delete-orphan")
    oauth_sessions = relationship("OAuthSession", back_populates="tenant", cascade="all, delete-orphan")
    upstream_accounts = relationship("UpstreamAccount", back_populates="tenant", cascade="all, delete-orphan")
