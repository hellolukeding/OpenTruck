from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.node import Node
from app.schemas.node import NodeCreate, NodeRead


router = APIRouter(prefix="/nodes", tags=["admin-nodes"])


@router.get("", response_model=list[NodeRead])
def list_nodes(db: Session = Depends(get_db)) -> list[Node]:
    return list(db.scalars(select(Node).order_by(Node.created_at.desc())).all())


@router.post("", response_model=NodeRead, status_code=status.HTTP_201_CREATED)
def create_node(payload: NodeCreate, db: Session = Depends(get_db)) -> Node:
    node = Node(**payload.model_dump())
    db.add(node)
    db.commit()
    db.refresh(node)
    return node
