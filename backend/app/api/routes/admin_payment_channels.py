from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.payment_channel import PaymentChannel
from app.schemas.common import ResourceStatus, SortOrder
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.payment_catalog import PaymentChannelCreate, PaymentChannelRead, PaymentChannelUpdate


router = APIRouter(prefix="/payment-channels", tags=["admin-payment-channels"])


@router.get("", response_model=PaginatedResponse[PaymentChannelRead])
def list_payment_channels(
    status: ResourceStatus | None = Query(default=None),
    provider: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="sort_order"),
    sort_order: SortOrder = Query(default="asc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[PaymentChannelRead]:
    statement = select(PaymentChannel)
    if status:
        statement = statement.where(PaymentChannel.status == status)
    if provider:
        statement = statement.where(PaymentChannel.provider == provider)

    search_filter = build_search_filter(search, PaymentChannel.name, PaymentChannel.provider, PaymentChannel.channel_code)
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "name": PaymentChannel.name,
                "provider": PaymentChannel.provider,
                "channel_code": PaymentChannel.channel_code,
                "status": PaymentChannel.status,
                "sort_order": PaymentChannel.sort_order,
                "created_at": PaymentChannel.created_at,
                "updated_at": PaymentChannel.updated_at,
            },
        )
    )
    return paginate(db, statement, page=page, page_size=page_size)


@router.post("", response_model=PaymentChannelRead, status_code=status.HTTP_201_CREATED)
def create_payment_channel(payload: PaymentChannelCreate, db: Session = Depends(get_db)) -> PaymentChannel:
    channel = PaymentChannel(**payload.model_dump())
    db.add(channel)
    return commit_or_409(db, "Payment channel", "channel_code", channel)


@router.patch("/{channel_id}", response_model=PaymentChannelRead, responses={404: {"model": ErrorResponse}})
def update_payment_channel(channel_id: str, payload: PaymentChannelUpdate, db: Session = Depends(get_db)) -> PaymentChannel:
    channel = db.get(PaymentChannel, channel_id)
    if channel is None:
        raise not_found("Payment channel")

    apply_updates(channel, payload.model_dump(exclude_unset=True))
    return commit_or_409(db, "Payment channel", "channel_code", channel)


@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT, responses={404: {"model": ErrorResponse}})
def delete_payment_channel(channel_id: str, db: Session = Depends(get_db)) -> Response:
    channel = db.get(PaymentChannel, channel_id)
    if channel is None:
        raise not_found("Payment channel")

    db.delete(channel)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
