# OpenTruck MVP Blueprint

## 1. Project Positioning

OpenTruck is a decentralized AI API gateway.

The MVP should solve one concrete problem well:

- accept OpenAI-compatible client traffic
- route it across multiple upstream nodes
- enforce tenant auth and quotas
- record usage and cost
- give operators a small admin surface

The "decentralized" part in v1 means OpenTruck manages a pool of external nodes instead of one fixed upstream provider. It does not need blockchain, token economics, or peer-to-peer consensus in the first release.

## 2. Chosen Stack

### Frontend

- Next.js 15
- TypeScript
- App Router
- Tailwind CSS

### Backend

- Python 3.12
- FastAPI
- Pydantic v2
- SQLAlchemy 2
- Alembic
- httpx

### Infra

- PostgreSQL
- Redis
- Docker Compose for local database and cache infrastructure

Why this stack:

- Next.js gives us a fast path for an admin console and future public-facing pages
- FastAPI is a strong fit for API gateway control-plane work, typed schemas, and async upstream calls
- PostgreSQL covers control-plane and ledger data well
- Redis is a good fit for rate limiting, health cache, and ephemeral routing state
- keeping database and cache in Docker reduces local environment drift without slowing down app development

## 2.1 Local Development Rule

For local development:

- `frontend/` runs directly on the host with Next.js
- `backend/` runs directly on the host with FastAPI
- `PostgreSQL` runs in Docker
- `Redis` runs in Docker

## 3. Product Boundaries

### MVP must support

- `GET /v1/models`
- `POST /v1/chat/completions`
- `POST /v1/responses`
- API key auth
- tenant-level quota and rate limits
- upstream node registry
- public-model to node-model mapping
- request logs
- usage ledger
- operator admin APIs

### MVP can delay

- payments
- settlement and revenue sharing
- public self-serve signup
- public node marketplace
- advanced provider-specific protocol features
- multi-region control plane

## 4. Architecture

OpenTruck should be split conceptually into two planes.

### Control Plane

Responsible for:

- tenants
- API keys
- node registry
- model registry
- routing policies
- admin APIs
- logs and ledger views

### Data Plane

Responsible for:

- auth
- request validation
- routing
- upstream proxying
- streaming relay
- usage capture
- normalized error handling

For the MVP, both planes can live in a single backend service, but we should keep the code boundaries clean from day one.

## 5. Core Domain Model

### Tenant

- `id`
- `name`
- `status`
- `quota_balance`
- `rate_limit_rpm`
- `rate_limit_tpm`
- `created_at`

### ApiKey

- `id`
- `tenant_id`
- `name`
- `key_hash`
- `status`
- `scope`
- `last_used_at`
- `created_at`

### Node

- `id`
- `name`
- `base_url`
- `auth_type`
- `auth_config`
- `region`
- `status`
- `health_status`
- `weight`
- `max_concurrency`
- `tags`
- `created_at`

### NodeModel

- `id`
- `node_id`
- `external_model`
- `public_model`
- `input_price`
- `output_price`
- `priority`
- `status`

### RoutingPolicy

- `id`
- `tenant_id`
- `public_model`
- `strategy`
- `filters`
- `fallback_policy`
- `status`

### RequestLog

- `id`
- `tenant_id`
- `api_key_id`
- `public_model`
- `node_id`
- `upstream_model`
- `request_type`
- `status_code`
- `error_code`
- `latency_ms`
- `started_at`
- `finished_at`

### UsageLedger

- `id`
- `request_log_id`
- `tenant_id`
- `node_id`
- `input_tokens`
- `output_tokens`
- `estimated_cost`
- `billable_amount`
- `currency`
- `created_at`

## 6. Routing Strategy For MVP

The first routing strategy should be simple and auditable:

1. authenticate API key
2. resolve tenant and policy
3. find candidate nodes for the requested public model
4. filter by status, health, concurrency, and policy
5. choose a node using weighted round robin
6. proxy request upstream
7. retry once on a retryable failure with a fallback node

Avoid overengineering in v1:

- no auctions
- no node reputation market
- no distributed consensus
- no cross-node settlement engine

## 7. API Surface

### Client-facing APIs

- `GET /v1/models`
- `POST /v1/chat/completions`
- `POST /v1/responses`

### Admin APIs

- `GET /admin/tenants`
- `POST /admin/tenants`
- `GET /admin/api-keys`
- `POST /admin/api-keys`
- `GET /admin/nodes`
- `POST /admin/nodes`
- `PATCH /admin/nodes/:id`
- `GET /admin/routing-policies`
- `POST /admin/routing-policies`
- `GET /admin/request-logs`
- `GET /admin/usage-ledger`

### Internal APIs

- `POST /internal/nodes/:id/heartbeat`
- `POST /internal/nodes/:id/health-report`

## 8. Suggested Repository Structure

```text
OpenTruck/
  docs/
    OPENTRUCK_MVP_BLUEPRINT.md
  backend/
    pyproject.toml
    app/
      main.py
      api/
        routes/
      core/
      db/
      domain/
      models/
      repositories/
      schemas/
      services/
      workers/
    tests/
  frontend/
    package.json
    next.config.ts
    tsconfig.json
    app/
    components/
    lib/
    styles/
    public/
  docker-compose.yml
  Makefile
```

## 9. Request Lifecycle

### Public request flow

1. client sends OpenAI-compatible request
2. backend auth middleware resolves API key and tenant
3. rate limit middleware checks Redis
4. route handler validates request shape
5. routing service chooses a node
6. proxy service forwards request
7. response is streamed or returned normally
8. usage service records tokens, cost, latency, and node choice

### Node lifecycle

1. operator registers a node
2. node gets assigned models
3. health heartbeat updates its routing state
4. only healthy nodes are selected

## 10. MVP Build Order

### Phase 1

- bootstrap FastAPI backend
- bootstrap Next.js frontend
- connect PostgreSQL and Redis
- define initial migrations
- implement `GET /v1/models`

### Phase 2

- implement tenant and API key auth
- implement node registry
- implement public-model to upstream-model mapping
- implement `POST /v1/chat/completions`

### Phase 3

- add streaming relay
- add request logs
- add usage ledger
- add retry and fallback

### Phase 4

- add `POST /v1/responses`
- add admin APIs
- add admin console screens

## 11. What To Borrow From Reference Projects

### Borrow from `sub2api`

- admin-focused product structure
- service/repository separation
- operator workflow
- accounting and quota ideas

### Borrow from `new-api`

- relay organization
- gateway operations mindset
- model compatibility handling

### Borrow from `litellm`

- provider abstraction
- request normalization
- fallback and observability ideas

## 12. Recommended Non-goals

Do not do these in the first release:

- blockchain before gateway basics
- token economics before real traffic
- public node marketplace before operator workflow
- too many protocol shapes before OpenAI compatibility is stable

The fastest path is:

- one clean backend service
- one simple admin frontend
- one reliable OpenAI-compatible API
- one understandable routing model

## 13. Immediate Next Step

After this blueprint, the next implementation step should be:

1. create the `backend/` FastAPI skeleton
2. create the `frontend/` Next.js skeleton
3. add Docker Compose for PostgreSQL and Redis
4. add initial models for `tenants`, `api_keys`, `nodes`, `node_models`
5. wire `GET /v1/models`
6. wire a placeholder `POST /v1/chat/completions`

That is enough to move from research mode into build mode.
