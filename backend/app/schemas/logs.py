from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class GatewayUsageLogRead(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    tenant_name: str | None = None
    api_key_id: uuid.UUID
    api_key_name: str | None = None
    upstream_account_id: uuid.UUID | None = None
    upstream_account_name: str | None = None
    request_kind: str
    endpoint: str
    status: str
    model: str | None = None
    response_id: str | None = None
    conversation_id: str | None = None
    upstream_status_code: int | None = None
    error_code: str | None = None
    input_tokens: int
    output_tokens: int
    total_tokens: int
    quota_delta: Decimal
    created_at: datetime
