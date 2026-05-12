from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import ApiKeySecret, ResourceStatus, ShortName


class ApiKeyCreate(BaseModel):
    tenant_id: uuid.UUID
    name: ShortName
    raw_key: ApiKeySecret
    status: ResourceStatus = "active"
    scope: dict = Field(default_factory=dict)


class ApiKeyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: uuid.UUID
    name: str
    key_hash: str
    status: ResourceStatus
    scope: dict
    last_used_at: datetime | None
    created_at: datetime
    updated_at: datetime


class ApiKeyUpdate(BaseModel):
    name: ShortName | None = None
    raw_key: ApiKeySecret | None = None
    status: ResourceStatus | None = None
    scope: dict | None = None
