from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260515_0008"
down_revision = "20260515_0007"
branch_labels = None
depends_on = None


def _seed_rows() -> list[dict[str, object]]:
    now = datetime.now(timezone.utc)
    return [
        {
            "id": uuid.uuid4(),
            "title": "每日商家推荐",
            "body": "猫佬 API Claude Max 特惠渠道已补货，适合稳定对话与高分测试场景。",
            "status": "published",
            "severity": "info",
            "sort_order": 10,
            "is_pinned": True,
            "created_at": now - timedelta(days=6),
            "updated_at": now - timedelta(days=6),
        },
        {
            "id": uuid.uuid4(),
            "title": "Claude 系列补货通知",
            "body": "AKAClaude 已恢复 Claude 系列模型供给，适合高缓存、稳定长会话业务。",
            "status": "published",
            "severity": "success",
            "sort_order": 20,
            "is_pinned": False,
            "created_at": now - timedelta(days=4),
            "updated_at": now - timedelta(days=4),
        },
        {
            "id": uuid.uuid4(),
            "title": "版本更新窗口",
            "body": "今晚会进行一轮短版本更新，预计会有 1 分钟左右短暂卡顿，请提前避开高峰流量。",
            "status": "published",
            "severity": "warning",
            "sort_order": 30,
            "is_pinned": False,
            "created_at": now - timedelta(days=2),
            "updated_at": now - timedelta(days=2),
        },
        {
            "id": uuid.uuid4(),
            "title": "智能路由优化提示",
            "body": "若遇到断流或疑难问题，可优先重建商户 Key 并重新绑定上游账号，平台已持续优化路由稳定性。",
            "status": "published",
            "severity": "info",
            "sort_order": 40,
            "is_pinned": False,
            "created_at": now - timedelta(days=1),
            "updated_at": now - timedelta(days=1),
        },
    ]


def upgrade() -> None:
    announcements = op.create_table(
        "announcements",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("severity", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_pinned", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_announcements")),
    )
    op.create_index(op.f("ix_announcements_status"), "announcements", ["status"], unique=False)
    op.create_index(op.f("ix_announcements_severity"), "announcements", ["severity"], unique=False)
    op.bulk_insert(announcements, _seed_rows())


def downgrade() -> None:
    op.drop_index(op.f("ix_announcements_severity"), table_name="announcements")
    op.drop_index(op.f("ix_announcements_status"), table_name="announcements")
    op.drop_table("announcements")
