from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from typing import Dict, List, Optional
import json
import asyncio
from datetime import datetime
import uuid

from app.services.chat_service import ChatService
from app.models.chat import ChatRequest, ChatResponse
from app.core.dependencies import UserInDB

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        self.user_rooms: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user_id: str):
        await websocket.accept()
        
        if room_id not in self.active_connections:
            self.active_connections[room_id] = {}
        
        self.active_connections[room_id][user_id] = websocket
        self.user_rooms[user_id] = room_id
        
        print(f"User {user_id} connected to room {room_id}")

    def disconnect(self, user_id: str):
        room_id = self.user_rooms.get(user_id)
        if room_id and room_id in self.active_connections:
            if user_id in self.active_connections[room_id]:
                del self.active_connections[room_id][user_id]
                
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
        
        if user_id in self.user_rooms:
            del self.user_rooms[user_id]
            
        print(f"User {user_id} disconnected from room {room_id}")

    async def send_personal_message(self, message: dict, user_id: str):
        room_id = self.user_rooms.get(user_id)
        if room_id and room_id in self.active_connections:
            if user_id in self.active_connections[room_id]:
                websocket = self.active_connections[room_id][user_id]
                try:
                    await websocket.send_text(json.dumps(message))
                except Exception as e:
                    print(f"Error sending message to {user_id}: {e}")
                    self.disconnect(user_id)

    async def broadcast_to_room(self, message: dict, room_id: str, exclude_user: Optional[str] = None):
        if room_id in self.active_connections:
            disconnected_users = []
            
            for user_id, websocket in self.active_connections[room_id].items():
                if exclude_user and user_id == exclude_user:
                    continue
                    
                try:
                    await websocket.send_text(json.dumps(message))
                except Exception as e:
                    print(f"Error broadcasting to {user_id}: {e}")
                    disconnected_users.append(user_id)
            
            # Clean up disconnected users
            for user_id in disconnected_users:
                self.disconnect(user_id)

manager = ConnectionManager()
chat_service = ChatService()

# Note: WebSocket authentication is simplified for now
# In production, implement proper token validation via query params or headers

@router.websocket("/ws/chat/{room_id}")
async def websocket_chat_endpoint(websocket: WebSocket, room_id: str):
    # For now, create a mock user. In production, implement proper auth
    user_data = {
        'user_id': f"user_{room_id}",
        'username': f"user_{room_id}",
        'email': f"user_{room_id}@example.com",
        'role': 'customer'
    }
    user = UserInDB(user_data)
    user_id = str(user.id)
    
    # Connect user to room
    await manager.connect(websocket, room_id, user_id)
    
    try:
        # Send welcome message
        welcome_message = {
            "type": "message",
            "data": {
                "id": str(uuid.uuid4()),
                "content": f"Welcome to the chat, {user.username}! I'm your AI design assistant. How can I help you today?",
                "message_type": "assistant",
                "timestamp": datetime.utcnow().isoformat(),
                "metadata": {
                    "suggestions": ["Get Price Quote", "Book Consultation", "View Portfolio", "Upload Room Photo"]
                }
            }
        }
        await manager.send_personal_message(welcome_message, user_id)
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            try:
                message_data = json.loads(data)
                message_type = message_data.get("type")
                payload = message_data.get("data", {})
                
                if message_type == "message":
                    # Handle chat message
                    content = payload.get("content", "").strip()
                    if not content:
                        continue
                    
                    # Save user message
                    user_message = await chat_service.save_message(
                        session_id=room_id,
                        user_id=user_id,
                        content=content,
                        message_type="user"
                    )
                    
                    # Create chat request for AI
                    chat_request = ChatRequest(
                        message=content,
                        session_id=room_id
                    )
                    
                    # Get AI response
                    ai_response = await chat_service.process_chat_request(chat_request, user)
                    
                    # Send AI response back to user
                    response_message = {
                        "type": "message",
                        "data": {
                            "id": str(uuid.uuid4()),
                            "content": ai_response.message,
                            "message_type": "assistant",
                            "timestamp": ai_response.timestamp.isoformat(),
                            "metadata": {
                                "suggestions": ai_response.suggestions
                            }
                        }
                    }
                    await manager.send_personal_message(response_message, user_id)
                
                elif message_type == "typing":
                    # Broadcast typing indicator to room
                    typing_message = {
                        "type": "typing",
                        "data": {
                            "user_id": user_id,
                            "user_name": user.username
                        }
                    }
                    await manager.broadcast_to_room(typing_message, room_id, exclude_user=user_id)
                
                elif message_type == "stop_typing":
                    # Broadcast stop typing indicator to room
                    stop_typing_message = {
                        "type": "stop_typing",
                        "data": {
                            "user_id": user_id,
                            "user_name": user.username
                        }
                    }
                    await manager.broadcast_to_room(stop_typing_message, room_id, exclude_user=user_id)
                
                elif message_type == "user_join":
                    # User joined notification
                    join_message = {
                        "type": "user_joined",
                        "data": {
                            "user_id": user_id,
                            "user_name": user.username,
                            "timestamp": datetime.utcnow().isoformat()
                        }
                    }
                    await manager.broadcast_to_room(join_message, room_id, exclude_user=user_id)
                
                else:
                    # Unknown message type
                    error_message = {
                        "type": "error",
                        "data": {
                            "message": f"Unknown message type: {message_type}"
                        }
                    }
                    await manager.send_personal_message(error_message, user_id)
                    
            except json.JSONDecodeError:
                error_message = {
                    "type": "error",
                    "data": {
                        "message": "Invalid JSON format"
                    }
                }
                await manager.send_personal_message(error_message, user_id)
                
            except Exception as e:
                error_message = {
                    "type": "error",
                    "data": {
                        "message": f"Error processing message: {str(e)}"
                    }
                }
                await manager.send_personal_message(error_message, user_id)
                print(f"Error processing message from {user_id}: {e}")
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        
        # Notify other users in room
        disconnect_message = {
            "type": "user_left",
            "data": {
                "user_id": user_id,
                "user_name": user.username,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        await manager.broadcast_to_room(disconnect_message, room_id)
        
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
        manager.disconnect(user_id)

websocket_router = router
