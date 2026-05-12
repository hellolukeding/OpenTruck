from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_gateway_identity
from app.models.upstream_account import UpstreamAccount
from app.services.gateway import TenantGatewayIdentity


router = APIRouter()


@router.get("/models")
async def list_models(
    identity: TenantGatewayIdentity = Depends(get_gateway_identity),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    accounts = list(
        db.query(UpstreamAccount)
        .filter(
            UpstreamAccount.tenant_id == identity.tenant_id,
            UpstreamAccount.platform == "openai",
            UpstreamAccount.status == "active",
        )
        .all()
    )
    if accounts:
        account_ids = sorted({account.provider_account_id for account in accounts if account.provider_account_id})
    else:
        account_ids = []

    return {
        "object": "list",
        "data": [
            {
                "id": "openai/gpt-4o-mini",
                "object": "model",
                "owned_by": "opentruck",
            },
            {
                "id": "openai/responses",
                "object": "model",
                "owned_by": "opentruck",
                "metadata": {
                    "tenant_id": str(identity.tenant_id),
                    "upstream_accounts": account_ids,
                },
            },
        ],
    }
