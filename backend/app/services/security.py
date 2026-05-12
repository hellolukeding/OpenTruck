from __future__ import annotations

import hashlib
import uuid
from datetime import datetime, timedelta, timezone

import jwt

from app.core.errors import APIError
from app.core.settings import settings


def hash_api_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()


def looks_like_jwt(token: str) -> bool:
    return token.count(".") == 2


def create_gateway_jwt(
    *,
    tenant_id: uuid.UUID,
    api_key_id: uuid.UUID,
    expires_in_minutes: int | None = None,
) -> tuple[str, datetime]:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=expires_in_minutes or settings.jwt_access_token_expire_minutes,
    )
    payload = {
        "sub": str(api_key_id),
        "tenant_id": str(tenant_id),
        "api_key_id": str(api_key_id),
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "token_type": "gateway_access",
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm), expires_at


def decode_gateway_jwt(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
            audience=settings.jwt_audience,
            issuer=settings.jwt_issuer,
        )
    except jwt.ExpiredSignatureError as exc:
        raise APIError(status_code=401, code="jwt_expired", message="JWT has expired") from exc
    except jwt.InvalidTokenError as exc:
        raise APIError(status_code=401, code="jwt_invalid", message="Invalid JWT") from exc
