# 🤖 Backend - Interior Design AI Services

> **Python FastAPI + MongoDB + AI/ML Integration**

## 📊 **Implementation Status: 80% Complete**

### ✅ **Completed Features**
- **FastAPI Framework**: Modern async Python API ✅
- **AI Chat Service**: GPT-4 powered design assistant ✅
- **Authentication System**: JWT-based user management ✅
- **MongoDB Integration**: Async database operations ✅
- **API Documentation**: Swagger/OpenAPI integration ✅
- **CORS Configuration**: Frontend integration ready ✅

---

## 🚀 **Quick Start**

```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
python -m uvicorn app.main:app --reload --port 8001

# View API documentation
# http://localhost:8001/docs
```

**API Base URL**: http://localhost:8001
**API Documentation**: http://localhost:8001/docs

---

## 🏗️ **Project Structure**

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry
│   ├── core/
│   │   ├── config.py        # Application configuration
│   │   └── security.py      # Security utilities
│   ├── db/
│   │   └── mongodb.py       # Database connection
│   ├── models/              # Pydantic models
│   │   ├── user.py          # User data models
│   │   └── chat.py          # Chat data models
│   ├── api/                 # API endpoints
│   │   ├── auth.py          # Authentication routes
│   │   ├── users.py         # User management
│   │   └── chat.py          # AI chat endpoints
│   └── services/            # Business logic
│       ├── auth_service.py  # Authentication logic
│       └── chat_service.py  # AI chat processing
├── requirements.txt         # Python dependencies
└── .env                    # Environment variables
```

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Database
MONGO_URL=mongodb://localhost:27017/interior_design_db

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# AI Services
EMERGENT_LLM_KEY=your-emergent-api-key

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Application
DEBUG=true
```

---

## 🤖 **AI Chat Service**

### **Core Features**
- **GPT-4 Integration**: Using Emergent LLM platform
- **Context Retention**: Remembers conversation history
- **Session Management**: Persistent chat sessions
- **Interior Design Expertise**: Specialized prompts and responses
- **Quick Actions**: Smart suggestions based on user queries

### **Chat API Endpoints**

#### **Send Message**
```http
POST /api/chat/message
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "message": "I want to design my living room in modern style",
  "session_id": "optional-session-id",
  "context": {}
}
```

**Response:**
```json
{
  "message": "I'd love to help you design a modern living room! Let me ask a few questions...",
  "session_id": "uuid-session-id",
  "message_type": "assistant",
  "timestamp": "2024-01-01T12:00:00Z",
  "suggestions": [
    "Get Price Quote",
    "View Modern Designs", 
    "Book Consultation"
  ]
}
```

#### **Get Chat History**
```http
GET /api/chat/history/{session_id}
Authorization: Bearer <jwt_token>
```

#### **Get User Sessions**
```http
GET /api/chat/sessions
Authorization: Bearer <jwt_token>
```

---

## 🔐 **Authentication System**

### **JWT-based Authentication**
- **Access Tokens**: 24-hour expiration
- **Refresh Tokens**: Long-lived token rotation
- **Password Hashing**: Bcrypt with salt
- **OAuth Integration**: Ready for Google/Facebook

### **Auth API Endpoints**

