from __future__ import annotations

import uuid
from collections.abc import Iterable
from dataclasses import dataclass

import httpx
from fastapi import Response
from sqlalchemy import Select, desc, nullslast, select
from sqlalchemy.orm import Session

from app.core.errors import APIError, bad_request
from app.core.settings import settings
from app.models.upstream_account import UpstreamAccount


CHATGPT_CODEX_RESPONSES_PATH = "/backend-api/codex/responses"
CODEX_FORWARD_USER_AGENT = "codex_cli_rs/0.125.0"
ALLOWED_REQUEST_HEADERS = {
    "accept",
    "accept-language",
    "content-type",
    "conversation_id",
    "openai-beta",
    "originator",
    "session_id",
    "user-agent",
    "x-codex-turn-metadata",
    "x-codex-turn-state",
}
ALLOWED_RESPONSE_HEADERS = {
    "content-type",
    "conversation_id",
    "openai-processing-ms",
    "x-codex-turn-metadata",
    "x-codex-turn-state",
    "x-request-id",
}


@dataclass(slots=True)
class TenantGatewayIdentity:
    tenant_id: uuid.UUID
    api_key_id: uuid.UUID


class GatewayService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def select_openai_oauth_account(self, tenant_id: uuid.UUID) -> UpstreamAccount:
        statement: Select[tuple[UpstreamAccount]] = (
            select(UpstreamAccount)
            .where(
                UpstreamAccount.tenant_id == tenant_id,
                UpstreamAccount.platform == "openai",
                UpstreamAccount.account_type == "oauth",
                UpstreamAccount.status == "active",
            )
            .order_by(
                nullslast(desc(UpstreamAccount.last_refreshed_at)),
                desc(UpstreamAccount.created_at),
            )
        )
        account = self.db.scalar(statement)
        if account is None:
            raise APIError(
                status_code=503,
                code="no_upstream_account_available",
                message="No active OpenAI OAuth upstream account is available for this tenant",
            )
        return account

    def forward_codex_responses(
        self,
        *,
        tenant_id: uuid.UUID,
        request_headers: Iterable[tuple[str, str]],
        body: bytes,
        subpath: str = "",
    ) -> Response:
        account = self.select_openai_oauth_account(tenant_id)
        access_token = (account.credentials or {}).get("access_token")
        if not access_token:
            raise bad_request("missing_access_token", "Selected upstream account does not have an access token")

        upstream_url = self._build_upstream_url(subpath=subpath)
        headers = self._build_request_headers(request_headers=request_headers, access_token=access_token)

        try:
            with httpx.Client(timeout=settings.gateway_upstream_timeout_seconds) as client:
                upstream_response = client.post(
                    upstream_url,
                    content=body,
                    headers=headers,
                )
        except httpx.HTTPError as exc:
            raise APIError(
                status_code=502,
                code="upstream_request_failed",
                message="Failed to reach upstream Codex service",
            ) from exc

        response_headers = self._build_response_headers(upstream_response.headers)
        content_type = upstream_response.headers.get("content-type", "application/json")
        return Response(
            content=upstream_response.content,
            status_code=upstream_response.status_code,
            media_type=content_type.split(";")[0],
            headers=response_headers,
        )

    def _build_upstream_url(self, *, subpath: str) -> str:
        base_url = settings.openai_codex_base_url.rstrip("/")
        normalized_subpath = subpath.strip()
        if normalized_subpath and not normalized_subpath.startswith("/"):
            normalized_subpath = f"/{normalized_subpath}"
        return f"{base_url}{normalized_subpath}"

    def _build_request_headers(self, *, request_headers: Iterable[tuple[str, str]], access_token: str) -> dict[str, str]:
        headers = {
            "authorization": f"Bearer {access_token}",
            "user-agent": CODEX_FORWARD_USER_AGENT,
        }
        for name, value in request_headers:
            lowered = name.lower()
            if lowered not in ALLOWED_REQUEST_HEADERS:
                continue
            if lowered == "user-agent":
                continue
            headers[lowered] = value
        headers.setdefault("content-type", "application/json")
        return headers

    def _build_response_headers(self, upstream_headers: httpx.Headers) -> dict[str, str]:
        headers: dict[str, str] = {}
        for name, value in upstream_headers.items():
            if name.lower() in ALLOWED_RESPONSE_HEADERS:
                headers[name] = value
        return headers
