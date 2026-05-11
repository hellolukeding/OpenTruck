from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class TenantCreate(BaseModel):
    name: str
    status: str = "active"
    quota_balance: Decimal = Decimal("0")
    rate_limit_rpm: int = 60
    rate_limit_tpm: int = 120000


class TenantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    status: str
    quota_balance: Decimal
    rate_limit_rpm: int
    rate_limit_tpm: int
    created_at: datetime
    updated_at: datetime


class TenantUpdate(BaseModel):
    name: str | None = None
    status: str | None = None
    quota_balance: Decimal | None = None
    rate_limit_rpm: int | None = None
    rate_limit_tpm: int | None = None
