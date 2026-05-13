![](https://i.urusai.cc/gq1sH.png)

# OpenTruck

OpenTruck is a decentralized AI API gateway.

This workspace now uses:

- `frontend/`: Next.js admin and operator UI
- `backend/`: FastAPI gateway and control plane
- `docker-compose.yml`: local PostgreSQL and Redis

See [docs/OPENTRUCK_MVP_BLUEPRINT.md](/Users/lukeding/Desktop/playground/2026/product/OpenTruck/docs/OPENTRUCK_MVP_BLUEPRINT.md) for the current MVP direction.

## Local Development

- run `frontend/` directly with Next.js
- run `backend/` directly with FastAPI and `Poetry`
- run PostgreSQL and Redis with Docker Compose

## Backend Commands

```bash
cd backend
poetry install
poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload --port 8000
```

## Frontend Backend Target

- `frontend/` reads admin data from `BACKEND_BASE_URL`
- default fallback is `http://127.0.0.1:8000`

## OpenAI OAuth Control Plane

- backend now includes a first-pass multi-tenant OpenAI OAuth account flow inspired by `sub2api`
- new admin endpoints:
  - `POST /admin/openai/oauth/auth-url`
  - `POST /admin/openai/oauth/exchange-code`
  - `POST /admin/openai/oauth/create-account`
  - `POST /admin/openai/oauth/refresh-token`
  - `GET/POST/PATCH/DELETE /admin/upstream-accounts`
  - `POST /admin/upstream-accounts/{id}/refresh`
- OAuth sessions and upstream credentials are tenant-scoped so future gateway routing can pick accounts from a tenant-isolated pool
- upstream accounts now include scheduler metadata such as `priority`, `last_used_at`, `consecutive_failures`, and `cooldown_until`

## Gateway API

- tenant-facing gateway authentication accepts either:
  - `Authorization: Bearer <api-key>`
  - `X-API-Key: <api-key>`
  - `Authorization: Bearer <jwt>`
- admin JWT helper:
  - `POST /admin/api-keys/{id}/issue-jwt`
- first-pass supported endpoints:
  - `GET /v1/models`
  - `POST /v1/responses`
  - `POST /responses`
  - `POST /backend-api/codex/responses`
  - `POST /v1/chat/completions`
  - `POST /chat/completions`
- current routing behavior:
  - resolve tenant from the platform API key
  - prefer lower-priority and least-recently-used `openai/oauth` upstream accounts within that tenant
  - keep requests sticky to the same upstream account when `conversation_id` or `session_id` is present
  - apply a first-pass per-account parallel request limit before choosing an upstream
  - automatically disable expired upstream tokens before routing
  - place retryable upstream failures into cooldown and fail over to the next usable account when possible
  - forward the request to `chatgpt.com/backend-api/codex/responses`
- per-account parallel limits:
  - default limit comes from `GATEWAY_UPSTREAM_DEFAULT_MAX_PARALLEL_REQUESTS`
  - override per account with `upstream_account.extra.max_parallel_requests`
- current Chat Completions behavior:
  - non-streaming requests are translated to Responses API shape and translated back on the way out
  - streaming requests are translated to Responses SSE and converted back to Chat Completions SSE
  - current stream support focuses on the main Codex text/tool event flow and will be expanded incrementally

## Frontend Notes

- frontend uses `shadcn/ui`-style component primitives
- frontend supports `en` and `zh-CN`
- root route redirects to `/en`
- admin console now includes overview plus resource routes for:
  - `/{locale}/tenants`
  - `/{locale}/nodes`
  - `/{locale}/api-keys`
  - `/{locale}/models`
  - `/{locale}/upstream-accounts`
- visual direction is monochrome and OpenAI-like rather than decorative SaaS styling
- resource pages now include create forms backed by real FastAPI admin POST endpoints
- `upstream-accounts` now includes a two-step OAuth intake surface:
  - generate an OpenAI OAuth authorization link
  - manually complete account creation with `session_id`, `state`, and callback `code`
- upstream account rows expose scheduler fields such as `priority`, cooldown, last-used time, and refresh / edit / delete actions

## Frontend Auth

- frontend now uses `Auth.js` for OAuth-based sign-in
- landing page login now opens as a closable modal instead of forcing a page navigation
- credentials-based operator sign-in is available alongside OAuth
- protected console routes:
  - `/en`
  - `/zh-CN`
  - and their nested resource pages
- auth endpoints:
  - `GET/POST /api/auth/[...nextauth]`
  - `GET /auth/signin`
- supported provider env vars:
  - `AUTH_SECRET`
  - `AUTH_CREDENTIALS_USERNAME`
  - `AUTH_CREDENTIALS_PASSWORD`
  - `AUTH_CREDENTIALS_NAME`
  - `AUTH_GITHUB_ID`
  - `AUTH_GITHUB_SECRET`
  - `AUTH_GOOGLE_ID`
  - `AUTH_GOOGLE_SECRET`
- local development fallback credentials:
  - account: `admin`
  - password: `opentruck-dev-password`
- the fallback credentials are exposed only for local / private-network previews when explicit operator credentials are not configured
- if no OAuth provider env vars are configured, the sign-in UI still renders and explains what is missing
