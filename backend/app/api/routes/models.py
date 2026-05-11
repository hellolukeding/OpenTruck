from fastapi import APIRouter


router = APIRouter()


@router.get("/models")
async def list_models() -> dict[str, object]:
    return {
        "object": "list",
        "data": [
            {
                "id": "openai/gpt-4o-mini",
                "object": "model",
                "owned_by": "opentruck",
            }
        ],
    }
