from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NodeCreate(BaseModel):
    name: str
    base_url: str
    auth_type: str = "bearer"
    auth_config: dict = Field(default_factory=dict)
    region: str = "global"
    status: str = "active"
    health_status: str = "unknown"
    weight: int = 100
    max_concurrency: int = 16
    tags: list[str] = Field(default_factory=list)


class NodeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    base_url: str
    auth_type: str
    auth_config: dict
    region: str
    status: str
    health_status: str
    weight: int
    max_concurrency: int
    tags: list[str]
    created_at: datetime
    updated_at: datetime
