from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List

from app.models.chat import ChatRequest, ChatResponse, ChatHistory, ChatSession
from app.services.chat_service import ChatService
from app.core.dependencies import get_current_active_user, UserInDB

router = APIRouter()
chat_service = ChatService()

@router.post("/message", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    request: Request,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Send a chat message and get AI response"""
    try:
        response = await chat_service.process_chat_request(chat_request, current_user)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat message: {str(e)}"
        )

@router.get("/sessions", response_model=List[ChatSession])
async def get_chat_sessions(
    request: Request,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get all chat sessions for current user"""
    return await chat_service.get_user_sessions(str(current_user.id))

@router.get("/history/{session_id}", response_model=ChatHistory)
async def get_chat_history(
    session_id: str,
    request: Request,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get chat history for a specific session"""
    # Verify session belongs to current user
    session = await chat_service.get_chat_session(session_id, str(current_user.id))
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    return await chat_service.get_chat_history(session_id, str(current_user.id))

@router.post("/session", response_model=ChatSession)
async def create_chat_session(
    request: Request,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Create a new chat session"""
    return await chat_service.create_chat_session(current_user)

chat_router = router