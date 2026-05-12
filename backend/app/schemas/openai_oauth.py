from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import LongUrl, OpenAIOAuthPlatform, ResourceStatus


class OpenAIOAuthGenerateAuthUrlRequest(BaseModel):
    tenant_id: uuid.UUID
    redirect_uri: LongUrl | None = None
    proxy_url: LongUrl | None = None
    platform: OpenAIOAuthPlatform = "openai"


class OpenAIOAuthAuthUrlResponse(BaseModel):
    session_id: uuid.UUID
    auth_url: str
    state: str
    expires_at: datetime


class OpenAIOAuthExchangeCodeRequest(BaseModel):
    session_id: uuid.UUID
    code: str = Field(min_length=1, max_length=4096)
    state: str = Field(min_length=1, max_length=255)


class OpenAITokenInfo(BaseModel):
    access_token: str
    refresh_token: str | None = None
    id_token: str | None = None
    expires_in: int
    expires_at: datetime
    client_id: str
    email: str | None = None
    chatgpt_account_id: str | None = None
    chatgpt_user_id: str | None = None
    organization_id: str | None = None
    plan_type: str | None = None


class OpenAIOAuthCreateAccountRequest(BaseModel):
    tenant_id: uuid.UUID
    session_id: uuid.UUID
    code: str = Field(min_length=1, max_length=4096)
    state: str = Field(min_length=1, max_length=255)
    name: str | None = Field(default=None, min_length=1, max_length=128)
    status: ResourceStatus = "active"


class OpenAIRefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=1, max_length=4096)
    proxy_url: LongUrl | None = None
    client_id: str | None = Field(default=None, min_length=1, max_length=128)


class OAuthSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: uuid.UUID
    platform: OpenAIOAuthPlatform
    redirect_uri: str
    expires_at: datetime
    consumed_at: datetime | None
    created_at: datetime
    updated_at: datetime
