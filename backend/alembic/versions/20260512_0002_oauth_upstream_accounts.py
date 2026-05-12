from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260512_0002"
down_revision = "20260511_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "oauth_sessions",
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("platform", sa.String(length=32), nullable=False),
        sa.Column("state", sa.String(length=128), nullable=False),
        sa.Column("code_verifier", sa.String(length=255), nullable=False),
        sa.Column("client_id", sa.String(length=128), nullable=False),
        sa.Column("redirect_uri", sa.String(length=512), nullable=False),
        sa.Column("proxy_url", sa.String(length=512), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("fk_oauth_sessions_tenant_id_tenants"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_oauth_sessions")),
        sa.UniqueConstraint("state", name=op.f("uq_oauth_sessions_state")),
    )
    op.create_index(op.f("ix_oauth_sessions_platform"), "oauth_sessions", ["platform"], unique=False)
    op.create_index(op.f("ix_oauth_sessions_tenant_id"), "oauth_sessions", ["tenant_id"], unique=False)

    op.create_table(
        "upstream_accounts",
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("platform", sa.String(length=32), nullable=False),
        sa.Column("account_type", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("provider_account_id", sa.String(length=128), nullable=True),
        sa.Column("provider_user_id", sa.String(length=128), nullable=True),
        sa.Column("organization_id", sa.String(length=128), nullable=True),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("plan_type", sa.String(length=64), nullable=True),
        sa.Column("client_id", sa.String(length=128), nullable=True),
        sa.Column("token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_refreshed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("credentials", sa.JSON(), nullable=False),
        sa.Column("extra", sa.JSON(), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
            name=op.f("fk_upstream_accounts_tenant_id_tenants"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_upstream_accounts")),
        sa.UniqueConstraint(
            "tenant_id",
            "platform",
            "provider_account_id",
            name="uq_upstream_accounts_tenant_platform_account",
        ),
    )
    op.create_index(op.f("ix_upstream_accounts_account_type"), "upstream_accounts", ["account_type"], unique=False)
    op.create_index(op.f("ix_upstream_accounts_email"), "upstream_accounts", ["email"], unique=False)
    op.create_index(op.f("ix_upstream_accounts_plan_type"), "upstream_accounts", ["plan_type"], unique=False)
    op.create_index(op.f("ix_upstream_accounts_platform"), "upstream_accounts", ["platform"], unique=False)
    op.create_index(op.f("ix_upstream_accounts_status"), "upstream_accounts", ["status"], unique=False)
    op.create_index(op.f("ix_upstream_accounts_tenant_id"), "upstream_accounts", ["tenant_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_upstream_accounts_tenant_id"), table_name="upstream_accounts")
    op.drop_index(op.f("ix_upstream_accounts_status"), table_name="upstream_accounts")
    op.drop_index(op.f("ix_upstream_accounts_platform"), table_name="upstream_accounts")
    op.drop_index(op.f("ix_upstream_accounts_plan_type"), table_name="upstream_accounts")
    op.drop_index(op.f("ix_upstream_accounts_email"), table_name="upstream_accounts")
    op.drop_index(op.f("ix_upstream_accounts_account_type"), table_name="upstream_accounts")
    op.drop_table("upstream_accounts")

    op.drop_index(op.f("ix_oauth_sessions_tenant_id"), table_name="oauth_sessions")
    op.drop_index(op.f("ix_oauth_sessions_platform"), table_name="oauth_sessions")
    op.drop_table("oauth_sessions")
