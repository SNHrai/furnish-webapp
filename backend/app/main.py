from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import os
import httpx
from dotenv import load_dotenv

from app.core.config import settings
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.api.chat import chat_router
from app.api.websocket import websocket_router
from app.middleware.auth import AuthMiddleware

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Services API",
    description="AI-powered interior design chatbot and ML services",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add auth middleware for token validation
app.add_middleware(AuthMiddleware)

# Database events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Health check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "AI Services API",
        "features": ["chat", "websocket", "ml-inference"],
        "auth_service": "delegated"
    }

# Include AI-related routers
app.include_router(chat_router, prefix="/api/ai", tags=["ai-chat"])
app.include_router(websocket_router, prefix="/api", tags=["websocket"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)