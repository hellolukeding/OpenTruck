from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ApiKeyCreate(BaseModel):
    tenant_id: uuid.UUID
    name: str
    raw_key: str
    status: str = "active"
    scope: dict = Field(default_factory=dict)


class ApiKeyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: uuid.UUID
    name: str
    key_hash: str
    status: str
    scope: dict
    last_used_at: datetime | None
    created_at: datetime
    updated_at: datetime


class ApiKeyUpdate(BaseModel):
    name: str | None = None
    raw_key: str | None = None
    status: str | None = None
    scope: dict | None = None
