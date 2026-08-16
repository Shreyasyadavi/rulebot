"""FastAPI Application Entrypoint for RuleBot Backend.

Provides:
- GET /api/health: Health check and status ping
- POST /api/chat: Deterministic rule-based conversation endpoint
- Configured CORS middleware for frontend development
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import HealthResponse
from .routes.chat import router as chat_router
from .routes.intents import router as intents_router
from .routes.analytics import router as analytics_router
from .routes.history import router as history_router

app = FastAPI(
    title="RuleBot API",
    description="Deterministic Rule-Based Chatbot Engine with FastAPI Backend",
    version="1.0.0"
)

# Configure CORS for local Vite / frontend development
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Register health check endpoint
@app.get(
    "/api/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Health check endpoint"
)
async def health_check() -> HealthResponse:
    """Returns the operational status of the RuleBot backend service."""
    return HealthResponse(status="ok", service="RuleBot")


# Mount API routes
app.include_router(chat_router, prefix="/api")
app.include_router(intents_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(history_router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
