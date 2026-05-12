from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.node import Node
from app.models.node_model import NodeModel
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.node_model import NodeModelCreate, NodeModelRead, NodeModelUpdate


router = APIRouter(prefix="/node-models", tags=["admin-node-models"])


@router.get("", response_model=PaginatedResponse[NodeModelRead])
def list_node_models(
    node_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    public_model: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[NodeModelRead]:
    statement = select(NodeModel)

    if node_id:
        statement = statement.where(NodeModel.node_id == node_id)
    if status:
        statement = statement.where(NodeModel.status == status)
    if public_model:
        statement = statement.where(NodeModel.public_model == public_model)

    search_filter = build_search_filter(search, NodeModel.public_model, NodeModel.external_model)
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "public_model": NodeModel.public_model,
                "external_model": NodeModel.external_model,
                "priority": NodeModel.priority,
                "status": NodeModel.status,
                "created_at": NodeModel.created_at,
                "updated_at": NodeModel.updated_at,
            },
        ),
    )
    return paginate(db, statement, page=page, page_size=page_size)


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
