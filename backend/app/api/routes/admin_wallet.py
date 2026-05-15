from __future__ import annotations

import uuid
from decimal import Decimal

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.utils import commit_or_409
from app.core.errors import not_found
from app.models.common import utc_now
from app.models.gateway_usage_ledger import GatewayUsageLedger
from app.models.payment_channel import PaymentChannel
from app.models.payment_order import PaymentOrder
from app.models.payment_plan import PaymentPlan
from app.models.tenant import Tenant
from app.models.wallet_ledger import WalletLedger
from app.schemas.wallet import (
    PaymentChannelRead,
    PaymentOrderCreate,
    PaymentOrderFromPlanCreate,
    PaymentOrderRead,
    PaymentOrderSettle,
    PaymentOrderStatusUpdate,
    PaymentPlanRead,
    WalletLedgerEntryRead,
    WalletOverviewRead,
)


router = APIRouter(prefix="/wallet", tags=["admin-wallet"])


def _build_order_number() -> str:
    return f"ORD{utc_now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}"


@router.get("", response_model=WalletOverviewRead)
def get_wallet_overview(
    tenant_id: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> WalletOverviewRead:
    tenant = db.get(Tenant, tenant_id) if tenant_id else db.scalar(select(Tenant).order_by(Tenant.created_at).limit(1))
    if tenant is None:
        raise not_found("Tenant")

    total_spent = db.scalar(
        select(func.coalesce(func.sum(GatewayUsageLedger.quota_delta), 0)).where(GatewayUsageLedger.tenant_id == tenant.id)
    ) or Decimal("0")
    total_recharged = db.scalar(
        select(func.coalesce(func.sum(WalletLedger.amount), 0)).where(
            WalletLedger.tenant_id == tenant.id,
            WalletLedger.direction == "credit",
        )
    ) or Decimal("0")
    total_requests = db.scalar(select(func.count()).where(GatewayUsageLedger.tenant_id == tenant.id)) or 0
    successful_requests = db.scalar(
        select(func.count()).where(GatewayUsageLedger.tenant_id == tenant.id, GatewayUsageLedger.status == "succeeded")
    ) or 0
    failed_requests = total_requests - successful_requests

    recent_orders = list(
        db.scalars(
            select(PaymentOrder)
            .where(PaymentOrder.tenant_id == tenant.id)
            .order_by(desc(PaymentOrder.created_at))
            .limit(5)
        ).all()
    )
    recent_entries = list(
        db.scalars(
            select(WalletLedger)
            .where(WalletLedger.tenant_id == tenant.id)
            .order_by(desc(WalletLedger.created_at))
            .limit(10)
        ).all()
    )
    payment_plans = list(
        db.scalars(
            select(PaymentPlan)
            .where(PaymentPlan.status == "active")
            .order_by(PaymentPlan.sort_order.asc(), PaymentPlan.created_at.asc())
        ).all()
    )
    payment_channels = list(
        db.scalars(
            select(PaymentChannel)
            .where(PaymentChannel.status == "active")
            .order_by(PaymentChannel.sort_order.asc(), PaymentChannel.created_at.asc())
        ).all()
    )

    return WalletOverviewRead(
        tenant_id=tenant.id,
        tenant_name=tenant.name,
        balance=tenant.quota_balance,
        total_spent=total_spent,
        total_recharged=total_recharged,
        total_requests=total_requests,
        successful_requests=successful_requests,
        failed_requests=failed_requests,
        recent_orders=[PaymentOrderRead.model_validate(order) for order in recent_orders],
        recent_entries=[WalletLedgerEntryRead.model_validate(entry) for entry in recent_entries],
        payment_plans=[PaymentPlanRead.model_validate(plan) for plan in payment_plans],
        payment_channels=[PaymentChannelRead.model_validate(channel) for channel in payment_channels],
    )


@router.post("/orders", response_model=PaymentOrderRead, status_code=status.HTTP_201_CREATED)
def create_payment_order(payload: PaymentOrderCreate, db: Session = Depends(get_db)) -> PaymentOrder:
    tenant = db.get(Tenant, payload.tenant_id)
    if tenant is None:
        raise not_found("Tenant")

    credited_amount = payload.credited_amount or payload.amount
    order = PaymentOrder(
        tenant_id=tenant.id,
        order_number=_build_order_number(),
        amount=payload.amount,
        credited_amount=credited_amount,
        currency=payload.currency,
        payment_provider=payload.payment_provider,
        payment_channel=payload.payment_channel,
        note=payload.note,
    )
    db.add(order)
    return commit_or_409(db, "Payment order", "order_number", order)


@router.post("/orders/from-plan", response_model=PaymentOrderRead, status_code=status.HTTP_201_CREATED)
def create_payment_order_from_plan(payload: PaymentOrderFromPlanCreate, db: Session = Depends(get_db)) -> PaymentOrder:
    tenant = db.get(Tenant, payload.tenant_id)
    if tenant is None:
        raise not_found("Tenant")

    plan = db.get(PaymentPlan, payload.plan_id)
    if plan is None:
        raise not_found("Payment plan")

    channel = db.get(PaymentChannel, payload.channel_id) if payload.channel_id else None
    order_number = _build_order_number()
    order = PaymentOrder(
        tenant_id=tenant.id,
        order_number=order_number,
        amount=plan.price_amount,
        credited_amount=plan.credit_amount,
        currency=plan.currency,
        payment_provider=channel.provider if channel else None,
        payment_channel=channel.channel_code if channel else None,
        checkout_url=f"/console/wallet/checkout/{order_number}",
        note=payload.note or f"Purchase plan {plan.name}",
    )
    db.add(order)
    return commit_or_409(db, "Payment order", "order_number", order)


@router.patch("/orders/{order_id}", response_model=PaymentOrderRead)
def update_payment_order_status(
    order_id: str,
    payload: PaymentOrderStatusUpdate,
    db: Session = Depends(get_db),
) -> PaymentOrder:
    order = db.get(PaymentOrder, order_id)
    if order is None:
        raise not_found("Payment order")
    if order.status == "paid":
        return order

    order.status = payload.status
    if payload.note is not None:
        order.note = payload.note
    if payload.checkout_url is not None:
        order.checkout_url = payload.checkout_url
    return commit_or_409(db, "Payment order", "order_number", order)


@router.post("/orders/{order_id}/settle", response_model=PaymentOrderRead)
def settle_payment_order(order_id: str, payload: PaymentOrderSettle, db: Session = Depends(get_db)) -> PaymentOrder:
    order = db.get(PaymentOrder, order_id)
    if order is None:
        raise not_found("Payment order")
    if order.status == "paid":
        return order

    tenant = db.get(Tenant, order.tenant_id)
    if tenant is None:
        raise not_found("Tenant")

    credited_amount = payload.credited_amount or order.credited_amount or order.amount
    tenant.quota_balance += credited_amount
    order.status = "paid"
    order.credited_amount = credited_amount
    order.paid_at = utc_now()

    ledger = WalletLedger(
        tenant_id=tenant.id,
        payment_order_id=order.id,
        entry_type="topup",
        direction="credit",
        amount=credited_amount,
        balance_after=tenant.quota_balance,
        currency=order.currency,
        description=f"Top-up via order {order.order_number}",
        reference_type="payment_order",
        reference_id=order.order_number,
    )
    db.add(ledger)
    db.commit()
    db.refresh(order)
    return order
