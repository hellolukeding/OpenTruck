from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import EmailAddress, ResourceStatus, ShortName, UpstreamAccountType, UpstreamPlatform


class UpstreamAccountCreate(BaseModel):
    tenant_id: uuid.UUID
    name: ShortName
    platform: UpstreamPlatform = "openai"
    account_type: UpstreamAccountType = "oauth"
    status: ResourceStatus = "active"
    provider_account_id: str | None = Field(default=None, min_length=1, max_length=128)
    provider_user_id: str | None = Field(default=None, min_length=1, max_length=128)
    organization_id: str | None = Field(default=None, min_length=1, max_length=128)
    email: EmailAddress | None = None
    plan_type: str | None = Field(default=None, min_length=1, max_length=64)
    client_id: str | None = Field(default=None, min_length=1, max_length=128)
    token_expires_at: datetime | None = None
    last_refreshed_at: datetime | None = None
    credentials: dict = Field(default_factory=dict)
    extra: dict = Field(default_factory=dict)


class UpstreamAccountUpdate(BaseModel):
    name: ShortName | None = None
    status: ResourceStatus | None = None
    provider_account_id: str | None = Field(default=None, min_length=1, max_length=128)
    provider_user_id: str | None = Field(default=None, min_length=1, max_length=128)
    organization_id: str | None = Field(default=None, min_length=1, max_length=128)
    email: EmailAddress | None = None
    plan_type: str | None = Field(default=None, min_length=1, max_length=64)
    client_id: str | None = Field(default=None, min_length=1, max_length=128)
    token_expires_at: datetime | None = None
    last_refreshed_at: datetime | None = None
    credentials: dict | None = None
    extra: dict | None = None


class UpstreamAccountRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: uuid.UUID
    name: str
    platform: UpstreamPlatform
    account_type: UpstreamAccountType
    status: ResourceStatus
    provider_account_id: str | None
    provider_user_id: str | None
    organization_id: str | None
    email: str | None
    plan_type: str | None
    client_id: str | None
    token_expires_at: datetime | None
    last_refreshed_at: datetime | None
    extra: dict
    has_refresh_token: bool = False
    created_at: datetime
    updated_at: datetime
