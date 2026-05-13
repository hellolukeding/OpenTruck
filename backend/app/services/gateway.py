from __future__ import annotations

import hashlib
import json
import uuid
from collections.abc import Generator, Iterable
from dataclasses import dataclass
from datetime import timedelta
from decimal import Decimal, ROUND_HALF_UP
from threading import Lock
from typing import Any

import httpx
from fastapi import Response
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import Select, asc, desc, nullsfirst, nullslast, select
from sqlalchemy.orm import Session

from app.core.errors import APIError, bad_request
from app.core.settings import settings
from app.models.common import utc_now
from app.models.gateway_usage_ledger import GatewayUsageLedger
from app.models.tenant import Tenant
from app.models.upstream_account import UpstreamAccount
from app.services.openai_compat import (
    ChatCompletionsStreamState,
    chat_completions_to_responses,
    done_sse_chunk,
    finalize_chat_stream,
    format_chat_chunk_sse,
    responses_event_to_chat_chunks,
    responses_to_chat_completions,
)


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
RESPONSES_TERMINAL_EVENTS = {
    "response.completed",
    "response.done",
    "response.incomplete",
    "response.failed",
    "response.cancelled",
    "response.canceled",
}


@dataclass(slots=True)
class TenantGatewayIdentity:
    tenant_id: uuid.UUID
    api_key_id: uuid.UUID


@dataclass(slots=True)
class UsageAccounting:
    input_tokens: int
    output_tokens: int
    total_tokens: int
    model: str | None = None
    response_id: str | None = None


