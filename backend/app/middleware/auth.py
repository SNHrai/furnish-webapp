import httpx
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging
from typing import Optional
import json

logger = logging.getLogger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Authentication middleware that validates JWT tokens with Spring Boot Auth Service
    """
    
    def __init__(self, app):
        super().__init__(app)
        self.auth_service_url = "http://localhost:8082"
        self.excluded_paths = {
            "/api/health",
            "/api/docs", 
            "/api/redoc",
            "/openapi.json"
        }
    
    async def dispatch(self, request: Request, call_next):
        # Skip authentication for excluded paths
        if request.url.path in self.excluded_paths:
            return await call_next(request)
        
        # Skip authentication for OPTIONS requests (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)
            
        # Extract token from Authorization header
        authorization = request.headers.get("Authorization")
        if not authorization or not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Authorization header required", "error": "missing_token"}
            )
        
        token = authorization.split(" ")[1]
        
        # Validate token with Auth Service
        user_data = await self.validate_token(token)
        if not user_data:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid or expired token", "error": "invalid_token"}
            )
        
        # Add user data to request state
        request.state.user = user_data
        request.state.token = token
        
        return await call_next(request)
    
    async def validate_token(self, token: str) -> Optional[dict]:
        """
        Validate JWT token with Spring Boot Auth Service
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.post(
                    f"{self.auth_service_url}/api/auth/validate",
                    headers={"Authorization": f"Bearer {token}"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("valid"):
                        # Return user information from JWT claims
                        return {
                            "username": data.get("username"),
                            "email": data.get("email"),
                            "role": data.get("role"),
                            "user_id": data.get("user_id")  # Will be extracted from token
                        }
                
                logger.warning(f"Token validation failed: {response.status_code}")
                return None
                
        except httpx.TimeoutException:
            logger.error("Auth service timeout during token validation")
            return None
        except Exception as e:
            logger.error(f"Error validating token with auth service: {e}")
            return None