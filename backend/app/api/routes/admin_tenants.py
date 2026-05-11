from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, commit_or_409
from app.core.errors import not_found
from app.models.tenant import Tenant
from app.schemas.error import ErrorResponse
from app.schemas.tenant import TenantCreate, TenantRead, TenantUpdate


router = APIRouter(prefix="/tenants", tags=["admin-tenants"])


@router.get("", response_model=list[TenantRead])
def list_tenants(db: Session = Depends(get_db)) -> list[Tenant]:
    return list(db.scalars(select(Tenant).order_by(Tenant.created_at.desc())).all())


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
