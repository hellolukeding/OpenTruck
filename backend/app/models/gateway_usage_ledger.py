from __future__ import annotations

import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.common import TimestampMixin, UUIDPrimaryKeyMixin


class GatewayUsageLedger(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "gateway_usage_ledger"

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    api_key_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("api_keys.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    upstream_account_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("upstream_accounts.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )
    request_kind: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    endpoint: Mapped[str] = mapped_column(String(128), nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, default="succeeded", nullable=False)
    model: Mapped[str | None] = mapped_column(String(128), index=True, nullable=True)
    response_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    conversation_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    upstream_status_code: Mapped[int | None] = mapped_column(Integer, nullable=True)
    error_code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    input_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    output_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    quota_delta: Mapped[Decimal] = mapped_column(Numeric(18, 6), default=Decimal("0"), nullable=False)

    tenant = relationship("Tenant", back_populates="gateway_usage_entries")
    api_key = relationship("ApiKey", back_populates="gateway_usage_entries")
    upstream_account = relationship("UpstreamAccount")