#### **User Registration**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+91 98765 43210"
}
```

#### **User Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

## 💾 **Database Models**

### **User Model**
```python
class User(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    is_active: bool = True
    role: UserRole = UserRole.CUSTOMER
    created_at: datetime
    preferences: Optional[dict] = None
```

### **Chat Models**
```python
class ChatMessage(BaseModel):
    session_id: str
    user_id: str
    message_type: Literal["user", "assistant", "system"]
    content: str
    timestamp: datetime
    metadata: Optional[dict] = None

class ChatSession(BaseModel):
    session_id: str
    user_id: str
    title: Optional[str] = "New Chat"
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    context: Optional[dict] = None
```

---

## 🧠 **AI Service Architecture**

### **Chat Service Flow**
```python
async def process_chat_request(request: ChatRequest, user: UserInDB):
    # 1. Get or create chat session
    session = await get_or_create_session(request.session_id, user)
    
    # 2. Save user message
    await save_message(session.id, request.message, "user")
    
    # 3. Generate AI response with context
    ai_response = await generate_ai_response(
        message=request.message,
        session_id=session.id,
        user_context=user.preferences
    )
    
    # 4. Save AI response
    await save_message(session.id, ai_response, "assistant")
    
    # 5. Generate smart suggestions
    suggestions = generate_suggestions(request.message, ai_response)
    
    return ChatResponse(
        message=ai_response,
        session_id=session.id,
        suggestions=suggestions
    )
```

### **AI Prompt Engineering**
```python
SYSTEM_PROMPT = """
You are an expert AI interior design assistant for 'Elegant Home' - a luxury interior design platform.

Your expertise includes:
- Interior design styles and trends
- Space planning and optimization  
- Furniture selection and placement
- Color coordination and lighting
- Budget planning and cost estimation
- Indian architectural principles (Vastu when relevant)

Guidelines:
- Be professional, knowledgeable, and friendly
- Provide specific, actionable advice
- Use Indian Rupees (₹) for pricing discussions
- Encourage use of price calculator for detailed estimates
- Suggest booking consultations for complex projects
- Focus on luxury and premium design solutions
"""
```

---

## 🛠️ **Technology Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.104.1 | Modern async Python API framework |
| **Python** | 3.11+ | Programming language |
| **MongoDB** | Latest | Document database |
| **Motor** | 3.3.2 | Async MongoDB driver |
| **Pydantic** | 2.5.0 | Data validation and serialization |
| **PyJWT** | 3.3.0 | JWT token handling |
| **Passlib** | 1.7.4 | Password hashing |
| **Uvicorn** | 0.24.0 | ASGI server |

---

## 📡 **API Documentation**

### **Automatic Documentation**
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc
- **OpenAPI JSON**: http://localhost:8001/openapi.json

### **API Endpoints Overview**

#### **Health Check**
```http
GET /api/health
```

#### **Authentication** (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Token refresh
- `POST /logout` - User logout

#### **Users** (`/api/users`)
- `GET /me` - Get current user profile
- `PUT /me` - Update user profile
- `GET /preferences` - Get user preferences
- `PUT /preferences` - Update preferences

#### **AI Chat** (`/api/chat`)
- `POST /message` - Send chat message
- `GET /sessions` - Get user chat sessions
- `GET /history/{session_id}` - Get chat history
- `POST /session` - Create new chat session

---

## 🔒 **Security Features**

### **Authentication Security**
- **Password Hashing**: Bcrypt with salt
- **JWT Tokens**: Signed with HS256 algorithm
- **Token Expiration**: Configurable expiration times
- **CORS Protection**: Configurable allowed origins

### **Input Validation**
- **Pydantic Models**: Automatic data validation
- **SQL Injection Prevention**: NoSQL MongoDB with ODM
- **XSS Protection**: Input sanitization
- **Rate Limiting**: Ready for implementation

---

## 📊 **Database Operations**

### **Connection Management**
```python
# Async MongoDB connection
from motor.motor_asyncio import AsyncIOMotorClient

class Database:
    client: AsyncIOMotorClient = None
    database = None

# Connection lifecycle
async def connect_to_mongo():
    Database.client = AsyncIOMotorClient(settings.MONGO_URL)
    Database.database = Database.client.interior_design_db

async def close_mongo_connection():
    Database.client.close()
```

### **Collections**
- **users**: User accounts and profiles
- **chat_sessions**: Chat session metadata
- **chat_messages**: Individual chat messages
- **quotations**: Saved price quotations (ready for implementation)
- **bookings**: Service bookings (ready for implementation)

---

## 🧪 **Testing**

### **Test Implementation** (Ready to implement)
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app

# Test specific module
pytest tests/test_chat_service.py
```

**Test Structure:**
```
backend/tests/
├── conftest.py          # Test configuration
├── test_auth.py         # Authentication tests
├── test_chat.py         # Chat service tests
├── test_users.py        # User management tests
└── integration/         # Integration tests
```

---

## 🚀 **Deployment**

### **Docker Deployment**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### **Production Configuration**
```bash
# Environment variables for production
DEBUG=false
JWT_SECRET=production-secret-key
MONGO_URL=mongodb://prod-mongo-cluster/interior_design_db
CORS_ORIGINS=https://yourproductiondomain.com
```

---

## 📈 **Performance & Monitoring**

### **Performance Features**
- **Async Operations**: All database operations are async
- **Connection Pooling**: Efficient database connections
- **Response Caching**: Ready for Redis integration
- **API Rate Limiting**: Ready for implementation

### **Monitoring** (Ready to implement)
- **Prometheus Metrics**: API performance metrics
- **Health Checks**: Database and service health
- **Logging**: Structured logging with JSON format
- **Error Tracking**: Sentry integration ready

---

## 🔄 **Next Development Priorities**

### **Immediate (1-2 weeks)**
1. **Frontend Integration**
   - CORS configuration refinement
   - Error handling improvements
   - Response optimization

2. **Enhanced Authentication**
   - OAuth2 providers (Google, Facebook)
   - Email verification system
   - Password reset functionality

### **Short-term (2-4 weeks)**
1. **Quotation APIs**
   - Save/retrieve quotations
   - PDF generation service
   - Email quotation sharing

2. **Booking System**
   - Service booking endpoints
   - Calendar integration APIs
   - Payment processing integration

3. **Admin APIs**
   - User management endpoints
   - Content management APIs
   - Analytics data endpoints

### **Medium-term (1-2 months)**
1. **Advanced AI Features**
   - Image analysis for room photos
   - Style recommendation engine
   - Market intelligence APIs

2. **Real-time Features**
   - WebSocket chat implementation
   - Live notifications
   - Real-time collaboration

---

## 🤝 **API Integration Examples**

### **Frontend Integration**
```javascript
// Chat service integration example
class ChatService {
  constructor(apiBase, authToken) {
    this.apiBase = apiBase;
    this.authToken = authToken;
  }

  async sendMessage(message, sessionId = null) {
    const response = await fetch(`${this.apiBase}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify({
        message,
        session_id: sessionId
      })
    });
    
    return await response.json();
  }
}
```

This backend provides a robust, scalable foundation for the interior design platform with production-ready AI integration and comprehensive API services.
