from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import ResourceStatus, ShortName


class PaymentPlanCreate(BaseModel):
    name: ShortName
    status: ResourceStatus = "active"
    price_amount: Decimal = Field(ge=Decimal("0.01"))
    credit_amount: Decimal = Field(ge=Decimal("0.01"))
    currency: str = "CNY"
    quota_units: int = Field(default=0, ge=0)
    badge_text: str | None = Field(default=None, max_length=64)
    sort_order: int = Field(default=100, ge=0, le=100_000)
    is_featured: bool = False
    description: str | None = Field(default=None, max_length=255)


class PaymentPlanUpdate(BaseModel):
    name: ShortName | None = None
    status: ResourceStatus | None = None
    price_amount: Decimal | None = Field(default=None, ge=Decimal("0.01"))
    credit_amount: Decimal | None = Field(default=None, ge=Decimal("0.01"))
    currency: str | None = None
    quota_units: int | None = Field(default=None, ge=0)
    badge_text: str | None = Field(default=None, max_length=64)
    sort_order: int | None = Field(default=None, ge=0, le=100_000)
    is_featured: bool | None = None
    description: str | None = Field(default=None, max_length=255)


class PaymentPlanRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    status: str
    price_amount: Decimal
    credit_amount: Decimal
    currency: str
    quota_units: int
    badge_text: str | None = None
    sort_order: int
    is_featured: bool
    description: str | None = None
    created_at: datetime
    updated_at: datetime


class PaymentChannelCreate(BaseModel):
    name: ShortName
    provider: str = Field(min_length=2, max_length=32)
    channel_code: str = Field(min_length=2, max_length=32)
    status: ResourceStatus = "active"
    sort_order: int = Field(default=100, ge=0, le=100_000)
    is_recommended: bool = False
    description: str | None = Field(default=None, max_length=255)


class PaymentChannelUpdate(BaseModel):
    name: ShortName | None = None
    provider: str | None = Field(default=None, min_length=2, max_length=32)
    channel_code: str | None = Field(default=None, min_length=2, max_length=32)
    status: ResourceStatus | None = None
    sort_order: int | None = Field(default=None, ge=0, le=100_000)
    is_recommended: bool | None = None
    description: str | None = Field(default=None, max_length=255)


class PaymentChannelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    provider: str
    channel_code: str
    status: str
    sort_order: int
    is_recommended: bool
    description: str | None = None
    created_at: datetime
    updated_at: datetime
