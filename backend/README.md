# OpenTruck Backend

FastAPI service for:

- OpenAI-compatible public APIs
- node routing
- tenant auth and quota logic
- admin APIs

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

## Planned Database Commands

```bash
cd backend && poetry run alembic upgrade head
cd backend && poetry run alembic revision -m "describe change"
```
