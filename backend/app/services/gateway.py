from __future__ import annotations

import hashlib
import json
import uuid
from collections.abc import Generator, Iterable
from dataclasses import dataclass
from datetime import timedelta
from threading import Lock

import httpx
from fastapi import Response
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import Select, asc, desc, nullsfirst, nullslast, select
from sqlalchemy.orm import Session

from app.core.errors import APIError, bad_request
from app.core.settings import settings
from app.models.common import utc_now
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


@dataclass(slots=True)
class TenantGatewayIdentity:
    tenant_id: uuid.UUID
    api_key_id: uuid.UUID


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
        tenant_id: uuid.UUID,
        request_headers: Iterable[tuple[str, str]],
        body: bytes,
        subpath: str = "",
    ) -> Response:
        request_headers = list(request_headers)
        upstream_url = self._build_upstream_url(subpath=subpath)
        upstream_response = self._forward_with_failover(
            tenant_id=tenant_id,
            request_headers=request_headers,
            upstream_url=upstream_url,
            body=body,
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
        tenant_id: uuid.UUID,
        request_headers: Iterable[tuple[str, str]],
        payload: dict,
        subpath: str = "",
    ) -> Response:
        request_headers = list(request_headers)
        try:
            responses_payload = chat_completions_to_responses(payload)
        except ValueError as exc:
            raise bad_request("invalid_chat_completions_request", str(exc)) from exc

        upstream_url = self._build_upstream_url(subpath=subpath)
        if payload.get("stream"):
            upstream_response = self._stream_with_failover(
                tenant_id=tenant_id,
                request_headers=request_headers,
                upstream_url=upstream_url,
                body=json.dumps(responses_payload).encode("utf-8"),
            )
            if upstream_response.status_code >= 400:
                body_bytes = upstream_response.read()
                response_headers = self._build_response_headers(upstream_response.headers)
                content_type = upstream_response.headers.get("content-type", "application/json")
                account_id = getattr(upstream_response, "_opentruck_account_id", None)
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
                self._chat_completions_stream_generator(upstream_response=upstream_response, state=state),
                media_type="text/event-stream",
                headers=response_headers,
            )

        upstream_response = self._forward_with_failover(
            tenant_id=tenant_id,
            request_headers=request_headers,
            upstream_url=upstream_url,
            body=json.dumps(responses_payload).encode("utf-8"),
        )

        if upstream_response.status_code >= 400:
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
    ) -> Generator[bytes, None, None]:
        pending_event: str | None = None
        pending_data: list[str] = []
        client = getattr(upstream_response, "_client", None)
        account_id = getattr(upstream_response, "_opentruck_account_id", None)
        try:
            for line in upstream_response.iter_lines():
                if line is None:
                    continue
                if line == "":
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
                yield from self._flush_sse_event(
                    pending_event=pending_event,
                    pending_data=pending_data,
                    state=state,
                )
            if not state.finalized:
                for chunk in finalize_chat_stream(state=state):
                    yield format_chat_chunk_sse(chunk)
            yield done_sse_chunk()
        finally:
            upstream_response.close()
            if client is not None:
                client.close()
            if account_id is not None:
                self._release_account_slot_by_id(account_id)

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
