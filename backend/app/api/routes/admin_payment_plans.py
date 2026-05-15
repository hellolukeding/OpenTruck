from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import apply_updates, build_search_filter, commit_or_409, paginate, resolve_sort
from app.core.errors import not_found
from app.models.payment_plan import PaymentPlan
from app.schemas.common import ResourceStatus, SortOrder
from app.schemas.error import ErrorResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.payment_catalog import PaymentPlanCreate, PaymentPlanRead, PaymentPlanUpdate


router = APIRouter(prefix="/payment-plans", tags=["admin-payment-plans"])


@router.get("", response_model=PaginatedResponse[PaymentPlanRead])
def list_payment_plans(
    status: ResourceStatus | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="sort_order"),
    sort_order: SortOrder = Query(default="asc"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[PaymentPlanRead]:
    statement = select(PaymentPlan)
    if status:
        statement = statement.where(PaymentPlan.status == status)

    search_filter = build_search_filter(search, PaymentPlan.name, PaymentPlan.badge_text, PaymentPlan.description)
    if search_filter is not None:
        statement = statement.where(search_filter)

    statement = statement.order_by(
        resolve_sort(
            sort_by,
            sort_order,
            {
                "name": PaymentPlan.name,
                "status": PaymentPlan.status,
                "price_amount": PaymentPlan.price_amount,
                "credit_amount": PaymentPlan.credit_amount,
                "quota_units": PaymentPlan.quota_units,
                "sort_order": PaymentPlan.sort_order,
                "created_at": PaymentPlan.created_at,
                "updated_at": PaymentPlan.updated_at,
            },
        )
    )
    return paginate(db, statement, page=page, page_size=page_size)


@router.post("", response_model=PaymentPlanRead, status_code=status.HTTP_201_CREATED)
def create_payment_plan(payload: PaymentPlanCreate, db: Session = Depends(get_db)) -> PaymentPlan:
    plan = PaymentPlan(**payload.model_dump())
    db.add(plan)
    return commit_or_409(db, "Payment plan", "name", plan)


@router.patch("/{plan_id}", response_model=PaymentPlanRead, responses={404: {"model": ErrorResponse}})
def update_payment_plan(plan_id: str, payload: PaymentPlanUpdate, db: Session = Depends(get_db)) -> PaymentPlan:
    plan = db.get(PaymentPlan, plan_id)
    if plan is None:
        raise not_found("Payment plan")

    apply_updates(plan, payload.model_dump(exclude_unset=True))
    return commit_or_409(db, "Payment plan", "name", plan)


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT, responses={404: {"model": ErrorResponse}})
def delete_payment_plan(plan_id: str, db: Session = Depends(get_db)) -> Response:
    plan = db.get(PaymentPlan, plan_id)
    if plan is None:
        raise not_found("Payment plan")

    db.delete(plan)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
