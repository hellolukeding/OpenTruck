from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, commit_or_409
from app.core.errors import not_found
from app.models.node import Node
from app.schemas.error import ErrorResponse
from app.schemas.node import NodeCreate, NodeRead, NodeUpdate


router = APIRouter(prefix="/nodes", tags=["admin-nodes"])


@router.get("", response_model=list[NodeRead])
def list_nodes(db: Session = Depends(get_db)) -> list[Node]:
    return list(db.scalars(select(Node).order_by(Node.created_at.desc())).all())


@router.post("", response_model=NodeRead, status_code=status.HTTP_201_CREATED)
def create_node(payload: NodeCreate, db: Session = Depends(get_db)) -> Node:
    node = Node(**payload.model_dump())
    db.add(node)
    return commit_or_409(db, "Node", "name", node)


@router.get("/{node_id}", response_model=NodeRead, responses={404: {"model": ErrorResponse}})
def get_node(node_id: str, db: Session = Depends(get_db)) -> Node:
    node = db.get(Node, node_id)
    if node is None:
        raise not_found("Node")
    return node


@router.patch(
    "/{node_id}",
    response_model=NodeRead,
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}},
)
def update_node(node_id: str, payload: NodeUpdate, db: Session = Depends(get_db)) -> Node:
    node = db.get(Node, node_id)
    if node is None:
        raise not_found("Node")

    apply_updates(node, payload.model_dump(exclude_unset=True))
    return commit_or_409(db, "Node", "name", node)


@router.delete("/{node_id}", status_code=status.HTTP_204_NO_CONTENT, responses={404: {"model": ErrorResponse}})
def delete_node(node_id: str, db: Session = Depends(get_db)) -> Response:
    node = db.get(Node, node_id)
    if node is None:
        raise not_found("Node")

    db.delete(node)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
