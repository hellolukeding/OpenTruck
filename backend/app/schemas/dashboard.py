from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class DashboardMetric(BaseModel):
    label: str
    value: Decimal | int


class DashboardUsagePoint(BaseModel):
    bucket: date
    requests: int
    spend: Decimal


class DashboardNotice(BaseModel):
    id: str
    title: str
    body: str
    severity: str
    is_pinned: bool
    created_at: datetime


class DashboardOverviewRead(BaseModel):
    tenant_count: int
    active_api_keys: int
    active_upstream_accounts: int
    published_models: int
    total_balance: Decimal
    recent_failed_requests: int
    metrics: list[DashboardMetric]
    usage_trend: list[DashboardUsagePoint]
    notices: list[DashboardNotice]
