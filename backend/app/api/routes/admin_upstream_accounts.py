from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.routes.admin_openai_oauth import serialize_upstream_account
from app.api.utils import apply_updates, build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import bad_request, not_found
from app.models.upstream_account import UpstreamAccount
from app.schemas.common import ResourceStatus, SortOrder, UpstreamAccountType, UpstreamPlatform
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.upstream_account import UpstreamAccountCreate, UpstreamAccountRead, UpstreamAccountUpdate
from app.services.openai_oauth import OpenAIOAuthService, utc_now


router = APIRouter(prefix="/upstream-accounts", tags=["admin-upstream-accounts"])


@router.get("", response_model=PaginatedResponse[UpstreamAccountRead])
def list_upstream_accounts(
    tenant_id: uuid.UUID | None = Query(default=None),
    platform: UpstreamPlatform | None = Query(default=None),
    account_type: UpstreamAccountType | None = Query(default=None),
    status: ResourceStatus | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: SortOrder = Query(default="desc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[UpstreamAccountRead]:
    statement = select(UpstreamAccount)

    if tenant_id:
        statement = statement.where(UpstreamAccount.tenant_id == tenant_id)
    if platform:
        statement = statement.where(UpstreamAccount.platform == platform)
    if account_type:
        statement = statement.where(UpstreamAccount.account_type == account_type)
    if status:
        statement = statement.where(UpstreamAccount.status == status)

    search_filter = build_search_filter(
        search,
        UpstreamAccount.name,
        UpstreamAccount.email,
        UpstreamAccount.provider_account_id,
    )
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "name": UpstreamAccount.name,
                "email": UpstreamAccount.email,
                "platform": UpstreamAccount.platform,
                "account_type": UpstreamAccount.account_type,
                "status": UpstreamAccount.status,
                "plan_type": UpstreamAccount.plan_type,
                "created_at": UpstreamAccount.created_at,
                "updated_at": UpstreamAccount.updated_at,
                "token_expires_at": UpstreamAccount.token_expires_at,
            },
        )
    )

    page_result = paginate(db, statement, page=page, page_size=page_size)
    page_result.items = [serialize_upstream_account(item) for item in page_result.items]
    return page_result


@router.post("", response_model=UpstreamAccountRead, status_code=status.HTTP_201_CREATED)
def create_upstream_account(payload: UpstreamAccountCreate, db: Session = Depends(get_db)) -> UpstreamAccountRead:
    account = UpstreamAccount(**payload.model_dump())
    db.add(account)
    commit_or_409(db, "Upstream account", "provider_account_id", account)
    return serialize_upstream_account(account)


@router.get("/{account_id}", response_model=UpstreamAccountRead, responses={404: {"model": ErrorResponse}})
def get_upstream_account(account_id: str, db: Session = Depends(get_db)) -> UpstreamAccountRead:
    account = db.get(UpstreamAccount, account_id)
    if account is None:
        raise not_found("Upstream account")
    return serialize_upstream_account(account)


@router.patch(
    "/{account_id}",
    response_model=UpstreamAccountRead,
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}},
)
def update_upstream_account(account_id: str, payload: UpstreamAccountUpdate, db: Session = Depends(get_db)) -> UpstreamAccountRead:
    account = db.get(UpstreamAccount, account_id)
    if account is None:
        raise not_found("Upstream account")

    apply_updates(account, payload.model_dump(exclude_unset=True))
    commit_or_409(db, "Upstream account", "provider_account_id", account)
    return serialize_upstream_account(account)


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT, responses={404: {"model": ErrorResponse}})
def delete_upstream_account(account_id: str, db: Session = Depends(get_db)) -> Response:
    account = db.get(UpstreamAccount, account_id)
    if account is None:
        raise not_found("Upstream account")

    db.delete(account)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{account_id}/refresh", response_model=UpstreamAccountRead, responses={404: {"model": ErrorResponse}})
def refresh_upstream_account(account_id: str, db: Session = Depends(get_db)) -> UpstreamAccountRead:
    account = db.get(UpstreamAccount, account_id)
    if account is None:
        raise not_found("Upstream account")
    if account.platform != "openai" or account.account_type != "oauth":
        raise bad_request("unsupported_refresh", "Only OpenAI OAuth upstream accounts can be refreshed")

    refresh_token = (account.credentials or {}).get("refresh_token")
    if not refresh_token:
        raise bad_request("missing_refresh_token", "Upstream account does not have a refresh token")

    service = OpenAIOAuthService(db)
    token_info = service.refresh_token(
        refresh_token=refresh_token,
        proxy_url=account.extra.get("proxy_url"),
        client_id=account.client_id,
    )

    account.credentials = {
        **(account.credentials or {}),
        "access_token": token_info.access_token,
        "refresh_token": token_info.refresh_token,
        "id_token": token_info.id_token,
    }
    account.provider_account_id = token_info.chatgpt_account_id
    account.provider_user_id = token_info.chatgpt_user_id
    account.organization_id = token_info.organization_id
    account.email = token_info.email
    account.plan_type = token_info.plan_type
    account.client_id = token_info.client_id
    account.token_expires_at = token_info.expires_at
    account.last_refreshed_at = utc_now()
    commit_or_409(db, "Upstream account", "provider_account_id", account)
    return serialize_upstream_account(account)
