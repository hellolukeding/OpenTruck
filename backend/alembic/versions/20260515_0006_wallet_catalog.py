from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260515_0006"
down_revision = "20260515_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "payment_plans",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("price_amount", sa.Numeric(18, 6), nullable=False),
        sa.Column("credit_amount", sa.Numeric(18, 6), nullable=False),
        sa.Column("currency", sa.String(length=8), nullable=False),
        sa.Column("quota_units", sa.Integer(), nullable=False),
        sa.Column("badge_text", sa.String(length=64), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_featured", sa.Boolean(), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_payment_plans")),
        sa.UniqueConstraint("name", name=op.f("uq_payment_plans_name")),
    )
    op.create_index(op.f("ix_payment_plans_status"), "payment_plans", ["status"], unique=False)

    op.create_table(
        "payment_channels",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("provider", sa.String(length=32), nullable=False),
        sa.Column("channel_code", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_recommended", sa.Boolean(), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_payment_channels")),
        sa.UniqueConstraint("channel_code", name=op.f("uq_payment_channels_channel_code")),
        sa.UniqueConstraint("name", name=op.f("uq_payment_channels_name")),
    )
    op.create_index(op.f("ix_payment_channels_provider"), "payment_channels", ["provider"], unique=False)
    op.create_index(op.f("ix_payment_channels_status"), "payment_channels", ["status"], unique=False)

    op.execute(
        """
        INSERT INTO payment_plans
            (id, name, status, price_amount, credit_amount, currency, quota_units, badge_text, sort_order, is_featured, description, created_at, updated_at)
        VALUES
            ('f5a33f9a-2a31-45ba-8f95-6688d6b4a001', 'Starter 68', 'active', 68, 68, 'CNY', 1000000, '入门', 10, false, '适合个人开发者的轻量额度', now(), now()),
            ('f5a33f9a-2a31-45ba-8f95-6688d6b4a002', 'Growth 680', 'active', 680, 720, 'CNY', 12000000, '推荐', 20, true, '适合稳定流量与团队共享', now(), now()),
            ('f5a33f9a-2a31-45ba-8f95-6688d6b4a003', 'Scale 3400', 'active', 3400, 3800, 'CNY', 65000000, '企业', 30, false, '适合高并发转发与运营场景', now(), now());
        """
    )
    op.execute(
        """
        INSERT INTO payment_channels
            (id, name, provider, channel_code, status, sort_order, is_recommended, description, created_at, updated_at)
        VALUES
            ('6b8c4b4a-11c0-4b2f-99dc-4c31ba09a001', '支付宝(推荐)', 'alipay', 'alipay_qr', 'active', 10, true, '国内收款响应快，适合日常充值', now(), now()),
            ('6b8c4b4a-11c0-4b2f-99dc-4c31ba09a002', 'Stripe', 'stripe', 'stripe_checkout', 'active', 20, false, '国际银行卡与企业卡支付', now(), now()),
            ('6b8c4b4a-11c0-4b2f-99dc-4c31ba09a003', 'USDT/USDC', 'crypto', 'stablecoin_manual', 'active', 30, false, '适合海外与链上结算场景', now(), now());
        """
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_payment_channels_status"), table_name="payment_channels")
    op.drop_index(op.f("ix_payment_channels_provider"), table_name="payment_channels")
    op.drop_table("payment_channels")
    op.drop_index(op.f("ix_payment_plans_status"), table_name="payment_plans")
    op.drop_table("payment_plans")
