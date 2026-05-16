from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class MerchantKeyRead(BaseModel):
    id: uuid.UUID
    name: str
    status: str
    fingerprint: str
    scope_label: str
    primary_model: str | None = None
    last_used_at: datetime | None = None


class MerchantBookmarkRead(BaseModel):
    id: uuid.UUID
    name: str
    plan_type: str | None = None
    status: str


class MerchantModelRead(BaseModel):
    name: str
    category: str
    lowest_price: Decimal
    merchant_count: int
    free: bool


class MerchantDashboardRead(BaseModel):
    tenant_id: uuid.UUID
    tenant_name: str
    active_key_count: int
    total_key_count: int
    available_model_count: int
    keys: list[MerchantKeyRead]
    bookmarks: list[MerchantBookmarkRead]
    models: list[MerchantModelRead]
