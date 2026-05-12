from __future__ import annotations

from collections.abc import Generator
from datetime import datetime, timezone

from fastapi import Depends, Header
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import APIError, bad_request
from app.db.session import SessionLocal
from app.models.api_key import ApiKey
from app.services.gateway import TenantGatewayIdentity
from app.services.security import decode_gateway_jwt, hash_api_key, looks_like_jwt


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def extract_bearer_token(
    authorization: str | None = Header(default=None),
    x_api_key: str | None = Header(default=None),
) -> str:
    if x_api_key:
        return x_api_key.strip()
    if authorization:
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() == "bearer" and token.strip():
            return token.strip()
    raise APIError(status_code=401, code="api_key_missing", message="Missing API key")


def get_gateway_identity(
    token: str = Depends(extract_bearer_token),
    db: Session = Depends(get_db),
) -> TenantGatewayIdentity:
    if looks_like_jwt(token):
        payload = decode_gateway_jwt(token)
        tenant_id = payload.get("tenant_id")
        api_key_id = payload.get("api_key_id")
        if not tenant_id or not api_key_id:
            raise APIError(status_code=401, code="jwt_invalid", message="JWT is missing required claims")

        api_key = db.get(ApiKey, api_key_id)
        if api_key is None:
            raise APIError(status_code=401, code="jwt_api_key_missing", message="JWT references a missing API key")
        if str(api_key.tenant_id) != str(tenant_id):
            raise APIError(status_code=401, code="jwt_tenant_mismatch", message="JWT tenant does not match API key tenant")
        if api_key.status != "active":
            raise APIError(status_code=403, code="api_key_disabled", message="API key is disabled")
        if api_key.tenant is None or api_key.tenant.status != "active":
            raise APIError(status_code=403, code="tenant_disabled", message="Tenant is disabled")

        api_key.last_used_at = datetime.now(timezone.utc)
        db.commit()
        return TenantGatewayIdentity(tenant_id=api_key.tenant_id, api_key_id=api_key.id)

    statement = select(ApiKey).where(ApiKey.key_hash == hash_api_key(token))
    api_key = db.scalar(statement)
    if api_key is None:
        raise APIError(status_code=401, code="api_key_invalid", message="Invalid API key")
    if api_key.status != "active":
        raise APIError(status_code=403, code="api_key_disabled", message="API key is disabled")
    if api_key.tenant is None or api_key.tenant.status != "active":
        raise APIError(status_code=403, code="tenant_disabled", message="Tenant is disabled")

    api_key.last_used_at = datetime.now(timezone.utc)
    db.commit()
    return TenantGatewayIdentity(tenant_id=api_key.tenant_id, api_key_id=api_key.id)
