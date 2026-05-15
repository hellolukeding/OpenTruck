from __future__ import annotations

from datetime import timedelta
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.api_key import ApiKey
from app.models.common import utc_now
from app.models.gateway_usage_ledger import GatewayUsageLedger
from app.models.node_model import NodeModel
from app.models.tenant import Tenant
from app.models.upstream_account import UpstreamAccount
from app.schemas.dashboard import DashboardMetric, DashboardOverviewRead, DashboardUsagePoint


router = APIRouter(prefix="/dashboard", tags=["admin-dashboard"])


@router.get("", response_model=DashboardOverviewRead)
def get_dashboard_overview(db: Session = Depends(get_db)) -> DashboardOverviewRead:
    since = utc_now() - timedelta(days=7)

    tenant_count = db.scalar(select(func.count()).select_from(Tenant)) or 0
    active_api_keys = db.scalar(select(func.count()).where(ApiKey.status == "active")) or 0
    active_upstream_accounts = db.scalar(select(func.count()).where(UpstreamAccount.status == "active")) or 0
    published_models = db.scalar(select(func.count()).where(NodeModel.status == "active")) or 0
    total_balance = db.scalar(select(func.coalesce(func.sum(Tenant.quota_balance), 0))) or Decimal("0")
    recent_failed_requests = db.scalar(
        select(func.count()).where(
            GatewayUsageLedger.status != "succeeded",
            GatewayUsageLedger.created_at >= since,
        )
    ) or 0

    trend_rows = db.execute(
        select(
            func.date(GatewayUsageLedger.created_at).label("bucket"),
            func.count(GatewayUsageLedger.id).label("requests"),
            func.coalesce(func.sum(GatewayUsageLedger.quota_delta), 0).label("spend"),
        )
        .where(GatewayUsageLedger.created_at >= since)
        .group_by(func.date(GatewayUsageLedger.created_at))
        .order_by(func.date(GatewayUsageLedger.created_at))
    ).all()

    metrics = [
      DashboardMetric(label="活跃密钥", value=active_api_keys),
      DashboardMetric(label="账号池", value=active_upstream_accounts),
      DashboardMetric(label="已发布模型", value=published_models),
      DashboardMetric(label="总余额", value=total_balance),
    ]

    usage_trend = [
        DashboardUsagePoint(bucket=row.bucket, requests=row.requests, spend=row.spend)
        for row in trend_rows
    ]

    return DashboardOverviewRead(
        tenant_count=tenant_count,
        active_api_keys=active_api_keys,
        active_upstream_accounts=active_upstream_accounts,
        published_models=published_models,
        total_balance=total_balance,
        recent_failed_requests=recent_failed_requests,
        metrics=metrics,
        usage_trend=usage_trend,
    )
