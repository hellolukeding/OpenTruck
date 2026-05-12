from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.common import (
    NodeAuthType,
    NodeHealthStatus,
    RegionName,
    ResourceStatus,
    ShortName,
    TagName,
    LongUrl,
)


class NodeCreate(BaseModel):
    name: ShortName
    base_url: LongUrl
    auth_type: NodeAuthType = "bearer"
    auth_config: dict = Field(default_factory=dict)
    region: RegionName = "global"
    status: ResourceStatus = "active"
    health_status: NodeHealthStatus = "unknown"
    weight: int = Field(default=100, ge=0, le=10_000)
    max_concurrency: int = Field(default=16, ge=1, le=100_000)
    tags: list[TagName] = Field(default_factory=list)

    @field_validator("base_url")
    @classmethod
    def validate_base_url(cls, value: str) -> str:
        if not value.startswith(("http://", "https://")):
            raise ValueError("base_url must start with http:// or https://")
        return value


class NodeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    base_url: str
    auth_type: NodeAuthType
    auth_config: dict
    region: str
    status: ResourceStatus
    health_status: NodeHealthStatus
    weight: int
    max_concurrency: int
    tags: list[str]
    created_at: datetime
    updated_at: datetime


class NodeUpdate(BaseModel):
    name: ShortName | None = None
    base_url: LongUrl | None = None
    auth_type: NodeAuthType | None = None
    auth_config: dict | None = None
    region: RegionName | None = None
    status: ResourceStatus | None = None
    health_status: NodeHealthStatus | None = None
    weight: int | None = Field(default=None, ge=0, le=10_000)
    max_concurrency: int | None = Field(default=None, ge=1, le=100_000)
    tags: list[TagName] | None = None

    @field_validator("base_url")
    @classmethod
    def validate_base_url(cls, value: str | None) -> str | None:
        if value is not None and not value.startswith(("http://", "https://")):
            raise ValueError("base_url must start with http:// or https://")
        return value
