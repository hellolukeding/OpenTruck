from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class WalletLedgerEntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: uuid.UUID
    payment_order_id: uuid.UUID | None = None
    entry_type: str
    direction: str
    amount: Decimal
    balance_after: Decimal
    currency: str
    description: str
    reference_type: str | None = None
    reference_id: str | None = None
    created_at: datetime


class PaymentOrderCreate(BaseModel):
    tenant_id: uuid.UUID
    amount: Decimal = Field(ge=Decimal("0.01"))
    credited_amount: Decimal | None = Field(default=None, ge=Decimal("0.01"))
    currency: str = "CNY"
    payment_provider: str | None = None
    payment_channel: str | None = None
    note: str | None = None


class PaymentOrderSettle(BaseModel):
    credited_amount: Decimal | None = Field(default=None, ge=Decimal("0.01"))


class PaymentOrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: uuid.UUID
    order_number: str
    status: str
    amount: Decimal
    credited_amount: Decimal
    currency: str
    payment_provider: str | None = None
    payment_channel: str | None = None
    checkout_url: str | None = None
    note: str | None = None
    paid_at: datetime | None = None
    created_at: datetime


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


class WalletOverviewRead(BaseModel):
    tenant_id: uuid.UUID
    tenant_name: str
    balance: Decimal
    total_spent: Decimal
    total_recharged: Decimal
    total_requests: int
    successful_requests: int
    failed_requests: int
    recent_orders: list[PaymentOrderRead]
    recent_entries: list[WalletLedgerEntryRead]
    payment_plans: list[PaymentPlanRead]
    payment_channels: list[PaymentChannelRead]
