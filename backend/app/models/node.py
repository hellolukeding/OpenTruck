from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.db.base import Base
from app.models.common import TimestampMixin, UUIDPrimaryKeyMixin


class Node(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "nodes"

    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    base_url: Mapped[str] = mapped_column(String(512), nullable=False)
    auth_type: Mapped[str] = mapped_column(String(32), default="bearer", nullable=False)
    auth_config: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    region: Mapped[str] = mapped_column(String(64), default="global", nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, default="active", nullable=False)
    health_status: Mapped[str] = mapped_column(
        String(32),
        index=True,
        default="unknown",
        nullable=False,
    )
    weight: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    max_concurrency: Mapped[int] = mapped_column(Integer, default=16, nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)

    models = relationship("NodeModel", back_populates="node", cascade="all, delete-orphan")
