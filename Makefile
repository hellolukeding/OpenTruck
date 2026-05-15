.PHONY: check

check:
	test -f docker-compose.yml
	test -f backend/pyproject.toml
	test -f backend/alembic.ini
	test -f backend/alembic/env.py
	test -f backend/app/main.py
	test -f backend/app/db/base.py
	test -f backend/app/db/session.py
	test -f backend/.env.example
	test -f frontend/package.json
	test -f docs/OPENTRUCK_MVP_BLUEPRINT.md
	python3 -m py_compile \
		backend/app/main.py \
		backend/app/api/deps.py \
		backend/app/api/utils.py \
		backend/app/api/routes/health.py \
		backend/app/api/routes/gateway.py \
		backend/app/api/routes/models.py \
		backend/app/api/routes/admin_dashboard.py \
		backend/app/api/routes/admin_payment_channels.py \
		backend/app/api/routes/admin_payment_plans.py \
		backend/app/api/routes/admin_tenants.py \
		backend/app/api/routes/admin_nodes.py \
		backend/app/api/routes/admin_api_keys.py \
		backend/app/api/routes/admin_node_models.py \
		backend/app/api/routes/admin_logs.py \
		backend/app/api/routes/admin_openai_oauth.py \
		backend/app/api/routes/admin_tickets.py \
		backend/app/api/routes/admin_upstream_accounts.py \
		backend/app/api/routes/admin_wallet.py \
		backend/app/core/errors.py \
		backend/app/core/settings.py \
		backend/app/db/base.py \
		backend/app/db/session.py \
		backend/app/models/common.py \
		backend/app/models/tenant.py \
		backend/app/models/api_key.py \
		backend/app/models/gateway_usage_ledger.py \
		backend/app/models/node.py \
		backend/app/models/node_model.py \
		backend/app/models/oauth_session.py \
		backend/app/models/payment_channel.py \
		backend/app/models/payment_order.py \
		backend/app/models/payment_plan.py \
		backend/app/models/support_ticket.py \
		backend/app/models/upstream_account.py \
		backend/app/models/wallet_ledger.py \
		backend/app/services/gateway.py \
		backend/app/services/openai_compat.py \
		backend/app/services/openai_oauth.py \
		backend/app/services/security.py \
		backend/app/schemas/dashboard.py \
		backend/app/schemas/logs.py \
		backend/app/schemas/payment_catalog.py \
		backend/app/schemas/tenant.py \
		backend/app/schemas/node.py \
		backend/app/schemas/api_key.py \
		backend/app/schemas/node_model.py \
		backend/app/schemas/common.py \
		backend/app/schemas/jwt.py \
		backend/app/schemas/openai_oauth.py \
		backend/app/schemas/pagination.py \
		backend/app/schemas/error.py \
		backend/app/schemas/support_ticket.py \
		backend/app/schemas/upstream_account.py \
		backend/app/schemas/wallet.py \
		backend/alembic/env.py \
		backend/alembic/versions/20260511_0001_initial_schema.py \
		backend/alembic/versions/20260512_0002_oauth_upstream_accounts.py \
		backend/alembic/versions/20260512_0003_upstream_account_scheduling.py \
		backend/alembic/versions/20260512_0004_gateway_usage_ledger.py \
		backend/alembic/versions/20260515_0005_wallet_and_support.py \
		backend/alembic/versions/20260515_0006_wallet_catalog.py
