from fastapi import FastAPI
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.routes.admin_announcements import router as admin_announcements_router
from app.api.routes.admin_payment_channels import router as admin_payment_channels_router
from app.api.routes.admin_payment_plans import router as admin_payment_plans_router
from app.api.routes.admin_dashboard import router as admin_dashboard_router
from app.api.routes.admin_api_keys import router as admin_api_keys_router
from app.api.routes.admin_logs import router as admin_logs_router
from app.api.routes.admin_merchant_dashboard import router as admin_merchant_dashboard_router
from app.api.routes.admin_node_models import router as admin_node_models_router
from app.api.routes.admin_nodes import router as admin_nodes_router
from app.api.routes.admin_openai_oauth import router as admin_openai_oauth_router
from app.api.routes.admin_tickets import router as admin_tickets_router
from app.api.routes.admin_tenants import router as admin_tenants_router
from app.api.routes.admin_upstream_accounts import router as admin_upstream_accounts_router
from app.api.routes.admin_wallet import router as admin_wallet_router
from app.api.routes.gateway import router as gateway_router
from app.api.routes.health import router as health_router
from app.api.routes.models import router as models_router
from app.api.routes.public_leaderboard import router as public_leaderboard_router


app = FastAPI(title="OpenTruck API", version="0.1.0")
app.include_router(health_router)
app.include_router(models_router, prefix="/v1")
app.include_router(public_leaderboard_router)
app.include_router(gateway_router)
app.include_router(admin_dashboard_router, prefix="/admin")
app.include_router(admin_merchant_dashboard_router, prefix="/admin")
app.include_router(admin_announcements_router, prefix="/admin")
app.include_router(admin_payment_channels_router, prefix="/admin")
app.include_router(admin_payment_plans_router, prefix="/admin")
app.include_router(admin_tenants_router, prefix="/admin")
app.include_router(admin_nodes_router, prefix="/admin")
app.include_router(admin_api_keys_router, prefix="/admin")
app.include_router(admin_node_models_router, prefix="/admin")
app.include_router(admin_logs_router, prefix="/admin")
app.include_router(admin_openai_oauth_router, prefix="/admin")
app.include_router(admin_tickets_router, prefix="/admin")
app.include_router(admin_upstream_accounts_router, prefix="/admin")
app.include_router(admin_wallet_router, prefix="/admin")


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail
    if isinstance(detail, dict) and "code" in detail and "message" in detail:
        payload = {"error": detail}
    else:
        payload = {
            "error": {
                "code": f"http_{exc.status_code}",
                "message": str(detail),
            }
        }
    return JSONResponse(status_code=exc.status_code, content=payload)


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    first_error = exc.errors()[0] if exc.errors() else None
    if first_error is None:
        message = "Request validation failed"
    else:
        location = ".".join(str(item) for item in first_error.get("loc", []) if item != "body")
        reason = first_error.get("msg", "Invalid value")
        message = f"{location}: {reason}" if location else reason

    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "validation_error",
                "message": message,
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, __: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "internal_error",
                "message": "Internal server error",
            }
        },
    )
