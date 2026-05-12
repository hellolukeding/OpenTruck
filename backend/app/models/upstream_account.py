from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.db.base import Base
from app.models.common import TimestampMixin, UUIDPrimaryKeyMixin


class UpstreamAccount(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "upstream_accounts"
    __table_args__ = (
        UniqueConstraint("tenant_id", "platform", "provider_account_id", name="uq_upstream_accounts_tenant_platform_account"),
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    platform: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    account_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, default="active", nullable=False)
    provider_account_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    provider_user_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    organization_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    email: Mapped[str | None] = mapped_column(String(320), index=True, nullable=True)
    plan_type: Mapped[str | None] = mapped_column(String(64), index=True, nullable=True)
    client_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    priority: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    token_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_refreshed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_error_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_error_code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    consecutive_failures: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    cooldown_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    credentials: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    extra: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

    tenant = relationship("Tenant", back_populates="upstream_accounts")
