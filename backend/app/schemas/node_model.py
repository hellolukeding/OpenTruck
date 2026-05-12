from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import ModelName, ResourceStatus


class NodeModelCreate(BaseModel):
    node_id: uuid.UUID
    external_model: ModelName
    public_model: ModelName
    input_price: Decimal = Field(default=Decimal("0"), ge=0)
    output_price: Decimal = Field(default=Decimal("0"), ge=0)
    priority: int = Field(default=100, ge=0, le=10_000)
    status: ResourceStatus = "active"


class NodeModelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    node_id: uuid.UUID
    external_model: str
    public_model: str
    input_price: Decimal
    output_price: Decimal
    priority: int
    status: ResourceStatus
    created_at: datetime
    updated_at: datetime


class NodeModelUpdate(BaseModel):
    external_model: ModelName | None = None
    public_model: ModelName | None = None
    input_price: Decimal | None = Field(default=None, ge=0)
    output_price: Decimal | None = Field(default=None, ge=0)
    priority: int | None = Field(default=None, ge=0, le=10_000)
    status: ResourceStatus | None = None
