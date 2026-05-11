from fastapi import FastAPI

from app.api.routes.admin_api_keys import router as admin_api_keys_router
from app.api.routes.admin_node_models import router as admin_node_models_router
from app.api.routes.admin_nodes import router as admin_nodes_router
from app.api.routes.admin_tenants import router as admin_tenants_router
from app.api.routes.health import router as health_router
from app.api.routes.models import router as models_router


app = FastAPI(title="OpenTruck API", version="0.1.0")
app.include_router(health_router)
app.include_router(models_router, prefix="/v1")
app.include_router(admin_tenants_router, prefix="/admin")
app.include_router(admin_nodes_router, prefix="/admin")
app.include_router(admin_api_keys_router, prefix="/admin")
app.include_router(admin_node_models_router, prefix="/admin")
