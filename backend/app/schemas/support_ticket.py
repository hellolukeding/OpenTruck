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


class SupportTicketMessageCreate(BaseModel):
    author_type: str = Field(default="customer", min_length=3, max_length=32)
    author_name: str | None = Field(default=None, max_length=128)
    body: str = Field(min_length=2, max_length=4000)
    is_internal: bool = False
    status: str | None = Field(default=None, min_length=3, max_length=32)
    priority: str | None = Field(default=None, min_length=3, max_length=32)


class SupportTicketMessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    ticket_id: uuid.UUID
    author_type: str
    author_name: str | None = None
    body: str
    is_internal: bool
    created_at: datetime
    updated_at: datetime


class SupportTicketDetailRead(SupportTicketRead):
    messages: list[SupportTicketMessageRead]


class SupportTicketUpdate(BaseModel):
    status: str | None = Field(default=None, min_length=3, max_length=32)
    priority: str | None = Field(default=None, min_length=3, max_length=32)
