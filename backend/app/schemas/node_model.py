from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class NodeModelCreate(BaseModel):
    node_id: uuid.UUID
    external_model: str
    public_model: str
    input_price: Decimal = Decimal("0")
    output_price: Decimal = Decimal("0")
    priority: int = 100
    status: str = "active"


class NodeModelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    node_id: uuid.UUID
    external_model: str
    public_model: str
    input_price: Decimal
    output_price: Decimal
    priority: int
    status: str
    created_at: datetime
    updated_at: datetime
