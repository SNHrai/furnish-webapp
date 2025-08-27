from fastapi import APIRouter, Depends
from typing import List

from app.models.user import UserInDB, UserResponse, UserUpdate
from app.services.auth_service import AuthService
from app.api.auth import get_current_active_user

router = APIRouter()
auth_service = AuthService()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: UserInDB = Depends(get_current_active_user)):
    """Get current user profile"""
    return auth_service._user_to_response(current_user.dict())

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_data: UserUpdate,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Update current user profile"""
    # Implementation for updating user profile
    # This would involve updating the user in the database
    # For now, return the current user
    return auth_service._user_to_response(current_user.dict())

users_router = router