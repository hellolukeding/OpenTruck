from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import EmailAddress


class SupportTicketCreate(BaseModel):
    tenant_id: uuid.UUID
    subject: str = Field(min_length=3, max_length=128)
    category: str = Field(min_length=2, max_length=64)
    priority: str = Field(default="normal", min_length=3, max_length=32)
    contact_email: EmailAddress
    description: str = Field(min_length=10, max_length=4000)


class SupportTicketRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: uuid.UUID
    ticket_number: str
    subject: str
    category: str
    priority: str
    status: str
    contact_email: str
    description: str
    latest_reply_at: datetime | None = None
    resolved_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class SupportTicketUpdate(BaseModel):
    status: str | None = Field(default=None, min_length=3, max_length=32)
    priority: str | None = Field(default=None, min_length=3, max_length=32)
