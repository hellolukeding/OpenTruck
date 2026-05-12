from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import httpx
from sqlalchemy.orm import Session

from app.core.errors import bad_request, internal_error, not_found
from app.models.oauth_session import OAuthSession
from app.models.tenant import Tenant
from app.schemas.openai_oauth import OpenAITokenInfo


OPENAI_OAUTH_CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann"
OPENAI_OAUTH_AUTHORIZE_URL = "https://auth.openai.com/oauth/authorize"
OPENAI_OAUTH_TOKEN_URL = "https://auth.openai.com/oauth/token"
OPENAI_DEFAULT_REDIRECT_URI = "http://localhost:1455/auth/callback"
OPENAI_DEFAULT_SCOPES = "openid profile email offline_access"
OPENAI_REFRESH_SCOPES = "openid profile email"
OPENAI_SESSION_TTL = timedelta(minutes=30)
CODEX_CLI_USER_AGENT = "codex-cli/0.91.0"


@dataclass(slots=True)
class OAuthSessionBundle:
    session: OAuthSession
    auth_url: str


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("utf-8").rstrip("=")


def generate_state() -> str:
    return secrets.token_hex(32)


def generate_code_verifier() -> str:
    return secrets.token_hex(64)


def generate_code_challenge(code_verifier: str) -> str:
    digest = hashlib.sha256(code_verifier.encode("utf-8")).digest()
    return base64url_encode(digest)


def build_authorization_url(*, state: str, code_challenge: str, redirect_uri: str, client_id: str) -> str:
    params = httpx.QueryParams(
        {
            "response_type": "code",
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "scope": OPENAI_DEFAULT_SCOPES,
            "state": state,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
            "id_token_add_organizations": "true",
            "codex_cli_simplified_flow": "true",
        }
    )
    return f"{OPENAI_OAUTH_AUTHORIZE_URL}?{params}"


def decode_jwt_payload(token: str) -> dict:
    parts = token.split(".")
    if len(parts) < 2:
        raise bad_request("invalid_id_token", "Invalid ID token format")
    payload = parts[1]
    payload += "=" * (-len(payload) % 4)
    try:
        raw = base64.urlsafe_b64decode(payload.encode("utf-8"))
        return json.loads(raw.decode("utf-8"))
    except (ValueError, json.JSONDecodeError) as exc:
        raise bad_request("invalid_id_token", "Failed to decode ID token payload") from exc


def parse_user_info(id_token: str | None) -> dict[str, str | None]:
    if not id_token:
        return {
            "email": None,
            "chatgpt_account_id": None,
            "chatgpt_user_id": None,
            "organization_id": None,
            "plan_type": None,
        }

    payload = decode_jwt_payload(id_token)
    openai_auth = payload.get("https://api.openai.com/auth") or {}
    organizations = openai_auth.get("organizations") or []
    primary_org_id = None
    if organizations and isinstance(organizations, list):
        first = organizations[0]
        if isinstance(first, dict):
            primary_org_id = first.get("id")

    return {
        "email": payload.get("email"),
        "chatgpt_account_id": openai_auth.get("chatgpt_account_id"),
        "chatgpt_user_id": openai_auth.get("chatgpt_user_id"),
        "organization_id": openai_auth.get("organization_id") or primary_org_id,
        "plan_type": openai_auth.get("chatgpt_plan_type"),
    }


