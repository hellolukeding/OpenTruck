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
- run `backend/` directly with FastAPI
- run PostgreSQL and Redis with Docker Compose

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

## Gateway API

- tenant-facing gateway authentication accepts either:
  - `Authorization: Bearer <api-key>`
  - `X-API-Key: <api-key>`
- first-pass supported endpoints:
  - `GET /v1/models`
  - `POST /v1/responses`
  - `POST /responses`
  - `POST /backend-api/codex/responses`
  - `POST /v1/chat/completions`
  - `POST /chat/completions`
- current routing behavior:
  - resolve tenant from the platform API key
  - pick one active `openai/oauth` upstream account for that tenant
  - forward the request to `chatgpt.com/backend-api/codex/responses`
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
- visual direction is monochrome and OpenAI-like rather than decorative SaaS styling
- resource pages now include create forms backed by real FastAPI admin POST endpoints
