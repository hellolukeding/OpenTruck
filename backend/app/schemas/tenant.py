from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import ResourceStatus, ShortName


class TenantCreate(BaseModel):
    name: ShortName
    status: ResourceStatus = "active"
    quota_balance: Decimal = Field(default=Decimal("0"), ge=0)
    rate_limit_rpm: int = Field(default=60, ge=1, le=1_000_000)
    rate_limit_tpm: int = Field(default=120000, ge=1, le=1_000_000_000)


class TenantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    status: ResourceStatus
    quota_balance: Decimal
    rate_limit_rpm: int
    rate_limit_tpm: int
    created_at: datetime
    updated_at: datetime


class TenantUpdate(BaseModel):
    name: ShortName | None = None
    status: ResourceStatus | None = None
    quota_balance: Decimal | None = Field(default=None, ge=0)
    rate_limit_rpm: int | None = Field(default=None, ge=1, le=1_000_000)
    rate_limit_tpm: int | None = Field(default=None, ge=1, le=1_000_000_000)
