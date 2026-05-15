from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260515_0007"
down_revision = "20260515_0006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "support_ticket_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("ticket_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("author_type", sa.String(length=32), nullable=False),
        sa.Column("author_name", sa.String(length=128), nullable=True),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("is_internal", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["ticket_id"],
            ["support_tickets.id"],
            name=op.f("fk_support_ticket_messages_ticket_id_support_tickets"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_support_ticket_messages")),
    )
    op.create_index(op.f("ix_support_ticket_messages_author_type"), "support_ticket_messages", ["author_type"], unique=False)
    op.create_index(op.f("ix_support_ticket_messages_ticket_id"), "support_ticket_messages", ["ticket_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_support_ticket_messages_ticket_id"), table_name="support_ticket_messages")
    op.drop_index(op.f("ix_support_ticket_messages_author_type"), table_name="support_ticket_messages")
    op.drop_table("support_ticket_messages")
