from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260512_0004"
down_revision = "20260512_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "gateway_usage_ledger",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("api_key_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("upstream_account_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("request_kind", sa.String(length=32), nullable=False),
        sa.Column("endpoint", sa.String(length=128), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("model", sa.String(length=128), nullable=True),
        sa.Column("response_id", sa.String(length=128), nullable=True),
        sa.Column("conversation_id", sa.String(length=128), nullable=True),
        sa.Column("upstream_status_code", sa.Integer(), nullable=True),
        sa.Column("error_code", sa.String(length=64), nullable=True),
        sa.Column("input_tokens", sa.Integer(), nullable=False),
        sa.Column("output_tokens", sa.Integer(), nullable=False),
        sa.Column("total_tokens", sa.Integer(), nullable=False),
        sa.Column("quota_delta", sa.Numeric(18, 6), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["api_key_id"],
            ["api_keys.id"],
            name=op.f("fk_gateway_usage_ledger_api_key_id_api_keys"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("fk_gateway_usage_ledger_tenant_id_tenants"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["upstream_account_id"],
            ["upstream_accounts.id"],
            name=op.f("fk_gateway_usage_ledger_upstream_account_id_upstream_accounts"),
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_gateway_usage_ledger")),
    )
    op.create_index(op.f("ix_gateway_usage_ledger_api_key_id"), "gateway_usage_ledger", ["api_key_id"], unique=False)
    op.create_index(op.f("ix_gateway_usage_ledger_conversation_id"), "gateway_usage_ledger", ["conversation_id"], unique=False)
    op.create_index(op.f("ix_gateway_usage_ledger_model"), "gateway_usage_ledger", ["model"], unique=False)
    op.create_index(op.f("ix_gateway_usage_ledger_request_kind"), "gateway_usage_ledger", ["request_kind"], unique=False)
    op.create_index(op.f("ix_gateway_usage_ledger_status"), "gateway_usage_ledger", ["status"], unique=False)
    op.create_index(op.f("ix_gateway_usage_ledger_tenant_id"), "gateway_usage_ledger", ["tenant_id"], unique=False)
    op.create_index(
        op.f("ix_gateway_usage_ledger_upstream_account_id"),
        "gateway_usage_ledger",
        ["upstream_account_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_gateway_usage_ledger_upstream_account_id"), table_name="gateway_usage_ledger")
    op.drop_index(op.f("ix_gateway_usage_ledger_tenant_id"), table_name="gateway_usage_ledger")
    op.drop_index(op.f("ix_gateway_usage_ledger_status"), table_name="gateway_usage_ledger")
    op.drop_index(op.f("ix_gateway_usage_ledger_request_kind"), table_name="gateway_usage_ledger")
    op.drop_index(op.f("ix_gateway_usage_ledger_model"), table_name="gateway_usage_ledger")
    op.drop_index(op.f("ix_gateway_usage_ledger_conversation_id"), table_name="gateway_usage_ledger")
    op.drop_index(op.f("ix_gateway_usage_ledger_api_key_id"), table_name="gateway_usage_ledger")
    op.drop_table("gateway_usage_ledger")
