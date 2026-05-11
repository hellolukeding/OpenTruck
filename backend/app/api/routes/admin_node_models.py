from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, commit_or_409
from app.core.errors import not_found
from app.models.node import Node
from app.models.node_model import NodeModel
from app.schemas.error import ErrorResponse
from app.schemas.node_model import NodeModelCreate, NodeModelRead, NodeModelUpdate


router = APIRouter(prefix="/node-models", tags=["admin-node-models"])


@router.get("", response_model=list[NodeModelRead])
def list_node_models(db: Session = Depends(get_db)) -> list[NodeModel]:
    return list(db.scalars(select(NodeModel).order_by(NodeModel.created_at.desc())).all())


@router.post("", response_model=NodeModelRead, status_code=status.HTTP_201_CREATED)
def create_node_model(payload: NodeModelCreate, db: Session = Depends(get_db)) -> NodeModel:
    node = db.get(Node, payload.node_id)
    if node is None:
        raise not_found("Node")

    node_model = NodeModel(**payload.model_dump())
    db.add(node_model)
    return commit_or_409(db, "Node model", "node/public/external model", node_model)


@router.get("/{node_model_id}", response_model=NodeModelRead, responses={404: {"model": ErrorResponse}})
def get_node_model(node_model_id: str, db: Session = Depends(get_db)) -> NodeModel:
    node_model = db.get(NodeModel, node_model_id)
    if node_model is None:
        raise not_found("Node model")
    return node_model


@router.patch(
    "/{node_model_id}",
    response_model=NodeModelRead,
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}},
)
def update_node_model(
    node_model_id: str,
    payload: NodeModelUpdate,
    db: Session = Depends(get_db),
) -> NodeModel:
    node_model = db.get(NodeModel, node_model_id)
    if node_model is None:
        raise not_found("Node model")

    apply_updates(node_model, payload.model_dump(exclude_unset=True))
    return commit_or_409(db, "Node model", "node/public/external model", node_model)


@router.delete(
    "/{node_model_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={404: {"model": ErrorResponse}},
)
def delete_node_model(node_model_id: str, db: Session = Depends(get_db)) -> Response:
    node_model = db.get(NodeModel, node_model_id)
    if node_model is None:
        raise not_found("Node model")

    db.delete(node_model)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
