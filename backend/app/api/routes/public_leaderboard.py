from __future__ import annotations

from collections import defaultdict
from datetime import timedelta
from decimal import Decimal
import math

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.common import utc_now
from app.models.gateway_usage_ledger import GatewayUsageLedger
from app.models.node import Node
from app.models.node_model import NodeModel
from app.schemas.public_leaderboard import LeaderboardEntryRead, LeaderboardResponse


router = APIRouter(tags=["public-leaderboard"])


@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_public_leaderboard(
    window: str = Query(default="24h"),
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    sort_by: str = Query(default="volume"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> LeaderboardResponse:
    since = _resolve_since(window)
    usage_rows = list(
        db.execute(
            select(
                GatewayUsageLedger.model,
                GatewayUsageLedger.status,
                GatewayUsageLedger.total_tokens,
                GatewayUsageLedger.created_at,
            ).where(
                GatewayUsageLedger.created_at >= since,
                GatewayUsageLedger.model.is_not(None),
            )
        ).all()
    )
    model_rows = list(
        db.execute(
            select(NodeModel.public_model, NodeModel.input_price, NodeModel.output_price, Node.id, Node.name)
            .join(Node, Node.id == NodeModel.node_id)
            .where(NodeModel.status == "active")
        ).all()
    )

    catalog: dict[str, dict[str, object]] = defaultdict(
        lambda: {
            "prices": [],
            "merchants": set(),
            "provider": "OpenTruck Routing",
        }
    )
    for public_model, input_price, output_price, node_id, node_name in model_rows:
        entry = catalog[public_model]
        entry["prices"].append((Decimal(input_price) + Decimal(output_price)) * Decimal("500000"))
        entry["merchants"].add(str(node_id))
        entry["provider"] = f"{node_name} · OpenTruck 路由"

    grouped: dict[str, dict[str, object]] = defaultdict(
        lambda: {
            "request_count": 0,
            "success_count": 0,
            "total_tokens": 0,
            "latest_request_at": None,
        }
    )
    for model, status, total_tokens, created_at in usage_rows:
        if not model:
            continue
        item = grouped[model]
        item["request_count"] += 1
        item["success_count"] += 1 if status == "succeeded" else 0
        item["total_tokens"] += int(total_tokens or 0)
        latest = item["latest_request_at"]
        item["latest_request_at"] = created_at if latest is None or created_at > latest else latest

    entries: list[LeaderboardEntryRead] = []
    for model_name, stats in grouped.items():
        item_category = _infer_category(model_name)
        if category and category != "all" and item_category != category:
            continue
        if search and search.lower() not in model_name.lower():
            continue

        request_count = int(stats["request_count"])
        success_count = int(stats["success_count"])
        total_tokens = int(stats["total_tokens"])
        availability = Decimal("0") if request_count == 0 else (Decimal(success_count) / Decimal(request_count)) * Decimal("100")
        catalog_item = catalog.get(model_name, {})
        prices = catalog_item.get("prices", [])
        merchant_count = len(catalog_item.get("merchants", set()))
        avg_price = (
            sum(prices, Decimal("0")) / Decimal(len(prices))
            if prices
            else Decimal("0")
        )
        score = Decimal(request_count) * Decimal("0.6") + availability * Decimal("4")

        entries.append(
            LeaderboardEntryRead(
                rank=0,
                model=model_name,
                category=item_category,
                provider=str(catalog_item.get("provider", "OpenTruck Routing")),
                merchant_count=merchant_count,
                availability_rate=availability.quantize(Decimal("0.01")),
                request_count=request_count,
                total_tokens=total_tokens,
                avg_price_per_m_tokens=avg_price.quantize(Decimal("0.000001")),
                latest_request_at=stats["latest_request_at"],
                score=score.quantize(Decimal("0.01")),
            )
        )

    entries.sort(key=_sort_key(sort_by), reverse=True)
    for index, entry in enumerate(entries, start=1):
        entry.rank = index

    total = len(entries)
    total_pages = math.ceil(total / page_size) if total else 0
    start = (page - 1) * page_size
    page_items = entries[start : start + page_size]

    return LeaderboardResponse(
        items=page_items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


def _resolve_since(window: str):
    now = utc_now()
    if window == "30d":
        return now - timedelta(days=30)
    if window == "7d":
        return now - timedelta(days=7)
    return now - timedelta(hours=24)


def _infer_category(model_name: str) -> str:
    lowered = model_name.lower()
    if "embed" in lowered:
        return "embedding"
    if "image" in lowered or "vision" in lowered:
        return "image"
    if "audio" in lowered or "whisper" in lowered:
        return "audio"
    if "video" in lowered:
        return "video"
    if "codex" in lowered or "completion" in lowered:
        return "completion"
    return "chat"


def _sort_key(sort_by: str):
    if sort_by == "availability":
        return lambda item: (item.availability_rate, item.request_count)
    if sort_by == "price":
        return lambda item: (-item.avg_price_per_m_tokens, item.request_count)
    if sort_by == "score":
        return lambda item: (item.score, item.request_count)
    return lambda item: (item.request_count, item.total_tokens)
