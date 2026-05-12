from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import commit_or_409
from app.models.upstream_account import UpstreamAccount
from app.schemas.error import ErrorResponse
from app.schemas.openai_oauth import (
    OpenAIOAuthAuthUrlResponse,
    OpenAIOAuthCreateAccountRequest,
    OpenAIOAuthExchangeCodeRequest,
    OpenAIOAuthGenerateAuthUrlRequest,
    OpenAIRefreshTokenRequest,
    OpenAITokenInfo,
)
from app.schemas.upstream_account import UpstreamAccountRead
from app.services.openai_oauth import OpenAIOAuthService, utc_now


router = APIRouter(prefix="/openai/oauth", tags=["admin-openai-oauth"])


def serialize_upstream_account(account: UpstreamAccount) -> UpstreamAccountRead:
    return UpstreamAccountRead(
        id=account.id,
        tenant_id=account.tenant_id,
        name=account.name,
        platform=account.platform,
        account_type=account.account_type,
        status=account.status,
        provider_account_id=account.provider_account_id,
        provider_user_id=account.provider_user_id,
        organization_id=account.organization_id,
        email=account.email,
        plan_type=account.plan_type,
        client_id=account.client_id,
        token_expires_at=account.token_expires_at,
        last_refreshed_at=account.last_refreshed_at,
        extra=account.extra,
        has_refresh_token=bool((account.credentials or {}).get("refresh_token")),
        created_at=account.created_at,
        updated_at=account.updated_at,
    )


@router.post("/auth-url", response_model=OpenAIOAuthAuthUrlResponse, status_code=status.HTTP_201_CREATED)
def generate_auth_url(payload: OpenAIOAuthGenerateAuthUrlRequest, db: Session = Depends(get_db)) -> OpenAIOAuthAuthUrlResponse:
    service = OpenAIOAuthService(db)
    bundle = service.generate_auth_url(
        tenant_id=payload.tenant_id,
        redirect_uri=payload.redirect_uri,
        proxy_url=payload.proxy_url,
        platform=payload.platform,
    )
    return OpenAIOAuthAuthUrlResponse(
        session_id=bundle.session.id,
        auth_url=bundle.auth_url,
        state=bundle.session.state,
        expires_at=bundle.session.expires_at,
    )


@router.post("/exchange-code", response_model=OpenAITokenInfo, responses={404: {"model": ErrorResponse}})
def exchange_code(payload: OpenAIOAuthExchangeCodeRequest, db: Session = Depends(get_db)) -> OpenAITokenInfo:
    service = OpenAIOAuthService(db)
    return service.exchange_code(
        session_id=payload.session_id,
        code=payload.code,
        state=payload.state,
    )


@router.post(
    "/create-account",
    response_model=UpstreamAccountRead,
    status_code=status.HTTP_201_CREATED,
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}},
)
def create_account_from_oauth(payload: OpenAIOAuthCreateAccountRequest, db: Session = Depends(get_db)) -> UpstreamAccountRead:
    service = OpenAIOAuthService(db)
    token_info = service.exchange_code(
        session_id=payload.session_id,
        code=payload.code,
        state=payload.state,
        tenant_id=payload.tenant_id,
    )

    account = UpstreamAccount(
        tenant_id=payload.tenant_id,
        name=payload.name or token_info.email or "OpenAI OAuth Account",
        platform="openai",
        account_type="oauth",
        status=payload.status,
        provider_account_id=token_info.chatgpt_account_id,
        provider_user_id=token_info.chatgpt_user_id,
        organization_id=token_info.organization_id,
        email=token_info.email,
        plan_type=token_info.plan_type,
        client_id=token_info.client_id,
        token_expires_at=token_info.expires_at,
        last_refreshed_at=utc_now(),
        credentials={
            "access_token": token_info.access_token,
            "refresh_token": token_info.refresh_token,
            "id_token": token_info.id_token,
        },
        extra={},
    )
    db.add(account)
    commit_or_409(db, "Upstream account", "provider_account_id", account)
    return serialize_upstream_account(account)


@router.post("/refresh-token", response_model=OpenAITokenInfo)
def refresh_token(payload: OpenAIRefreshTokenRequest, db: Session = Depends(get_db)) -> OpenAITokenInfo:
    service = OpenAIOAuthService(db)
    return service.refresh_token(
        refresh_token=payload.refresh_token,
        proxy_url=payload.proxy_url,
        client_id=payload.client_id,
    )
