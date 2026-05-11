from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.models import router as models_router


app = FastAPI(title="OpenTruck API", version="0.1.0")
app.include_router(health_router)
app.include_router(models_router, prefix="/v1")
