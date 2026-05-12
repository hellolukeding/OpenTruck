# OpenTruck Backend

FastAPI service for:

- OpenAI-compatible public APIs
- node routing
- tenant auth and quota logic
- admin APIs
- JWT and API key gateway auth

## Run

### 1. Start infrastructure

```bash
docker compose up -d postgres redis
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

### 3. Run backend

```bash
cd backend && poetry install
cd backend && poetry run uvicorn app.main:app --reload --port 8000
```

## Local Services

- FastAPI: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Gateway Auth

- `Authorization: Bearer <api-key>`
- `X-API-Key: <api-key>`
- `Authorization: Bearer <jwt>`

Issue a gateway JWT from an existing API key:

```bash
cd backend && poetry run curl -X POST \
  http://127.0.0.1:8000/admin/api-keys/<api_key_id>/issue-jwt \
  -H 'Content-Type: application/json' \
  -d '{}'
```

JWT settings:

- `JWT_SECRET` should be at least 32 characters for `HS256`
- `JWT_ISSUER` defaults to `opentruck`
- `JWT_AUDIENCE` defaults to `opentruck-gateway`

## Planned Database Commands

```bash
cd backend && poetry run alembic upgrade head
cd backend && poetry run alembic revision -m "describe change"
```
