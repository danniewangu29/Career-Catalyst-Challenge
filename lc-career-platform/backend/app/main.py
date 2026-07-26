from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
import app.models

from app.api.routes.experiences import router as experiences_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="L&C Career Platform API",
    description="Backend API for the Lewis & Clark student career platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(experiences_router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "L&C Career Platform API is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}
