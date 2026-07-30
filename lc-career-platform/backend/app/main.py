from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.api.routes.experiences import router as experiences_router
from app.api.routes.skills import router as skills_router
from app.api.routes.network_connections import (
    router as network_connections_router,
)
from app.api.routes.career_tasks import router as career_tasks_router
from app.api.routes.auth import router as auth_router
from app.core.config import settings



app = FastAPI(
    title="L&C Career Platform API",
    description="Backend API for the Lewis & Clark student career platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(experiences_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(network_connections_router, prefix="/api")
app.include_router(career_tasks_router, prefix="/api")
app.include_router(auth_router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "L&C Career Platform API is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}
