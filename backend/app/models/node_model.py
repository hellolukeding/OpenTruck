from __future__ import annotations

import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.common import TimestampMixin, UUIDPrimaryKeyMixin


class NodeModel(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "node_models"
    __table_args__ = (
        UniqueConstraint("node_id", "public_model", "external_model"),
    )

    node_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("nodes.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    external_model: Mapped[str] = mapped_column(String(128), nullable=False)
    public_model: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    input_price: Mapped[Decimal] = mapped_column(Numeric(18, 6), default=Decimal("0"), nullable=False)
    output_price: Mapped[Decimal] = mapped_column(Numeric(18, 6), default=Decimal("0"), nullable=False)
    priority: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, default="active", nullable=False)

    node = relationship("Node", back_populates="models")
