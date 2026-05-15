from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_db
from app.api.utils import build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.common import utc_now
from app.models.support_ticket import SupportTicket
from app.models.support_ticket_message import SupportTicketMessage
from app.models.tenant import Tenant
from app.schemas.common import SortOrder
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.support_ticket import (
    SupportTicketCreate,
    SupportTicketDetailRead,
    SupportTicketMessageCreate,
    SupportTicketMessageRead,
    SupportTicketRead,
    SupportTicketUpdate,
)


router = APIRouter(prefix="/tickets", tags=["admin-tickets"])


def _build_ticket_number() -> str:
    return f"TKT{utc_now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:5].upper()}"


def _apply_ticket_state(ticket: SupportTicket, status_value: str | None, priority_value: str | None) -> None:
    if status_value is not None:
        ticket.status = status_value
        ticket.resolved_at = utc_now() if status_value == "resolved" else None
    if priority_value is not None:
        ticket.priority = priority_value
    ticket.latest_reply_at = utc_now()


@router.get("", response_model=PaginatedResponse[SupportTicketRead])
def list_tickets(
    tenant_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    priority: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: SortOrder = Query(default="desc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[SupportTicketRead]:
    statement = select(SupportTicket)
    if tenant_id:
        statement = statement.where(SupportTicket.tenant_id == tenant_id)
    if status:
        statement = statement.where(SupportTicket.status == status)
    if priority:
        statement = statement.where(SupportTicket.priority == priority)

    search_filter = build_search_filter(
        search,
        SupportTicket.ticket_number,
        SupportTicket.subject,
        SupportTicket.category,
        SupportTicket.contact_email,
    )
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "created_at": SupportTicket.created_at,
                "updated_at": SupportTicket.updated_at,
                "priority": SupportTicket.priority,
                "status": SupportTicket.status,
            },
        )
    )
    return paginate(db, statement, page=page, page_size=page_size)


@router.get("/{ticket_id}", response_model=SupportTicketDetailRead, responses={404: {"model": ErrorResponse}})
def get_ticket(ticket_id: str, db: Session = Depends(get_db)) -> SupportTicket:
    statement = select(SupportTicket).options(selectinload(SupportTicket.messages)).where(SupportTicket.id == ticket_id)
    ticket = db.scalar(statement)
    if ticket is None:
        raise not_found("Support ticket")
    return ticket


@router.post("", response_model=SupportTicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: SupportTicketCreate, db: Session = Depends(get_db)) -> SupportTicket:
    tenant = db.get(Tenant, payload.tenant_id)
    if tenant is None:
        raise not_found("Tenant")

    ticket = SupportTicket(
        tenant_id=tenant.id,
        ticket_number=_build_ticket_number(),
        subject=payload.subject,
        category=payload.category,
        priority=payload.priority,
        status="open",
        contact_email=payload.contact_email,
        description=payload.description,
        latest_reply_at=utc_now(),
    )
    db.add(ticket)
    db.flush()

    initial_message = SupportTicketMessage(
        ticket_id=ticket.id,
        author_type="customer",
        author_name=payload.contact_email,
        body=payload.description,
        is_internal=False,
    )
    db.add(initial_message)
    return commit_or_409(db, "Support ticket", "ticket_number", ticket)


@router.post(
    "/{ticket_id}/messages",
    response_model=SupportTicketMessageRead,
    status_code=status.HTTP_201_CREATED,
    responses={404: {"model": ErrorResponse}},
)
def create_ticket_message(
    ticket_id: str,
    payload: SupportTicketMessageCreate,
    db: Session = Depends(get_db),
) -> SupportTicketMessage:
    ticket = db.get(SupportTicket, ticket_id)
    if ticket is None:
        raise not_found("Support ticket")

    message = SupportTicketMessage(
        ticket_id=ticket.id,
        author_type=payload.author_type,
        author_name=payload.author_name,
        body=payload.body,
        is_internal=payload.is_internal,
    )
    db.add(message)
    _apply_ticket_state(ticket, payload.status, payload.priority)
    db.commit()
    db.refresh(message)
    return message


@router.patch("/{ticket_id}", response_model=SupportTicketRead, responses={404: {"model": ErrorResponse}})
def update_ticket(ticket_id: str, payload: SupportTicketUpdate, db: Session = Depends(get_db)) -> SupportTicket:
    ticket = db.get(SupportTicket, ticket_id)
    if ticket is None:
        raise not_found("Support ticket")

    _apply_ticket_state(ticket, payload.status, payload.priority)
    return commit_or_409(db, "Support ticket", "ticket_number", ticket)
