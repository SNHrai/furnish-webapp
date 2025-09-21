from fastapi import Request, HTTPException, status, Depends
from typing import Dict, Any


def get_current_user(request: Request) -> Dict[str, Any]:
    """
    Dependency to get current authenticated user from request state
    This replaces the old auth dependency that was tied to the auth service
    """
    if not hasattr(request.state, 'user') or not request.state.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )
    
    return request.state.user


def get_current_user_id(request: Request) -> str:
    """
    Dependency to get current user ID
    """
    user = get_current_user(request)
    user_id = user.get('user_id')
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    return user_id


def get_current_token(request: Request) -> str:
    """
    Dependency to get current JWT token
    """
    if not hasattr(request.state, 'token') or not request.state.token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token not found"
        )
    
    return request.state.token


# Mock UserInDB class for compatibility with existing chat service
class UserInDB:
    """
    Mock user class for compatibility with existing chat service
    """
    def __init__(self, user_data: Dict[str, Any]):
        self.id = user_data.get('user_id')
        self.username = user_data.get('username')
        self.email = user_data.get('email')
        self.role = user_data.get('role')
        self.is_active = True  # Assume active if token is valid
    
    def dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active
        }


def get_current_active_user(request: Request) -> UserInDB:
    """
    Dependency to get current active user as UserInDB object
    This maintains compatibility with the existing chat service
    """
    user_data = get_current_user(request)
    return UserInDB(user_data)