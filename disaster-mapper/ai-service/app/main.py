from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import router
import logging

logging.basicConfig(level=settings.LOG_LEVEL.upper())
logger = logging.getLogger(__name__)

app = FastAPI(title="DisasterMapper AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/ai")

@app.get("/ai/health")
def health_check():
    return {
        "status": "healthy",
        "provider": settings.AI_PROVIDER,
        "version": "disastermapper-v1"
    }

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting DisasterMapper AI Service with provider: {settings.AI_PROVIDER}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
