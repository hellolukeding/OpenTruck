from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_gateway_identity
from app.services.gateway import GatewayService, TenantGatewayIdentity


router = APIRouter(tags=["gateway"])


@router.post("/v1/responses")
@router.post("/v1/responses/{subpath:path}")
@router.post("/responses")
@router.post("/responses/{subpath:path}")
@router.post("/backend-api/codex/responses")
@router.post("/backend-api/codex/responses/{subpath:path}")
async def codex_responses_proxy(
    request: Request,
    subpath: str = "",
    identity: TenantGatewayIdentity = Depends(get_gateway_identity),
    db: Session = Depends(get_db),
):
    body = await request.body()
    service = GatewayService(db)
    return service.forward_codex_responses(
        tenant_id=identity.tenant_id,
        request_headers=request.headers.items(),
        body=body,
        subpath=subpath,
    )
