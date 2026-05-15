from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260515_0005"
down_revision = "20260512_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "payment_orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("order_number", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("amount", sa.Numeric(18, 6), nullable=False),
        sa.Column("credited_amount", sa.Numeric(18, 6), nullable=False),
        sa.Column("currency", sa.String(length=8), nullable=False),
        sa.Column("payment_provider", sa.String(length=32), nullable=True),
        sa.Column("payment_channel", sa.String(length=32), nullable=True),
        sa.Column("checkout_url", sa.String(length=512), nullable=True),
        sa.Column("note", sa.String(length=255), nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("fk_payment_orders_tenant_id_tenants"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_payment_orders")),
        sa.UniqueConstraint("order_number", name=op.f("uq_payment_orders_order_number")),
    )
    op.create_index(op.f("ix_payment_orders_status"), "payment_orders", ["status"], unique=False)
    op.create_index(op.f("ix_payment_orders_tenant_id"), "payment_orders", ["tenant_id"], unique=False)

    op.create_table(
        "support_tickets",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("ticket_number", sa.String(length=32), nullable=False),
        sa.Column("subject", sa.String(length=128), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("priority", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("contact_email", sa.String(length=320), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("latest_reply_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("fk_support_tickets_tenant_id_tenants"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_support_tickets")),
        sa.UniqueConstraint("ticket_number", name=op.f("uq_support_tickets_ticket_number")),
    )
    op.create_index(op.f("ix_support_tickets_priority"), "support_tickets", ["priority"], unique=False)
    op.create_index(op.f("ix_support_tickets_status"), "support_tickets", ["status"], unique=False)
    op.create_index(op.f("ix_support_tickets_tenant_id"), "support_tickets", ["tenant_id"], unique=False)

    op.create_table(
        "wallet_ledger",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("payment_order_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("entry_type", sa.String(length=32), nullable=False),
        sa.Column("direction", sa.String(length=16), nullable=False),
        sa.Column("amount", sa.Numeric(18, 6), nullable=False),
        sa.Column("balance_after", sa.Numeric(18, 6), nullable=False),
        sa.Column("currency", sa.String(length=8), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=False),
        sa.Column("reference_type", sa.String(length=64), nullable=True),
        sa.Column("reference_id", sa.String(length=128), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["payment_order_id"],
            ["payment_orders.id"],
            name=op.f("fk_wallet_ledger_payment_order_id_payment_orders"),
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("fk_wallet_ledger_tenant_id_tenants"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_wallet_ledger")),
    )
    op.create_index(op.f("ix_wallet_ledger_direction"), "wallet_ledger", ["direction"], unique=False)
    op.create_index(op.f("ix_wallet_ledger_entry_type"), "wallet_ledger", ["entry_type"], unique=False)
    op.create_index(op.f("ix_wallet_ledger_payment_order_id"), "wallet_ledger", ["payment_order_id"], unique=False)
    op.create_index(op.f("ix_wallet_ledger_tenant_id"), "wallet_ledger", ["tenant_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_wallet_ledger_tenant_id"), table_name="wallet_ledger")
    op.drop_index(op.f("ix_wallet_ledger_payment_order_id"), table_name="wallet_ledger")
    op.drop_index(op.f("ix_wallet_ledger_entry_type"), table_name="wallet_ledger")
    op.drop_index(op.f("ix_wallet_ledger_direction"), table_name="wallet_ledger")
    op.drop_table("wallet_ledger")

    op.drop_index(op.f("ix_support_tickets_tenant_id"), table_name="support_tickets")
    op.drop_index(op.f("ix_support_tickets_status"), table_name="support_tickets")
    op.drop_index(op.f("ix_support_tickets_priority"), table_name="support_tickets")
    op.drop_table("support_tickets")

    op.drop_index(op.f("ix_payment_orders_tenant_id"), table_name="payment_orders")
    op.drop_index(op.f("ix_payment_orders_status"), table_name="payment_orders")
    op.drop_table("payment_orders")
