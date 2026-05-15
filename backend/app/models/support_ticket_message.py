from __future__ import annotations

import uuid

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.common import TimestampMixin, UUIDPrimaryKeyMixin


class SupportTicketMessage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "support_ticket_messages"

    ticket_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("support_tickets.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    author_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    author_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    is_internal: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    ticket = relationship("SupportTicket", back_populates="messages")
