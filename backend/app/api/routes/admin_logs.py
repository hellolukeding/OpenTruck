from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import build_search_filter, paginate, resolve_sort
from app.models.api_key import ApiKey
from app.models.gateway_usage_ledger import GatewayUsageLedger
from app.models.tenant import Tenant
from app.models.upstream_account import UpstreamAccount
from app.schemas.common import SortOrder
from app.schemas.logs import GatewayUsageLogRead
from app.schemas.pagination import PaginatedResponse


router = APIRouter(prefix="/logs", tags=["admin-logs"])


@router.get("", response_model=PaginatedResponse[GatewayUsageLogRead])
def list_gateway_logs(
    tenant_id: str | None = Query(default=None),
    api_key_id: str | None = Query(default=None),
    request_kind: str | None = Query(default=None),
    status: str | None = Query(default=None),
    model: str | None = Query(default=None),
    response_id: str | None = Query(default=None),
    search: str | None = Query(default=None),
    start_at: datetime | None = Query(default=None),
    end_at: datetime | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: SortOrder = Query(default="desc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[GatewayUsageLogRead]:
    statement = (
        select(GatewayUsageLedger)
        .join(Tenant, Tenant.id == GatewayUsageLedger.tenant_id)
        .join(ApiKey, ApiKey.id == GatewayUsageLedger.api_key_id)
        .outerjoin(UpstreamAccount, UpstreamAccount.id == GatewayUsageLedger.upstream_account_id)
    )

    if tenant_id:
        statement = statement.where(GatewayUsageLedger.tenant_id == tenant_id)
    if api_key_id:
        statement = statement.where(GatewayUsageLedger.api_key_id == api_key_id)
    if request_kind:
        statement = statement.where(GatewayUsageLedger.request_kind == request_kind)
    if status:
        statement = statement.where(GatewayUsageLedger.status == status)
    if model:
        statement = statement.where(GatewayUsageLedger.model == model)
    if response_id:
        statement = statement.where(GatewayUsageLedger.response_id == response_id)
    if start_at:
        statement = statement.where(GatewayUsageLedger.created_at >= start_at)
    if end_at:
        statement = statement.where(GatewayUsageLedger.created_at <= end_at)

    search_filter = build_search_filter(
        search,
        Tenant.name,
        ApiKey.name,
        GatewayUsageLedger.model,
        GatewayUsageLedger.response_id,
        GatewayUsageLedger.conversation_id,
        GatewayUsageLedger.error_code,
    )
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "created_at": GatewayUsageLedger.created_at,
                "status": GatewayUsageLedger.status,
                "model": GatewayUsageLedger.model,
                "total_tokens": GatewayUsageLedger.total_tokens,
                "quota_delta": GatewayUsageLedger.quota_delta,
            },
        )
    )

    payload = paginate(db, statement, page=page, page_size=page_size)
    items = [
        GatewayUsageLogRead(
            id=item.id,
            tenant_id=item.tenant_id,
            tenant_name=item.tenant.name if item.tenant else None,
            api_key_id=item.api_key_id,
            api_key_name=item.api_key.name if item.api_key else None,
            upstream_account_id=item.upstream_account_id,
            upstream_account_name=item.upstream_account.name if item.upstream_account else None,
            request_kind=item.request_kind,
            endpoint=item.endpoint,
            status=item.status,
            model=item.model,
            response_id=item.response_id,
            conversation_id=item.conversation_id,
            upstream_status_code=item.upstream_status_code,
            error_code=item.error_code,
            input_tokens=item.input_tokens,
            output_tokens=item.output_tokens,
            total_tokens=item.total_tokens,
            quota_delta=item.quota_delta,
            created_at=item.created_at,
        )
        for item in payload.items
    ]
    return PaginatedResponse[GatewayUsageLogRead](items=items, pagination=payload.pagination)
