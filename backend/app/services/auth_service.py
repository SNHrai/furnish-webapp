from typing import Optional
from datetime import datetime
from app.models.user import UserCreate, UserInDB, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.mongodb import get_database
from fastapi import HTTPException, status
import uuid

class AuthService:
    def __init__(self):
        self.db = get_database()
        
    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """Create a new user"""
        # Check if user already exists
        existing_user = await self.db.users.find_one({
            "$or": [
                {"email": user_data.email},
                {"username": user_data.username}
            ]
        })
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or username already registered"
            )
            
        # Hash password and create user
        hashed_password = get_password_hash(user_data.password)
        
        user_dict = user_data.dict(exclude={"password"})
        user_dict["hashed_password"] = hashed_password
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        
        result = await self.db.users.insert_one(user_dict)
        
        # Fetch and return created user
        created_user = await self.db.users.find_one({"_id": result.inserted_id})
        return self._user_to_response(created_user)
    
    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        """Authenticate user credentials"""
        user = await self.db.users.find_one({"email": email})
        if not user:
            return None
            
        if not verify_password(password, user["hashed_password"]):
            return None
            
        # Update last login
        await self.db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        return UserInDB(**user)
    
    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Get user by email"""
        user = await self.db.users.find_one({"email": email})
        if user:
            return UserInDB(**user)
        return None
    
    async def get_user_by_username(self, username: str) -> Optional[UserInDB]:
        """Get user by username"""
        user = await self.db.users.find_one({"username": username})
        if user:
            return UserInDB(**user)
        return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """Get user by ID"""
        from bson import ObjectId
        try:
            user = await self.db.users.find_one({"_id": ObjectId(user_id)})
            if user:
                return UserInDB(**user)
        except:
            pass
        return None
    
    def create_user_token(self, user: UserInDB) -> str:
        """Create JWT token for user"""
        token_data = {
            "sub": user.username,
            "user_id": str(user.id),
            "email": user.email
        }
        return create_access_token(token_data)
    
    def _user_to_response(self, user_dict: dict) -> UserResponse:
        """Convert user dict to response model"""
        user_dict["id"] = str(user_dict["_id"])
        return UserResponse(**user_dict)