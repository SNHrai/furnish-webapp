import asyncio
import uuid
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv

from emergentintegrations.llm.chat import LlmChat, UserMessage

from app.models.chat import ChatMessage, ChatSession, ChatRequest, ChatResponse, ChatHistory
from app.models.user import UserInDB
from app.db.mongodb import get_database
from app.core.config import settings

load_dotenv()

class ChatService:
    def __init__(self):
        self.db = get_database()
        
    async def create_chat_session(self, user: UserInDB) -> ChatSession:
        """Create a new chat session"""
        session_id = str(uuid.uuid4())
        
        session = ChatSession(
            session_id=session_id,
            user_id=str(user.id),
            title="Interior Design Chat",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            is_active=True,
            context={}
        )
        
        session_dict = session.dict(exclude={"id"})
        result = await self.db.chat_sessions.insert_one(session_dict)
        
        session.id = result.inserted_id
        return session
    
    async def get_chat_session(self, session_id: str, user_id: str) -> Optional[ChatSession]:
        """Get chat session by ID"""
        session = await self.db.chat_sessions.find_one({
            "session_id": session_id,
            "user_id": user_id
        })
        
        if session:
            return ChatSession(**session)
        return None
    
    async def get_user_sessions(self, user_id: str) -> List[ChatSession]:
        """Get all chat sessions for a user"""
        sessions = []
        cursor = self.db.chat_sessions.find({"user_id": user_id}).sort("updated_at", -1)
        
        async for session in cursor:
            sessions.append(ChatSession(**session))
            
        return sessions
    
    async def save_message(self, session_id: str, user_id: str, content: str, message_type: str = "user", metadata: dict = None) -> ChatMessage:
        """Save a chat message"""
        message = ChatMessage(
            session_id=session_id,
            user_id=user_id,
            message_type=message_type,
            content=content,
            timestamp=datetime.utcnow(),
            metadata=metadata or {}
        )
        
        message_dict = message.dict(exclude={"id"})
        result = await self.db.chat_messages.insert_one(message_dict)
        
        message.id = result.inserted_id
        
        # Update session timestamp
        await self.db.chat_sessions.update_one(
            {"session_id": session_id},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        
        return message
    
    async def get_chat_history(self, session_id: str, user_id: str, limit: int = 50) -> ChatHistory:
        """Get chat history for a session"""
        messages = []
        cursor = self.db.chat_messages.find({
            "session_id": session_id,
            "user_id": user_id
        }).sort("timestamp", 1).limit(limit)
        
        async for message in cursor:
            messages.append(ChatMessage(**message))
        
        total_count = await self.db.chat_messages.count_documents({
            "session_id": session_id,
            "user_id": user_id
        })
        
        return ChatHistory(
            session_id=session_id,
            messages=messages,
            total_messages=total_count
        )
    
    async def generate_ai_response(self, user_message: str, session_id: str, user: UserInDB) -> str:
        """Generate AI response using Emergent LLM"""
        try:
            # Create system message for interior design context
            system_message = """You are an expert AI interior design assistant for 'Elegant Home' - a luxury interior design platform. Your role is to:

1. Help users with interior design questions, style recommendations, and space planning
2. Provide accurate pricing estimates based on the user's requirements
3. Guide users through the design process with professional expertise
4. Suggest furniture, materials, colors, and layouts
5. Answer questions about design trends, maintenance, and home improvement

Key Guidelines:
- Be professional, knowledgeable, and friendly
- Provide specific, actionable advice
- When discussing pricing, use Indian Rupees (₹) and refer to the platform's calculator
- Suggest using the price calculator for detailed estimates
- Encourage users to book consultations for complex projects
- Focus on luxury and premium design solutions
- Consider Indian architectural principles and cultural preferences when relevant

User Context: This user is actively using our interior design platform and may have pricing or design questions."""

            # Initialize chat with Emergent LLM
            chat = LlmChat(
                api_key=settings.EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4o-mini")
            
            # Create user message
            user_msg = UserMessage(text=user_message)
            
            # Get AI response
            response = await chat.send_message(user_msg)
            
            return response.strip()
            
        except Exception as e:
            print(f"Error generating AI response: {e}")
            return "I apologize, I'm experiencing technical difficulties. Please try again or contact our support team for assistance with your interior design needs."
    
    async def process_chat_request(self, request: ChatRequest, user: UserInDB) -> ChatResponse:
        """Process a chat request and return response"""
        # Get or create session
        if request.session_id:
            session = await self.get_chat_session(request.session_id, str(user.id))
            if not session:
                session = await self.create_chat_session(user)
        else:
            session = await self.create_chat_session(user)
        
        # Save user message
        await self.save_message(
            session_id=session.session_id,
            user_id=str(user.id),
            content=request.message,
            message_type="user"
        )
        
        # Generate AI response
        ai_response = await self.generate_ai_response(
            user_message=request.message,
            session_id=session.session_id,
            user=user
        )
        
        # Save AI message
        await self.save_message(
            session_id=session.session_id,
            user_id=str(user.id),
            content=ai_response,
            message_type="assistant"
        )
        
        # Generate quick action suggestions based on response
        suggestions = self._generate_suggestions(request.message, ai_response)
        
        return ChatResponse(
            message=ai_response,
            session_id=session.session_id,
            message_type="assistant",
            timestamp=datetime.utcnow(),
            suggestions=suggestions
        )
    
    def _generate_suggestions(self, user_message: str, ai_response: str) -> List[str]:
        """Generate quick action suggestions"""
        suggestions = []
        
        # Common suggestions based on message content
        user_msg_lower = user_message.lower()
        
        if any(word in user_msg_lower for word in ["price", "cost", "budget", "estimate"]):
            suggestions.append("Get Price Quote")
            suggestions.append("Use Calculator")
        
        if any(word in user_msg_lower for word in ["design", "style", "decor", "room"]):
            suggestions.append("View Portfolio")
            suggestions.append("Book Consultation")
        
        if any(word in user_msg_lower for word in ["book", "appointment", "consultation", "meet"]):
            suggestions.append("Schedule Meeting")
        
        # Default suggestions
        if not suggestions:
            suggestions = ["Get Price Quote", "View Portfolio", "Book Consultation"]
        
        return suggestions[:3]  # Limit to 3 suggestions