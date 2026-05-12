from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel


class PaginationMeta(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    pagination: PaginationMeta
