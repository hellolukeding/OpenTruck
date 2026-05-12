from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.node import Node
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.node import NodeCreate, NodeRead, NodeUpdate


router = APIRouter(prefix="/nodes", tags=["admin-nodes"])


@router.get("", response_model=PaginatedResponse[NodeRead])
def list_nodes(
    status: str | None = Query(default=None),
    health_status: str | None = Query(default=None),
    region: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[NodeRead]:
    statement = select(Node)

    if status:
        statement = statement.where(Node.status == status)
    if health_status:
        statement = statement.where(Node.health_status == health_status)
    if region:
        statement = statement.where(Node.region == region)

    search_filter = build_search_filter(search, Node.name, Node.base_url, Node.region)
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "name": Node.name,
                "region": Node.region,
                "status": Node.status,
                "health_status": Node.health_status,
                "weight": Node.weight,
                "max_concurrency": Node.max_concurrency,
                "created_at": Node.created_at,
                "updated_at": Node.updated_at,
            },
        ),
    )
    return paginate(db, statement, page=page, page_size=page_size)


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
