from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class LeaderboardEntryRead(BaseModel):
    rank: int
    model: str
    category: str
    provider: str
    merchant_count: int
    availability_rate: Decimal
    request_count: int
    total_tokens: int
    avg_price_per_m_tokens: Decimal
    latest_request_at: datetime | None = None
    score: Decimal


class LeaderboardResponse(BaseModel):
    items: list[LeaderboardEntryRead]
    total: int
    page: int
    page_size: int
    total_pages: int
