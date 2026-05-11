from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.node import Node
from app.models.node_model import NodeModel
from app.schemas.node_model import NodeModelCreate, NodeModelRead


router = APIRouter(prefix="/node-models", tags=["admin-node-models"])


@router.get("", response_model=list[NodeModelRead])
def list_node_models(db: Session = Depends(get_db)) -> list[NodeModel]:
    return list(db.scalars(select(NodeModel).order_by(NodeModel.created_at.desc())).all())


@router.post("", response_model=NodeModelRead, status_code=status.HTTP_201_CREATED)
def create_node_model(payload: NodeModelCreate, db: Session = Depends(get_db)) -> NodeModel:
    node = db.get(Node, payload.node_id)
    if node is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Node not found")

    node_model = NodeModel(**payload.model_dump())
    db.add(node_model)
    db.commit()
    db.refresh(node_model)
    return node_model
