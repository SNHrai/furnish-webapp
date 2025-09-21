from typing import List
from fastapi import HTTPException, Depends, status
from app.api.auth import get_current_active_user
from app.models.user import UserInDB

class RBACDependency:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: UserInDB = Depends(get_current_active_user)):
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this operation"
            )
        return current_user

# Pre-defined role dependencies
require_admin = RBACDependency(["admin"])
require_designer_or_admin = RBACDependency(["designer", "admin"])
require_customer_or_above = RBACDependency(["customer", "designer", "admin"])

def require_roles(*roles: str):
    """Create a custom RBAC dependency for specific roles"""
    return RBACDependency(list(roles))

def check_user_permissions(current_user: UserInDB, required_roles: List[str]) -> bool:
    """Check if user has required permissions"""
    return current_user.role in required_roles

def check_resource_ownership(current_user: UserInDB, resource_user_id: str) -> bool:
    """Check if user owns the resource or has admin privileges"""
    return (
        str(current_user.id) == resource_user_id or 
        current_user.role == "admin"
    )
