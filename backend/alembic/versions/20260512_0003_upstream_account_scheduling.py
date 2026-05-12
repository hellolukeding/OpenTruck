from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260512_0003"
down_revision = "20260512_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("upstream_accounts", sa.Column("priority", sa.Integer(), nullable=False, server_default="100"))
    op.add_column("upstream_accounts", sa.Column("last_used_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("upstream_accounts", sa.Column("last_error_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("upstream_accounts", sa.Column("last_error_code", sa.String(length=64), nullable=True))
    op.add_column(
        "upstream_accounts",
        sa.Column("consecutive_failures", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column("upstream_accounts", sa.Column("cooldown_until", sa.DateTime(timezone=True), nullable=True))
    op.alter_column("upstream_accounts", "priority", server_default=None)
    op.alter_column("upstream_accounts", "consecutive_failures", server_default=None)
    op.create_index(op.f("ix_upstream_accounts_priority"), "upstream_accounts", ["priority"], unique=False)
    op.create_index(op.f("ix_upstream_accounts_cooldown_until"), "upstream_accounts", ["cooldown_until"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_upstream_accounts_cooldown_until"), table_name="upstream_accounts")
    op.drop_index(op.f("ix_upstream_accounts_priority"), table_name="upstream_accounts")
    op.drop_column("upstream_accounts", "cooldown_until")
    op.drop_column("upstream_accounts", "consecutive_failures")
    op.drop_column("upstream_accounts", "last_error_code")
    op.drop_column("upstream_accounts", "last_error_at")
    op.drop_column("upstream_accounts", "last_used_at")
    op.drop_column("upstream_accounts", "priority")
