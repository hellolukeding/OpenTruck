from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AnnouncementCreate(BaseModel):
    title: str = Field(min_length=3, max_length=160)
    body: str = Field(min_length=10, max_length=4000)
    status: str = Field(default="published", min_length=3, max_length=32)
    severity: str = Field(default="info", min_length=3, max_length=32)
    sort_order: int = Field(default=100, ge=0, le=9999)
    is_pinned: bool = False


class AnnouncementRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    body: str
    status: str
    severity: str
    sort_order: int
    is_pinned: bool
    created_at: datetime
    updated_at: datetime


class AnnouncementUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=160)
    body: str | None = Field(default=None, min_length=10, max_length=4000)
    status: str | None = Field(default=None, min_length=3, max_length=32)
    severity: str | None = Field(default=None, min_length=3, max_length=32)
    sort_order: int | None = Field(default=None, ge=0, le=9999)
    is_pinned: bool | None = None
