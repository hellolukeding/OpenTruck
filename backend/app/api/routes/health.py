from fastapi import APIRouter
from sqlalchemy import text

from app.db.session import engine


router = APIRouter()


@router.get("/healthz")
def healthcheck() -> dict[str, object]:
    db_status = "ok"

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"

    overall_status = "ok" if db_status == "ok" else "degraded"
    return {"status": overall_status, "name": "OpenTruck", "services": {"database": db_status}}
