from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.common import utc_now
from app.models.support_ticket import SupportTicket
from app.models.tenant import Tenant
from app.schemas.common import SortOrder
from app.schemas.pagination import PaginatedResponse
from app.schemas.support_ticket import SupportTicketCreate, SupportTicketRead, SupportTicketUpdate


router = APIRouter(prefix="/tickets", tags=["admin-tickets"])


def _build_ticket_number() -> str:
    return f"TKT{utc_now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:5].upper()}"


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
    )
    db.add(ticket)
    return commit_or_409(db, "Support ticket", "ticket_number", ticket)


@router.patch("/{ticket_id}", response_model=SupportTicketRead)
def update_ticket(ticket_id: str, payload: SupportTicketUpdate, db: Session = Depends(get_db)) -> SupportTicket:
    ticket = db.get(SupportTicket, ticket_id)
    if ticket is None:
        raise not_found("Support ticket")

    if payload.status is not None:
        ticket.status = payload.status
        if payload.status == "resolved":
            ticket.resolved_at = utc_now()
    if payload.priority is not None:
        ticket.priority = payload.priority
    ticket.latest_reply_at = utc_now()
    return commit_or_409(db, "Support ticket", "ticket_number", ticket)
