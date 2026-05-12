from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.tenant import Tenant
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.tenant import TenantCreate, TenantRead, TenantUpdate


router = APIRouter(prefix="/tenants", tags=["admin-tenants"])


@router.get("", response_model=PaginatedResponse[TenantRead])
def list_tenants(
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[TenantRead]:
    statement = select(Tenant)

    if status:
        statement = statement.where(Tenant.status == status)

    search_filter = build_search_filter(search, Tenant.name)
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "name": Tenant.name,
                "status": Tenant.status,
                "quota_balance": Tenant.quota_balance,
                "created_at": Tenant.created_at,
                "updated_at": Tenant.updated_at,
            },
        ),
    )
    return paginate(db, statement, page=page, page_size=page_size)


@router.post("", response_model=TenantRead, status_code=status.HTTP_201_CREATED)
def create_tenant(payload: TenantCreate, db: Session = Depends(get_db)) -> Tenant:
    tenant = Tenant(**payload.model_dump())
    db.add(tenant)
    return commit_or_409(db, "Tenant", "name", tenant)


@router.get("/{tenant_id}", response_model=TenantRead, responses={404: {"model": ErrorResponse}})
def get_tenant(tenant_id: str, db: Session = Depends(get_db)) -> Tenant:
    tenant = db.get(Tenant, tenant_id)
    if tenant is None:
        raise not_found("Tenant")
    return tenant


@router.patch(
    "/{tenant_id}",
    response_model=TenantRead,
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}},
)
def update_tenant(tenant_id: str, payload: TenantUpdate, db: Session = Depends(get_db)) -> Tenant:
    tenant = db.get(Tenant, tenant_id)
    if tenant is None:
        raise not_found("Tenant")

    apply_updates(tenant, payload.model_dump(exclude_unset=True))
    return commit_or_409(db, "Tenant", "name", tenant)


@router.delete("/{tenant_id}", status_code=status.HTTP_204_NO_CONTENT, responses={404: {"model": ErrorResponse}})
def delete_tenant(tenant_id: str, db: Session = Depends(get_db)) -> Response:
    tenant = db.get(Tenant, tenant_id)
    if tenant is None:
        raise not_found("Tenant")

    db.delete(tenant)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
