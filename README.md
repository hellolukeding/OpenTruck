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
