from __future__ import annotations

import hashlib

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.api_key import ApiKey
from app.models.tenant import Tenant
from app.schemas.api_key import ApiKeyCreate, ApiKeyRead


router = APIRouter(prefix="/api-keys", tags=["admin-api-keys"])


@router.get("", response_model=list[ApiKeyRead])
def list_api_keys(db: Session = Depends(get_db)) -> list[ApiKey]:
    return list(db.scalars(select(ApiKey).order_by(ApiKey.created_at.desc())).all())


@router.post("", response_model=ApiKeyRead, status_code=status.HTTP_201_CREATED)
def create_api_key(payload: ApiKeyCreate, db: Session = Depends(get_db)) -> ApiKey:
    tenant = db.get(Tenant, payload.tenant_id)
    if tenant is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant not found")

    key_hash = hashlib.sha256(payload.raw_key.encode("utf-8")).hexdigest()
    api_key = ApiKey(
        tenant_id=payload.tenant_id,
        name=payload.name,
        key_hash=key_hash,
        status=payload.status,
        scope=payload.scope,
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    return api_key