class GatewayService:
    _account_slot_lock = Lock()
    _account_active_requests: dict[str, int] = {}

    def __init__(self, db: Session) -> None:
        self.db = db

    def list_openai_oauth_accounts(self, tenant_id: uuid.UUID) -> list[UpstreamAccount]:
        statement: Select[tuple[UpstreamAccount]] = (
            select(UpstreamAccount)
            .where(
                UpstreamAccount.tenant_id == tenant_id,
                UpstreamAccount.platform == "openai",
                UpstreamAccount.account_type == "oauth",
                UpstreamAccount.status == "active",
            )
            .order_by(
                asc(UpstreamAccount.priority),
                nullsfirst(asc(UpstreamAccount.last_used_at)),
                nullslast(desc(UpstreamAccount.last_refreshed_at)),
                asc(UpstreamAccount.created_at),
            )
        )
        accounts = list(self.db.scalars(statement))
        if not accounts:
            raise APIError(
                status_code=503,
                code="no_upstream_account_available",
                message="No active OpenAI OAuth upstream account is available for this tenant",
            )
        return self._filter_usable_accounts(accounts)

    def forward_codex_responses(
        self,
        *,
        identity: TenantGatewayIdentity,
        request_headers: Iterable[tuple[str, str]],
        body: bytes,
        request_path: str,
        subpath: str = "",
    ) -> Response:
        request_headers = list(request_headers)
        conversation_id = self._resolve_conversation_id(request_headers)
        try:
            self._ensure_tenant_quota_available(identity.tenant_id)
        except APIError as exc:
            if exc.detail.get("code") == "insufficient_quota":
                self._apply_failed_accounting(
                    identity=identity,
                    request_kind="responses_stream" if self._request_body_is_streaming(body) else "responses",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    error_code="insufficient_quota",
                )
            raise
        upstream_url = self._build_upstream_url(subpath=subpath)
        if self._request_body_is_streaming(body):
            try:
                upstream_response = self._stream_with_failover(
                    tenant_id=identity.tenant_id,
                    request_headers=request_headers,
                    upstream_url=upstream_url,
                    body=body,
                )
            except APIError as exc:
                self._apply_failed_accounting(
                    identity=identity,
                    request_kind="responses_stream",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    upstream_status_code=exc.status_code,
                    error_code=exc.detail.get("code", "upstream_request_failed"),
                )
                raise
            if upstream_response.status_code >= 400:
                body_bytes = upstream_response.read()
                response_headers = self._build_response_headers(upstream_response.headers)
                content_type = upstream_response.headers.get("content-type", "application/json")
                account_id = getattr(upstream_response, "_opentruck_account_id", None)
                self._apply_failed_accounting(
                    identity=identity,
                    request_kind="responses_stream",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    upstream_status_code=upstream_response.status_code,
                    account_id=self._extract_response_account_id(upstream_response),
                    error_code=f"upstream_http_{upstream_response.status_code}",
                    usage=self._extract_usage_from_json_response(upstream_response),
                )
                upstream_response.close()
                if account_id is not None:
                    self._release_account_slot_by_id(account_id)
                return Response(
                    content=body_bytes,
                    status_code=upstream_response.status_code,
                    media_type=content_type.split(";")[0],
                    headers=response_headers,
                )

            response_headers = self._build_response_headers(upstream_response.headers)
            response_headers["content-type"] = "text/event-stream"
            response_headers["cache-control"] = "no-cache"
            return StreamingResponse(
                self._responses_stream_generator(
                    upstream_response=upstream_response,
                    identity=identity,
                    request_path=request_path,
                    conversation_id=self._resolve_conversation_id(request_headers),
                ),
                media_type="text/event-stream",
                headers=response_headers,
            )

        try:
            upstream_response = self._forward_with_failover(
                tenant_id=identity.tenant_id,
                request_headers=request_headers,
                upstream_url=upstream_url,
                body=body,
            )
        except APIError as exc:
            self._apply_failed_accounting(
                identity=identity,
                request_kind="responses",
                request_path=request_path,
                conversation_id=conversation_id,
                upstream_status_code=exc.status_code,
                error_code=exc.detail.get("code", "upstream_request_failed"),
            )
            raise
        usage = self._extract_usage_from_json_response(upstream_response)
        if upstream_response.status_code < 400:
            self._apply_usage_accounting(
                identity=identity,
                request_kind="responses",
                request_path=request_path,
                conversation_id=conversation_id,
                upstream_status_code=upstream_response.status_code,
                account_id=self._extract_response_account_id(upstream_response),
                usage=usage,
            )
        else:
            self._apply_failed_accounting(
                identity=identity,
                request_kind="responses",
                request_path=request_path,
                conversation_id=conversation_id,
                upstream_status_code=upstream_response.status_code,
                account_id=self._extract_response_account_id(upstream_response),
                error_code=f"upstream_http_{upstream_response.status_code}",
                usage=usage,
            )

        response_headers = self._build_response_headers(upstream_response.headers)
        content_type = upstream_response.headers.get("content-type", "application/json")
        return Response(
            content=upstream_response.content,
            status_code=upstream_response.status_code,
            media_type=content_type.split(";")[0],
            headers=response_headers,
        )

    def forward_chat_completions(
        self,
        *,
        identity: TenantGatewayIdentity,
        request_headers: Iterable[tuple[str, str]],
        payload: dict,
        request_path: str,
        subpath: str = "",
    ) -> Response:
        request_headers = list(request_headers)
        conversation_id = self._resolve_conversation_id(request_headers)
        try:
            self._ensure_tenant_quota_available(identity.tenant_id)
        except APIError as exc:
            if exc.detail.get("code") == "insufficient_quota":
                self._apply_failed_accounting(
                    identity=identity,
                    request_kind="chat_completions_stream" if payload.get("stream") else "chat_completions",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    error_code="insufficient_quota",
                )
            raise
        try:
            responses_payload = chat_completions_to_responses(payload)
        except ValueError as exc:
            raise bad_request("invalid_chat_completions_request", str(exc)) from exc

        upstream_url = self._build_upstream_url(subpath=subpath)
        if payload.get("stream"):
            try:
                upstream_response = self._stream_with_failover(
                    tenant_id=identity.tenant_id,
                    request_headers=request_headers,
                    upstream_url=upstream_url,
                    body=json.dumps(responses_payload).encode("utf-8"),
                )
            except APIError as exc:
                self._apply_failed_accounting(
                    identity=identity,
                    request_kind="chat_completions_stream",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    upstream_status_code=exc.status_code,
                    error_code=exc.detail.get("code", "upstream_request_failed"),
                )
                raise
            if upstream_response.status_code >= 400:
                body_bytes = upstream_response.read()
                response_headers = self._build_response_headers(upstream_response.headers)
                content_type = upstream_response.headers.get("content-type", "application/json")
                account_id = getattr(upstream_response, "_opentruck_account_id", None)
                self._apply_failed_accounting(
                    identity=identity,
                    request_kind="chat_completions_stream",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    upstream_status_code=upstream_response.status_code,
                    account_id=self._extract_response_account_id(upstream_response),
                    error_code=f"upstream_http_{upstream_response.status_code}",
                    usage=self._extract_usage_from_json_response(upstream_response),
                )
                upstream_response.close()
                if account_id is not None:
                    self._release_account_slot_by_id(account_id)
                return Response(
                    content=body_bytes,
                    status_code=upstream_response.status_code,
                    media_type=content_type.split(";")[0],
                    headers=response_headers,
                )

            state = ChatCompletionsStreamState(
                model=payload.get("model") or "openai/responses",
                include_usage=bool((payload.get("stream_options") or {}).get("include_usage")),
            )
            response_headers = self._build_response_headers(upstream_response.headers)
            response_headers["content-type"] = "text/event-stream"
            response_headers["cache-control"] = "no-cache"
            return StreamingResponse(
                self._chat_completions_stream_generator(
                    upstream_response=upstream_response,
                    state=state,
                    identity=identity,
                    request_path=request_path,
                    conversation_id=conversation_id,
                ),
                media_type="text/event-stream",
                headers=response_headers,
            )

        try:
            upstream_response = self._forward_with_failover(
                tenant_id=identity.tenant_id,
                request_headers=request_headers,
                upstream_url=upstream_url,
                body=json.dumps(responses_payload).encode("utf-8"),
            )
        except APIError as exc:
            self._apply_failed_accounting(
                identity=identity,
                request_kind="chat_completions",
                request_path=request_path,
                conversation_id=conversation_id,
                upstream_status_code=exc.status_code,
                error_code=exc.detail.get("code", "upstream_request_failed"),
            )
            raise

        if upstream_response.status_code >= 400:
            self._apply_failed_accounting(
                identity=identity,
                request_kind="chat_completions",
                request_path=request_path,
                conversation_id=conversation_id,
                upstream_status_code=upstream_response.status_code,
                account_id=self._extract_response_account_id(upstream_response),
                error_code=f"upstream_http_{upstream_response.status_code}",
                usage=self._extract_usage_from_json_response(upstream_response),
            )
            response_headers = self._build_response_headers(upstream_response.headers)
            content_type = upstream_response.headers.get("content-type", "application/json")
            return Response(
                content=upstream_response.content,
                status_code=upstream_response.status_code,
                media_type=content_type.split(";")[0],
                headers=response_headers,
            )

        try:
            upstream_payload = upstream_response.json()
        except ValueError as exc:
            raise APIError(
                status_code=502,
                code="invalid_upstream_response",
                message="Upstream did not return valid JSON for chat completions conversion",
            ) from exc

        chat_response = responses_to_chat_completions(
            upstream_payload,
            fallback_model=payload.get("model") or "openai/responses",
        )
        self._apply_usage_accounting(
            identity=identity,
            request_kind="chat_completions",
            request_path=request_path,
            conversation_id=conversation_id,
            upstream_status_code=upstream_response.status_code,
            account_id=self._extract_response_account_id(upstream_response),
            usage=self._extract_usage_from_payload(upstream_payload),
        )
        response_headers = self._build_response_headers(upstream_response.headers)
        return JSONResponse(
            content=chat_response,
            status_code=upstream_response.status_code,
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

    def _request_body_is_streaming(self, body: bytes) -> bool:
        try:
            payload = json.loads(body)
        except (TypeError, ValueError):
            return False
        return isinstance(payload, dict) and bool(payload.get("stream"))

    def _ensure_tenant_quota_available(self, tenant_id: uuid.UUID) -> None:
        tenant = self.db.get(Tenant, tenant_id)
        if tenant is None or tenant.status != "active":
            raise APIError(status_code=403, code="tenant_disabled", message="Tenant is disabled")
        if tenant.quota_balance <= Decimal("0"):
            raise APIError(
                status_code=402,
                code="insufficient_quota",
                message="Tenant quota balance is exhausted",
            )

    def _extract_usage_from_json_response(self, response: httpx.Response) -> UsageAccounting | None:
        content_type = response.headers.get("content-type", "")
        if "json" not in content_type.lower():
            return None
        try:
            payload = response.json()
        except ValueError:
            return None
        if not isinstance(payload, dict):
            return None
        return self._extract_usage_from_payload(payload)

    def _extract_usage_from_payload(self, payload: dict[str, Any]) -> UsageAccounting | None:
        usage = payload.get("usage")
        if not isinstance(usage, dict):
            return None
        input_tokens = int(usage.get("input_tokens") or 0)
        output_tokens = int(usage.get("output_tokens") or 0)
        total_tokens = int(usage.get("total_tokens") or (input_tokens + output_tokens))
        return UsageAccounting(
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=total_tokens,
            model=payload.get("model") if isinstance(payload.get("model"), str) else None,
            response_id=payload.get("id") if isinstance(payload.get("id"), str) else None,
        )

    def _extract_usage_from_stream_event(self, event_type: str, payload: dict[str, Any]) -> UsageAccounting | None:
        if event_type not in RESPONSES_TERMINAL_EVENTS:
            return None
        response = payload.get("response")
        if not isinstance(response, dict):
            return None
        return self._extract_usage_from_payload(response)

    def _stream_failure_code_for_terminal_event(self, event_type: str) -> str:
        if event_type == "response.failed":
            return "upstream_terminal_failed"
        if event_type in {"response.cancelled", "response.canceled"}:
            return "upstream_terminal_canceled"
        return "upstream_terminal_incomplete"

    def _build_responses_failure_sse(self, *, error_type: str, message: str) -> bytes:
        payload = {
            "type": "response.failed",
            "error": {
                "type": error_type,
                "message": message,
            },
        }
        return (
            "event: response.failed\n"
            f"data: {json.dumps(payload, separators=(',', ':'))}\n\n"
        ).encode("utf-8")

    def _resolve_conversation_id(self, request_headers: Iterable[tuple[str, str]]) -> str | None:
        header_map = {name.lower(): value for name, value in request_headers}
        value = header_map.get("conversation_id")
        if value and value.strip():
            return value.strip()
        return None

    def _quota_delta_for_usage(self, total_tokens: int) -> Decimal:
        if total_tokens <= 0:
            return Decimal("0")
        return (
            Decimal(total_tokens)
            * Decimal(str(settings.gateway_quota_cost_per_1k_tokens))
            / Decimal("1000")
        ).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)

    def _apply_usage_accounting(
        self,
        *,
        identity: TenantGatewayIdentity,
        request_kind: str,
        request_path: str,
        conversation_id: str | None,
        upstream_status_code: int,
        account_id: uuid.UUID | None,
        usage: UsageAccounting | None,
    ) -> None:
        tenant = self.db.get(Tenant, identity.tenant_id)
        if tenant is None:
            return
        quota_delta = self._quota_delta_for_usage(usage.total_tokens if usage else 0)
        tenant.quota_balance -= quota_delta
        ledger = GatewayUsageLedger(
            tenant_id=identity.tenant_id,
            api_key_id=identity.api_key_id,
            upstream_account_id=account_id,
            request_kind=request_kind,
            endpoint=request_path,
            status="succeeded",
            model=usage.model if usage else None,
            response_id=usage.response_id if usage else None,
            conversation_id=conversation_id,
            upstream_status_code=upstream_status_code,
            input_tokens=usage.input_tokens if usage else 0,
            output_tokens=usage.output_tokens if usage else 0,
            total_tokens=usage.total_tokens if usage else 0,
            quota_delta=quota_delta,
        )
        self.db.add(ledger)
        self.db.commit()

    def _apply_failed_accounting(
        self,
        *,
        identity: TenantGatewayIdentity,
        request_kind: str,
        request_path: str,
        conversation_id: str | None,
        error_code: str,
        upstream_status_code: int | None = None,
        account_id: uuid.UUID | None = None,
        usage: UsageAccounting | None = None,
        status: str = "failed",
    ) -> None:
        tenant = self.db.get(Tenant, identity.tenant_id)
        if tenant is None:
            return
        ledger = GatewayUsageLedger(
            tenant_id=identity.tenant_id,
            api_key_id=identity.api_key_id,
            upstream_account_id=account_id,
            request_kind=request_kind,
            endpoint=request_path,
            status=status,
            model=usage.model if usage else None,
            response_id=usage.response_id if usage else None,
            conversation_id=conversation_id,
            upstream_status_code=upstream_status_code,
            error_code=error_code,
            input_tokens=usage.input_tokens if usage else 0,
            output_tokens=usage.output_tokens if usage else 0,
            total_tokens=usage.total_tokens if usage else 0,
            quota_delta=Decimal("0"),
        )
        self.db.add(ledger)
        self.db.commit()

    def _extract_response_account_id(self, response: httpx.Response) -> uuid.UUID | None:
        raw = getattr(response, "_opentruck_account_id", None)
        if not raw:
            return None
        try:
            return uuid.UUID(str(raw))
        except ValueError:
            return None

    def _filter_usable_accounts(self, accounts: list[UpstreamAccount]) -> list[UpstreamAccount]:
        now = utc_now()
        usable_accounts: list[UpstreamAccount] = []
        changed = False
        for account in accounts:
            if account.token_expires_at and account.token_expires_at <= now:
                self._disable_account(account, code="token_expired")
                changed = True
                continue
            if account.cooldown_until and account.cooldown_until > now:
                continue
            if not (account.credentials or {}).get("access_token"):
                self._record_retryable_failure(account, code="missing_access_token")
                changed = True
                continue
            usable_accounts.append(account)

        if changed:
            self.db.commit()

        if not usable_accounts:
            raise APIError(
                status_code=503,
                code="no_usable_upstream_account",
                message="No usable OpenAI OAuth upstream account is currently available for this tenant",
            )
        return usable_accounts

    def _forward_with_failover(
        self,
        *,
        tenant_id: uuid.UUID,
        request_headers: Iterable[tuple[str, str]],
        upstream_url: str,
        body: bytes,
    ) -> httpx.Response:
        last_error: APIError | None = None
        sticky_key = self._resolve_sticky_key(request_headers)
        saw_concurrency_exhausted = False
        for account in self._order_accounts_for_request(self.list_openai_oauth_accounts(tenant_id), sticky_key=sticky_key):
            if not self._try_acquire_account_slot(account):
                saw_concurrency_exhausted = True
                continue
            headers = self._build_request_headers(
                request_headers=request_headers,
                access_token=(account.credentials or {}).get("access_token", ""),
            )
            try:
                upstream_response = self._post_upstream(upstream_url=upstream_url, headers=headers, body=body)
            except APIError as exc:
                self._release_account_slot(account)
                self._record_retryable_failure(account, code=exc.code)
                self.db.commit()
                last_error = exc
                continue

            if self._is_auth_failure(upstream_response):
                self._release_account_slot(account)
                self._disable_account(account, code="upstream_auth_failed")
                self.db.commit()
                last_error = APIError(
                    status_code=503,
                    code="upstream_auth_failed",
                    message="Selected upstream account is no longer authorized",
                )
                continue

            if self._is_retryable_response(upstream_response):
                self._release_account_slot(account)
                self._record_retryable_failure(account, code=f"upstream_http_{upstream_response.status_code}")
                self.db.commit()
                last_error = APIError(
                    status_code=502,
                    code="upstream_request_failed",
                    message="Failed to complete request with the selected upstream account",
                )
                continue

            self._record_success(account)
            self.db.commit()
            try:
                upstream_response._opentruck_account_id = str(account.id)  # type: ignore[attr-defined]
                return upstream_response
            finally:
                self._release_account_slot(account)

        if saw_concurrency_exhausted and last_error is None:
            raise APIError(
                status_code=503,
                code="upstream_concurrency_exhausted",
                message="All usable upstream accounts are currently at their parallel request limit",
            )
        raise last_error or APIError(
            status_code=503,
            code="no_usable_upstream_account",
            message="No usable OpenAI OAuth upstream account is currently available for this tenant",
        )

    def _stream_with_failover(
        self,
        *,
        tenant_id: uuid.UUID,
        request_headers: Iterable[tuple[str, str]],
        upstream_url: str,
        body: bytes,
    ) -> httpx.Response:
        last_error: APIError | None = None
        sticky_key = self._resolve_sticky_key(request_headers)
        saw_concurrency_exhausted = False
        for account in self._order_accounts_for_request(self.list_openai_oauth_accounts(tenant_id), sticky_key=sticky_key):
            if not self._try_acquire_account_slot(account):
                saw_concurrency_exhausted = True
                continue
            headers = self._build_request_headers(
                request_headers=request_headers,
                access_token=(account.credentials or {}).get("access_token", ""),
            )
            try:
                upstream_response = self._stream_upstream(upstream_url=upstream_url, headers=headers, body=body)
            except APIError as exc:
                self._release_account_slot(account)
                self._record_retryable_failure(account, code=exc.code)
                self.db.commit()
                last_error = exc
                continue

            if self._is_auth_failure(upstream_response):
                self._release_account_slot(account)
                self._disable_account(account, code="upstream_auth_failed")
                self.db.commit()
                upstream_response.close()
                last_error = APIError(
                    status_code=503,
                    code="upstream_auth_failed",
                    message="Selected upstream account is no longer authorized",
                )
                continue

            if self._is_retryable_response(upstream_response):
                self._release_account_slot(account)
                self._record_retryable_failure(account, code=f"upstream_http_{upstream_response.status_code}")
                self.db.commit()
                upstream_response.close()
                last_error = APIError(
                    status_code=502,
                    code="upstream_request_failed",
                    message="Failed to complete request with the selected upstream account",
                )
                continue

            self._record_success(account)
            self.db.commit()
            upstream_response._opentruck_account_id = str(account.id)  # type: ignore[attr-defined]
            return upstream_response

        if saw_concurrency_exhausted and last_error is None:
            raise APIError(
                status_code=503,
                code="upstream_concurrency_exhausted",
                message="All usable upstream accounts are currently at their parallel request limit",
            )
        raise last_error or APIError(
            status_code=503,
            code="no_usable_upstream_account",
            message="No usable OpenAI OAuth upstream account is currently available for this tenant",
        )

    def _post_upstream(self, *, upstream_url: str, headers: dict[str, str], body: bytes) -> httpx.Response:
        try:
            with httpx.Client(timeout=settings.gateway_upstream_timeout_seconds) as client:
                return client.post(
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

    def _stream_upstream(self, *, upstream_url: str, headers: dict[str, str], body: bytes) -> httpx.Response:
        try:
            client = httpx.Client(timeout=settings.gateway_upstream_timeout_seconds)
            response = client.send(
                client.build_request("POST", upstream_url, content=body, headers=headers),
                stream=True,
            )
            response._client = client  # type: ignore[attr-defined]
            return response
        except httpx.HTTPError as exc:
            raise APIError(
                status_code=502,
                code="upstream_request_failed",
                message="Failed to reach upstream Codex service",
            ) from exc

    def _record_success(self, account: UpstreamAccount) -> None:
        account.last_used_at = utc_now()
        account.last_error_at = None
        account.last_error_code = None
        account.consecutive_failures = 0
        account.cooldown_until = None

    def _record_retryable_failure(self, account: UpstreamAccount, *, code: str) -> None:
        now = utc_now()
        account.last_error_at = now
        account.last_error_code = code
        account.consecutive_failures = (account.consecutive_failures or 0) + 1
        if account.consecutive_failures >= settings.gateway_upstream_failure_threshold:
            account.cooldown_until = now + timedelta(seconds=settings.gateway_upstream_cooldown_seconds)

    def _disable_account(self, account: UpstreamAccount, *, code: str) -> None:
        account.status = "disabled"
        account.last_error_at = utc_now()
        account.last_error_code = code
        account.cooldown_until = None

    def _is_auth_failure(self, response: httpx.Response) -> bool:
        return response.status_code in {401, 403}

    def _is_retryable_response(self, response: httpx.Response) -> bool:
        return response.status_code == 429 or response.status_code >= 500

    def _resolve_sticky_key(self, request_headers: Iterable[tuple[str, str]]) -> str | None:
        header_map = {name.lower(): value for name, value in request_headers}
        for key in ("conversation_id", "session_id"):
            value = header_map.get(key)
            if value and value.strip():
                return f"{key}:{value.strip()}"
        return None

    def _order_accounts_for_request(
        self,
        accounts: list[UpstreamAccount],
        *,
        sticky_key: str | None,
    ) -> list[UpstreamAccount]:
        if not sticky_key or len(accounts) <= 1:
            return accounts

        grouped: dict[int, list[UpstreamAccount]] = {}
        for account in accounts:
            grouped.setdefault(account.priority, []).append(account)

        ordered: list[UpstreamAccount] = []
        for priority in sorted(grouped):
            group = grouped[priority]
            if len(group) == 1:
                ordered.extend(group)
                continue
            ordered.extend(
                sorted(
                    group,
                    key=lambda account: (
                        -self._sticky_account_score(sticky_key=sticky_key, account=account),
                        account.created_at,
                    ),
                )
            )
        return ordered

    def _sticky_account_score(self, *, sticky_key: str, account: UpstreamAccount) -> int:
        raw = f"{sticky_key}:{account.id}".encode("utf-8")
        return int.from_bytes(hashlib.sha256(raw).digest()[:8], byteorder="big", signed=False)

    def _account_slot_limit(self, account: UpstreamAccount) -> int:
        value = (account.extra or {}).get("max_parallel_requests")
        if isinstance(value, int) and value > 0:
            return value
        return settings.gateway_upstream_default_max_parallel_requests

    def _try_acquire_account_slot(self, account: UpstreamAccount) -> bool:
        account_id = str(account.id)
        with self._account_slot_lock:
            current = self._account_active_requests.get(account_id, 0)
            if current >= self._account_slot_limit(account):
                return False
            self._account_active_requests[account_id] = current + 1
            return True

    def _release_account_slot(self, account: UpstreamAccount) -> None:
        self._release_account_slot_by_id(str(account.id))

    def _release_account_slot_by_id(self, account_id: str) -> None:
        with self._account_slot_lock:
            current = self._account_active_requests.get(account_id, 0)
            if current <= 1:
                self._account_active_requests.pop(account_id, None)
            else:
                self._account_active_requests[account_id] = current - 1

    def _chat_completions_stream_generator(
        self,
        *,
        upstream_response: httpx.Response,
        state: ChatCompletionsStreamState,
        identity: TenantGatewayIdentity,
        request_path: str,
        conversation_id: str | None,
    ) -> Generator[bytes, None, None]:
        pending_event: str | None = None
        pending_data: list[str] = []
        client = getattr(upstream_response, "_client", None)
        account_id = getattr(upstream_response, "_opentruck_account_id", None)
        saw_terminal_event = False
        try:
            for line in upstream_response.iter_lines():
                if line is None:
                    continue
                if line == "":
                    if pending_event in RESPONSES_TERMINAL_EVENTS:
                        saw_terminal_event = True
                    yield from self._flush_sse_event(
                        pending_event=pending_event,
                        pending_data=pending_data,
                        state=state,
                    )
                    pending_event = None
                    pending_data = []
                    continue
                if line.startswith(":"):
                    continue
                if line.startswith("event:"):
                    pending_event = line.partition(":")[2].strip()
                    continue
                if line.startswith("data:"):
                    pending_data.append(line.partition(":")[2].lstrip())
            if pending_event or pending_data:
                if pending_event in RESPONSES_TERMINAL_EVENTS:
                    saw_terminal_event = True
                yield from self._flush_sse_event(
                    pending_event=pending_event,
                    pending_data=pending_data,
                    state=state,
                )
            if not saw_terminal_event:
                for chunk in responses_event_to_chat_chunks(
                    "response.failed",
                    {
                        "error": {
                            "type": "upstream_disconnected",
                            "message": "Upstream stream disconnected before completion",
                        },
                        "response": {
                            "model": state.model or "openai/responses",
                        },
                    },
                    state=state,
                ):
                    yield format_chat_chunk_sse(chunk)
            elif not state.finalized:
                for chunk in finalize_chat_stream(state=state):
                    yield format_chat_chunk_sse(chunk)
            yield done_sse_chunk()
        finally:
            usage = (
                UsageAccounting(
                    input_tokens=int(state.usage.get("prompt_tokens") or 0),
                    output_tokens=int(state.usage.get("completion_tokens") or 0),
                    total_tokens=int(state.usage.get("total_tokens") or 0),
                    model=state.model or None,
                    response_id=state.id,
                )
                if state.usage
                else None
            )
            if state.terminal_event_type in {"response.completed", "response.done", "response.incomplete"}:
                self._apply_usage_accounting(
                    identity=identity,
                    request_kind="chat_completions_stream",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    upstream_status_code=upstream_response.status_code,
                    account_id=self._extract_response_account_id(upstream_response),
                    usage=usage,
                )
            else:
                self._apply_failed_accounting(
                    identity=identity,
                    request_kind="chat_completions_stream",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    upstream_status_code=upstream_response.status_code,
                    account_id=self._extract_response_account_id(upstream_response),
                    error_code=(
                        "upstream_missing_terminal_event"
                        if not saw_terminal_event
                        else self._stream_failure_code_for_terminal_event(state.terminal_event_type)
                    ),
                    usage=usage,
                    status="incomplete" if not saw_terminal_event else "failed",
                )
            upstream_response.close()
            if client is not None:
                client.close()
            if account_id is not None:
                self._release_account_slot_by_id(account_id)

    def _responses_stream_generator(
        self,
        *,
        upstream_response: httpx.Response,
        identity: TenantGatewayIdentity,
        request_path: str,
        conversation_id: str | None,
    ) -> Generator[bytes, None, None]:
        pending_event: str | None = None
        pending_data: list[str] = []
        usage: UsageAccounting | None = None
        client = getattr(upstream_response, "_client", None)
        account_id = getattr(upstream_response, "_opentruck_account_id", None)
        terminal_event_type: str | None = None
        try:
            for line in upstream_response.iter_lines():
                if line is None:
                    continue
                if line.startswith("event:"):
                    pending_event = line.partition(":")[2].strip()
                elif line.startswith("data:"):
                    pending_data.append(line.partition(":")[2].lstrip())
                elif line == "":
                    if pending_event in RESPONSES_TERMINAL_EVENTS:
                        terminal_event_type = pending_event
                    usage = self._merge_stream_usage(
                        current=usage,
                        event_type=pending_event,
                        pending_data=pending_data,
                    )
                    pending_event = None
                    pending_data = []
                yield f"{line}\n".encode("utf-8")

            if pending_event or pending_data:
                if pending_event in RESPONSES_TERMINAL_EVENTS:
                    terminal_event_type = pending_event
                usage = self._merge_stream_usage(
                    current=usage,
                    event_type=pending_event,
                    pending_data=pending_data,
                )
            if not terminal_event_type:
                yield self._build_responses_failure_sse(
                    error_type="upstream_disconnected",
                    message="Upstream stream disconnected before completion",
                )
                yield done_sse_chunk()
        finally:
            if terminal_event_type in {"response.completed", "response.done", "response.incomplete"}:
                self._apply_usage_accounting(
                    identity=identity,
                    request_kind="responses_stream",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    upstream_status_code=upstream_response.status_code,
                    account_id=self._extract_response_account_id(upstream_response),
                    usage=usage,
                )
            else:
                self._apply_failed_accounting(
                    identity=identity,
                    request_kind="responses_stream",
                    request_path=request_path,
                    conversation_id=conversation_id,
                    upstream_status_code=upstream_response.status_code,
                    account_id=self._extract_response_account_id(upstream_response),
                    error_code=(
                        "upstream_missing_terminal_event"
                        if not terminal_event_type
                        else self._stream_failure_code_for_terminal_event(terminal_event_type)
                    ),
                    usage=usage,
                    status="incomplete" if not terminal_event_type else "failed",
                )
            upstream_response.close()
            if client is not None:
                client.close()
            if account_id is not None:
                self._release_account_slot_by_id(account_id)

    def _merge_stream_usage(
        self,
        *,
        current: UsageAccounting | None,
        event_type: str | None,
        pending_data: list[str],
    ) -> UsageAccounting | None:
        if not pending_data:
            return current
        raw_data = "\n".join(pending_data).strip()
        if not raw_data or raw_data == "[DONE]":
            return current
        try:
            payload = json.loads(raw_data)
        except json.JSONDecodeError:
            return current
        if not isinstance(payload, dict):
            return current
        return self._extract_usage_from_stream_event(event_type or "", payload) or current

    def _flush_sse_event(
        self,
        *,
        pending_event: str | None,
        pending_data: list[str],
        state: ChatCompletionsStreamState,
    ) -> Generator[bytes, None, None]:
        if not pending_data:
            return
        raw_data = "\n".join(pending_data).strip()
        if not raw_data or raw_data == "[DONE]":
            return
        try:
            payload = json.loads(raw_data)
        except json.JSONDecodeError:
            return
        for chunk in responses_event_to_chat_chunks(pending_event or "", payload, state=state):
            yield format_chat_chunk_sse(chunk)