class OpenAIOAuthService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def generate_auth_url(
        self,
        *,
        tenant_id: uuid.UUID,
        redirect_uri: str | None,
        proxy_url: str | None,
        platform: str,
    ) -> OAuthSessionBundle:
        tenant = self.db.get(Tenant, tenant_id)
        if tenant is None:
            raise not_found("Tenant")

        state = generate_state()
        code_verifier = generate_code_verifier()
        code_challenge = generate_code_challenge(code_verifier)
        resolved_redirect_uri = redirect_uri or OPENAI_DEFAULT_REDIRECT_URI
        expires_at = utc_now() + OPENAI_SESSION_TTL

        session = OAuthSession(
            tenant_id=tenant_id,
            platform=platform,
            state=state,
            code_verifier=code_verifier,
            client_id=OPENAI_OAUTH_CLIENT_ID,
            redirect_uri=resolved_redirect_uri,
            proxy_url=proxy_url,
            expires_at=expires_at,
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)

        auth_url = build_authorization_url(
            state=state,
            code_challenge=code_challenge,
            redirect_uri=resolved_redirect_uri,
            client_id=session.client_id,
        )
        return OAuthSessionBundle(session=session, auth_url=auth_url)

    def exchange_code(
        self,
        *,
        session_id: uuid.UUID,
        code: str,
        state: str,
        tenant_id: uuid.UUID | None = None,
    ) -> OpenAITokenInfo:
        session = self.db.get(OAuthSession, session_id)
        if session is None:
            raise not_found("OAuth session")
        if tenant_id is not None and session.tenant_id != tenant_id:
            raise bad_request("oauth_session_tenant_mismatch", "OAuth session does not belong to the requested tenant")
        if session.consumed_at is not None:
            raise bad_request("oauth_session_consumed", "OAuth session has already been used")
        if session.expires_at <= utc_now():
            raise bad_request("oauth_session_expired", "OAuth session has expired")
        if not hmac.compare_digest(session.state, state):
            raise bad_request("invalid_oauth_state", "Invalid OAuth state")

        token_response = self._exchange_code_with_openai(code=code, session=session)
        user_info = parse_user_info(token_response.get("id_token"))
        expires_in = int(token_response.get("expires_in") or 0)
        expires_at = utc_now() + timedelta(seconds=expires_in)

        session.consumed_at = utc_now()
        self.db.commit()

        return OpenAITokenInfo(
            access_token=token_response["access_token"],
            refresh_token=token_response.get("refresh_token"),
            id_token=token_response.get("id_token"),
            expires_in=expires_in,
            expires_at=expires_at,
            client_id=session.client_id,
            email=user_info["email"],
            chatgpt_account_id=user_info["chatgpt_account_id"],
            chatgpt_user_id=user_info["chatgpt_user_id"],
            organization_id=user_info["organization_id"],
            plan_type=user_info["plan_type"],
        )

    def refresh_token(
        self,
        *,
        refresh_token: str,
        proxy_url: str | None,
        client_id: str | None,
    ) -> OpenAITokenInfo:
        form = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": client_id or OPENAI_OAUTH_CLIENT_ID,
            "scope": OPENAI_REFRESH_SCOPES,
        }
        token_response = self._post_token_form(form=form, proxy_url=proxy_url)
        user_info = parse_user_info(token_response.get("id_token"))
        expires_in = int(token_response.get("expires_in") or 0)
        expires_at = utc_now() + timedelta(seconds=expires_in)
        return OpenAITokenInfo(
            access_token=token_response["access_token"],
            refresh_token=token_response.get("refresh_token") or refresh_token,
            id_token=token_response.get("id_token"),
            expires_in=expires_in,
            expires_at=expires_at,
            client_id=form["client_id"],
            email=user_info["email"],
            chatgpt_account_id=user_info["chatgpt_account_id"],
            chatgpt_user_id=user_info["chatgpt_user_id"],
            organization_id=user_info["organization_id"],
            plan_type=user_info["plan_type"],
        )

    def _exchange_code_with_openai(self, *, code: str, session: OAuthSession) -> dict:
        form = {
            "grant_type": "authorization_code",
            "client_id": session.client_id or OPENAI_OAUTH_CLIENT_ID,
            "code": code,
            "redirect_uri": session.redirect_uri,
            "code_verifier": session.code_verifier,
        }
        return self._post_token_form(form=form, proxy_url=session.proxy_url)

    def _post_token_form(self, *, form: dict[str, str], proxy_url: str | None) -> dict:
        try:
            with httpx.Client(
                proxy=proxy_url,
                timeout=120.0,
                headers={"User-Agent": CODEX_CLI_USER_AGENT},
            ) as client:
                response = client.post(OPENAI_OAUTH_TOKEN_URL, data=form)
                response.raise_for_status()
                payload = response.json()
        except httpx.HTTPStatusError as exc:
            message = exc.response.text or "OpenAI OAuth request failed"
            raise bad_request("openai_oauth_request_failed", message) from exc
        except httpx.HTTPError as exc:
            raise internal_error("Failed to reach OpenAI OAuth endpoint") from exc

        if "access_token" not in payload:
            raise bad_request("openai_oauth_invalid_response", "OpenAI OAuth response did not include an access token")
        return payload
