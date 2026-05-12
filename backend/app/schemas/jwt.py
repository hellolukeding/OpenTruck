from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class GatewayJwtIssueRequest(BaseModel):
    expires_in_minutes: int | None = Field(default=None, ge=1, le=43_200)


class GatewayJwtIssueResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    expires_at: datetime
    tenant_id: uuid.UUID
    api_key_id: uuid.UUID
