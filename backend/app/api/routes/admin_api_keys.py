from __future__ import annotations

import hashlib

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.api_key import ApiKey
from app.models.tenant import Tenant
from app.schemas.api_key import ApiKeyCreate, ApiKeyRead, ApiKeyUpdate
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse


router = APIRouter(prefix="/api-keys", tags=["admin-api-keys"])


@router.get("", response_model=PaginatedResponse[ApiKeyRead])
def list_api_keys(
    tenant_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[ApiKeyRead]:
    statement = select(ApiKey)

    if tenant_id:
        statement = statement.where(ApiKey.tenant_id == tenant_id)
    if status:
        statement = statement.where(ApiKey.status == status)

    search_filter = build_search_filter(search, ApiKey.name, ApiKey.key_hash)
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "name": ApiKey.name,
                "status": ApiKey.status,
                "last_used_at": ApiKey.last_used_at,
                "created_at": ApiKey.created_at,
                "updated_at": ApiKey.updated_at,
            },
        ),
    )
    return paginate(db, statement, page=page, page_size=page_size)


@router.post("", response_model=ApiKeyRead, status_code=status.HTTP_201_CREATED)
def create_api_key(payload: ApiKeyCreate, db: Session = Depends(get_db)) -> ApiKey:
    tenant = db.get(Tenant, payload.tenant_id)
    if tenant is None:
        raise not_found("Tenant")

    key_hash = hashlib.sha256(payload.raw_key.encode("utf-8")).hexdigest()
    api_key = ApiKey(
        tenant_id=payload.tenant_id,
        name=payload.name,
        key_hash=key_hash,
        status=payload.status,
        scope=payload.scope,
    )
    db.add(api_key)
    return commit_or_409(db, "API key", "key_hash", api_key)


@router.get("/{api_key_id}", response_model=ApiKeyRead, responses={404: {"model": ErrorResponse}})
def get_api_key(api_key_id: str, db: Session = Depends(get_db)) -> ApiKey:
    api_key = db.get(ApiKey, api_key_id)
    if api_key is None:
        raise not_found("API key")
    return api_key


@router.patch(
    "/{api_key_id}",
    response_model=ApiKeyRead,
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}},
)
def update_api_key(api_key_id: str, payload: ApiKeyUpdate, db: Session = Depends(get_db)) -> ApiKey:
    api_key = db.get(ApiKey, api_key_id)
    if api_key is None:
        raise not_found("API key")

    update_data = payload.model_dump(exclude_unset=True)
    raw_key = update_data.pop("raw_key", None)
    if raw_key:
        update_data["key_hash"] = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

    apply_updates(api_key, update_data)
    return commit_or_409(db, "API key", "key_hash", api_key)


@router.delete("/{api_key_id}", status_code=status.HTTP_204_NO_CONTENT, responses={404: {"model": ErrorResponse}})
def delete_api_key(api_key_id: str, db: Session = Depends(get_db)) -> Response:
    api_key = db.get(ApiKey, api_key_id)
    if api_key is None:
        raise not_found("API key")

    db.delete(api_key)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
