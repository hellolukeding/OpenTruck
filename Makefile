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
		backend/app/api/routes/models.py \
		backend/app/api/routes/admin_tenants.py \
		backend/app/api/routes/admin_nodes.py \
		backend/app/api/routes/admin_api_keys.py \
		backend/app/api/routes/admin_node_models.py \
		backend/app/core/errors.py \
		backend/app/core/settings.py \
		backend/app/db/base.py \
		backend/app/db/session.py \
		backend/app/models/common.py \
		backend/app/models/tenant.py \
		backend/app/models/api_key.py \
		backend/app/models/node.py \
		backend/app/models/node_model.py \
		backend/app/schemas/tenant.py \
		backend/app/schemas/node.py \
		backend/app/schemas/api_key.py \
		backend/app/schemas/node_model.py \
		backend/app/schemas/common.py \
		backend/app/schemas/pagination.py \
		backend/app/schemas/error.py \
		backend/alembic/env.py \
		backend/alembic/versions/20260511_0001_initial_schema.py
