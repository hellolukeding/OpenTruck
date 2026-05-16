from __future__ import annotations

import uuid
from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.errors import not_found
from app.models.api_key import ApiKey
from app.models.node import Node
from app.models.node_model import NodeModel
from app.models.tenant import Tenant
from app.models.upstream_account import UpstreamAccount
from app.schemas.merchant_dashboard import (
    MerchantBookmarkRead,
    MerchantDashboardRead,
    MerchantKeyRead,
    MerchantModelRead,
)


router = APIRouter(prefix="/merchant-dashboard", tags=["admin-merchant-dashboard"])


@router.get("", response_model=MerchantDashboardRead)
def get_merchant_dashboard(
    tenant_id: uuid.UUID | None = Query(default=None),
    db: Session = Depends(get_db),
) -> MerchantDashboardRead:
    tenant = db.get(Tenant, tenant_id) if tenant_id else db.scalar(select(Tenant).order_by(Tenant.created_at).limit(1))
    if tenant is None:
        raise not_found("Tenant")

    keys = list(
        db.scalars(
            select(ApiKey)
            .where(ApiKey.tenant_id == tenant.id)
            .order_by(ApiKey.created_at.desc())
            .limit(5)
        ).all()
    )
    bookmarks = list(
        db.scalars(
            select(UpstreamAccount)
            .where(UpstreamAccount.tenant_id == tenant.id)
            .order_by(UpstreamAccount.priority.asc(), UpstreamAccount.created_at.asc())
            .limit(6)
        ).all()
    )
    model_rows = list(
        db.execute(
            select(NodeModel.public_model, NodeModel.input_price, NodeModel.output_price, Node.id)
            .join(Node, Node.id == NodeModel.node_id)
            .where(NodeModel.status == "active")
        ).all()
    )

    models_map: dict[str, dict[str, object]] = {}
    for public_model, input_price, output_price, node_id in model_rows:
        total_price = (Decimal(input_price) + Decimal(output_price)) * Decimal("500000")
        entry = models_map.setdefault(
            public_model,
            {
                "name": public_model,
                "category": _infer_category(public_model),
                "lowest_price": total_price,
                "merchants": set(),
            },
        )
        entry["lowest_price"] = min(entry["lowest_price"], total_price)
        entry["merchants"].add(str(node_id))

    merchant_models = [
        MerchantModelRead(
            name=str(value["name"]),
            category=str(value["category"]),
            lowest_price=Decimal(value["lowest_price"]),
            merchant_count=len(value["merchants"]),
            free=Decimal(value["lowest_price"]) == Decimal("0"),
        )
        for value in models_map.values()
    ]
    merchant_models.sort(key=lambda item: (item.category, item.lowest_price, item.name))

    key_items = [
        MerchantKeyRead(
            id=item.id,
            name=item.name,
            status=item.status,
            fingerprint=_fingerprint(item.key_hash),
            scope_label=_scope_label(item.scope),
            primary_model=_primary_model(item.scope),
            last_used_at=item.last_used_at,
        )
        for item in keys
    ]
    bookmark_items = [
        MerchantBookmarkRead(id=item.id, name=item.name, plan_type=item.plan_type, status=item.status)
        for item in bookmarks
    ]

    return MerchantDashboardRead(
        tenant_id=tenant.id,
        tenant_name=tenant.name,
        active_key_count=sum(1 for item in keys if item.status == "active"),
        total_key_count=len(keys),
        available_model_count=len(merchant_models),
        keys=key_items,
        bookmarks=bookmark_items,
        models=merchant_models,
    )


def _fingerprint(key_hash: str) -> str:
    return f"{key_hash[:4]}***********{key_hash[-4:]}"


def _scope_label(scope: dict) -> str:
    models = scope.get("models")
    if isinstance(models, list) and models:
        return " / ".join(str(item) for item in models[:2])
    return "无限额度"


def _primary_model(scope: dict) -> str | None:
    models = scope.get("models")
    if isinstance(models, list) and models:
        return str(models[0])
    return None


def _infer_category(model_name: str) -> str:
    lowered = model_name.lower()
    if "embed" in lowered:
        return "Embedding"
    if "image" in lowered or "vision" in lowered:
        return "Image"
    if "audio" in lowered or "whisper" in lowered:
        return "Audio"
    if "video" in lowered:
        return "Video"
    if "codex" in lowered or "completion" in lowered:
        return "Completion"
    return "Chat"
