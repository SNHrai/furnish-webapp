# Furnish WebApp - Comprehensive Project Reference

## 📋 Project Overview

**Project Name**: Furnish WebApp - Luxury Interior Design Platform  
**Description**: AI-powered interior design platform with real-time chat, price calculator, and comprehensive project management  
**Domain**: Interior Design & Home Furnishing Services  

### Tech Stack

**Frontend**: Next.js 14.2.3 with TypeScript, React 18  
**Backend**: FastAPI (Python) with MongoDB  
**Services**: Spring Boot microservices (Email, Quotations)  
**State Management**: Zustand with persistence  
**Styling**: Tailwind CSS with Framer Motion animations  
**Authentication**: JWT tokens with role-based access control  
**Database**: MongoDB (primary), Local Storage (client quotations)  

---

## 🏗️ High-Level Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐
│   Next.js Frontend  │    │   FastAPI Backend   │    │ Spring Boot Services │
│   (Port 3000)       │◄──►│   (Port 8001)       │◄──►│ Email: 8080          │
│                     │    │                     │    │ Quotation: 8081      │
│ - Authentication    │    │ - JWT Auth          │    │                      │
│ - UI Components     │    │ - User Management   │    │ - PDF Generation     │
│ - State Management  │    │ - Chat API          │    │ - Email Services     │
│ - Price Calculator  │    │ - WebSocket         │    │ - Quotation Storage  │
│ - Chat Interface    │    │ - MongoDB           │    │                      │
└─────────────────────┘    └─────────────────────┘    └──────────────────────┘
           │                           │                           │
           ▼                           ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐
│    EmailJS          │    │     MongoDB         │    │   Local Storage      │
│   (Fallback)        │    │   (Users, Chats)    │    │   (Quotations)       │
└─────────────────────┘    └─────────────────────┘    └──────────────────────┘
```

---

## 🎨 Frontend (Next.js/React)

### Directory Structure

```
frontend/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/page.tsx        # Login page
│   │   ├── register/page.tsx     # Registration page
│   │   └── forgot-password/page.tsx # Password reset
│   ├── about/page.tsx            # About us page
│   ├── calculator/page.tsx       # Price calculator
│   ├── chat/page.tsx             # AI chat interface
│   ├── comparison/page.tsx       # Quotation comparison
│   ├── dashboard/page.tsx        # User dashboard
│   ├── services/page.tsx         # Services overview
│   ├── api/                      # API routes
│   │   ├── contact/route.ts      # Contact form handler
│   │   └── health.ts             # Health check endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
│   ├── AppLayout.tsx            # Main app layout wrapper
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Site footer
│   ├── ChatWindow.tsx           # Chat interface component
│   ├── modals/                  # Modal components
│   │   ├── EmailShareModal.tsx  # Share quotation via email
│   │   └── SaveQuotationModal.tsx # Save quotation dialog
│   ├── sections/                # Landing page sections
│   │   ├── HeroSection.tsx      # Hero banner
│   │   ├── ServicesSection.tsx  # Services grid
│   │   ├── PortfolioSection.tsx # Portfolio showcase
│   │   ├── TestimonialsSection.tsx # Customer testimonials
│   │   ├── ContactSection.tsx   # Contact form
│   │   └── PriceCalculatorPreview.tsx # Calculator preview
│   └── ui/                      # Shadcn/ui components
├── lib/                         # Utilities and configuration
│   ├── stores/                  # Zustand stores
│   │   └── auth-store.ts        # Authentication state
│   ├── hooks/                   # Custom React hooks
│   │   └── useAuthGuard.ts      # Authentication guard
│   ├── services/                # Service integrations
│   │   ├── springboot-api.ts    # Spring Boot API client
│   │   ├── email-service.ts     # EmailJS integration
│   │   └── health-check.ts      # Health monitoring
│   ├── config/
│   │   └── env.ts               # Environment configuration
│   ├── types/                   # TypeScript definitions
│   └── utils.js                 # Utility functions
├── middleware.ts                # Route protection middleware
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies
└── tailwind.config.js           # Tailwind CSS config
```

### Key Pages & Components

#### Authentication Pages

| Page | Path | Description | Key Features |
|------|------|-------------|--------------|
| **Login** | `/frontend/app/(auth)/login/page.tsx` | User login interface | Email/password validation, JWT token handling, redirect support |
| **Register** | `/frontend/app/(auth)/register/page.tsx` | User registration | Form validation, role selection, auto-login after registration |
| **Forgot Password** | `/frontend/app/(auth)/forgot-password/page.tsx` | Password reset | Email verification, security questions |

#### Main Application Pages

| Page | Path | Description | Key Features |
|------|------|-------------|--------------|
| **Dashboard** | `/frontend/app/dashboard/page.tsx` | User control panel | Activity overview, quick actions, user stats, role-based navigation |
| **Calculator** | `/frontend/app/calculator/page.tsx` | Price estimation tool | 6-step wizard, real-time pricing, PDF export, Spring Boot integration |
| **Chat** | `/frontend/app/chat/page.tsx` | AI assistant interface | Real-time messaging, WebSocket/REST hybrid, chat history |
| **Landing** | `/frontend/app/page.tsx` | Homepage | Hero section, services overview, portfolio, testimonials |

#### Core Components

| Component | Path | Purpose |
|-----------|------|---------|
| **AppLayout** | `/frontend/components/AppLayout.tsx` | Wrapper with header/footer for authenticated pages |
| **Header** | `/frontend/components/Header.tsx` | Navigation with auth state, role-based menu items |
| **ChatWindow** | `/frontend/components/ChatWindow.tsx` | Reusable chat interface component |
| **EmailShareModal** | `/frontend/components/modals/EmailShareModal.tsx` | Share quotations via email |
| **SaveQuotationModal** | `/frontend/components/modals/SaveQuotationModal.tsx` | Save calculator results with notes |

### Authentication Flow

1. **Route Protection**: `middleware.ts` validates JWT tokens and enforces route access
2. **Auth Guard Hook**: `useAuthGuard.ts` redirects unauthenticated users
3. **State Management**: `auth-store.ts` manages user state with Zustand + persistence
4. **Token Handling**: Stored in both localStorage and HTTP-only cookies

### Routing Structure

```
/ (public)                    # Landing page
├── /login                   # Authentication
├── /register
├── /forgot-password
├── /about                   # Public pages
├── /services
├── /dashboard (protected)   # User dashboard
├── /calculator (protected) # Price calculator
├── /chat (protected)       # AI chat
├── /comparison (protected) # Quote comparison
└── /admin (admin only)     # Admin panel
```

---

## ⚡ Backend (FastAPI)

### Directory Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI application entry point
│   ├── api/                     # API route handlers
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── users.py             # User management
│   │   ├── chat.py              # Chat/messaging API
│   │   └── websocket.py         # WebSocket connections
│   ├── core/                    # Core functionality
│   │   ├── config.py            # App configuration
│   │   ├── security.py          # JWT & password handling
│   │   └── rbac.py              # Role-based access control
│   ├── db/
│   │   └── mongodb.py           # Database connections
│   ├── models/                  # Pydantic models
│   │   ├── user.py              # User data models
│   │   └── chat.py              # Chat message models
│   └── services/                # Business logic
│       ├── auth_service.py      # Authentication logic
│       └── chat_service.py      # Chat processing
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
└── README.md                    # Setup instructions
```

### API Endpoints

#### Authentication APIs

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/api/auth/register` | POST | User registration | `{ email, username, full_name, password, phone?, role? }` | `UserResponse` |
| `/api/auth/login` | POST | User login | `{ email, password }` | `{ access_token, token_type }` |
| `/api/auth/me` | GET | Get current user | Bearer token in header | `UserResponse` |
| `/api/auth/forgot-password` | POST | Password reset | `{ email }` | `{ message }` |

#### User Management

| Endpoint | Method | Purpose | Authentication | Response |
|----------|--------|---------|---------------|----------|
| `/api/users/profile` | GET | Get user profile | Required | User profile data |
| `/api/users/profile` | PUT | Update profile | Required | Updated profile |
| `/api/users/list` | GET | List all users (admin only) | Admin required | User list |

#### Chat & AI

| Endpoint | Method | Purpose | Authentication | Description |
|----------|--------|---------|---------------|-------------|
| `/api/chat/messages` | GET | Get chat history | Required | Retrieve user's chat messages |
| `/api/chat/send` | POST | Send message | Required | Send message to AI assistant |
| `/ws/chat` | WebSocket | Real-time chat | Required | WebSocket connection for live chat |

### Database Models

#### User Model (`app/models/user.py`)

```python
class UserInDB(UserBase):
    id: PyObjectId                 # MongoDB ObjectId
    hashed_password: str           # Bcrypt hashed password
    created_at: datetime           # Account creation timestamp
    updated_at: datetime           # Last update timestamp  
    last_login: Optional[datetime] # Last login timestamp
    role: Literal["customer", "designer", "admin"]
    is_active: bool               # Account status
```

#### Chat Model (`app/models/chat.py`)

```python
class ChatMessage:
    id: str                       # Message unique identifier
    user_id: str                 # Reference to user
    content: str                 # Message content
    role: Literal["user", "assistant"] # Message sender
    timestamp: datetime          # When message was sent
    metadata: Optional[dict]     # Additional message data
```

### Authentication & Authorization

- **JWT Tokens**: HS256 algorithm with configurable secret
- **Password Hashing**: Bcrypt with salt rounds
- **Role-Based Access**: Customer, Designer, Admin roles
- **Token Validation**: Middleware validates all protected routes
- **Session Management**: Tokens include user_id, email, role claims

---

## 🔧 Spring Boot Services

### Email Service (Port 8080)

**Purpose**: Handle email communications and notifications

#### Key Endpoints

| Endpoint | Method | Purpose | Request Body |
|----------|--------|---------|--------------|
| `/api/email/send` | POST | Send general email | `{ to, subject, body, attachments? }` |
| `/api/email/quotation` | POST | Send quotation email | `QuotationRequest` object |
| `/api/email/health` | GET | Service health check | None |

**Features**:
- Template-based email generation
- PDF attachment support
- SMTP configuration
- Delivery tracking

### Quotation Service (Port 8081)

**Purpose**: Generate PDFs and manage quotation data

#### Key Endpoints

| Endpoint | Method | Purpose | Request Body |
|----------|--------|---------|--------------|
| `/api/quotations/generate-pdf` | POST | Create PDF quotation | `QuotationRequest` |
| `/api/quotations/save` | POST | Save quotation to database | `QuotationRequest` |
| `/api/quotations/{id}` | GET | Retrieve specific quotation | None |
| `/api/quotations` | GET | List user quotations | None |
| `/api/quotations/health` | GET | Service health check | None |

**Features**:
- Professional PDF generation
- Database persistence
- Template customization
- Historical tracking

---

## 🔗 Service Integration Details

### Frontend ↔ Backend API

**Authentication**: All API calls include `Authorization: Bearer <token>` header

```typescript
// Example API call from frontend
const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
```

### Backend ↔ Spring Boot Services

**Location**: `/lib/services/springboot-api.ts`

**Integration Pattern**:
```typescript
class SpringBootApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }
}
```

### Service Fallback Strategy

1. **Primary**: Spring Boot services (when available)
2. **Fallback**: EmailJS for email functionality
3. **Graceful Degradation**: Disable features if services unavailable

```typescript
// Automatic service selection
const emailService = isServiceEnabled('springboot') 
  ? springBootEmailService 
  : emailJsService
```

---

## 🗃️ Database Schemas & Models

### MongoDB Collections

#### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  full_name: String,
  phone: String (optional),
  role: "customer" | "designer" | "admin",
  hashed_password: String,
  is_active: Boolean,
  created_at: ISODate,
  updated_at: ISODate,
  last_login: ISODate (optional)
}
```

#### Chat Messages Collection

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: users),
  content: String,
  role: "user" | "assistant",
  timestamp: ISODate,
  metadata: {
    tokens_used: Number,
    model: String,
    context_length: Number
  }
}
```

### Local Storage Schemas

#### Quotations (Frontend Storage)

```typescript
interface SavedQuotation {
  id: string
  name: string
  timestamp: Date
  formData: QuotationFormData
  calculation: QuotationCalculation
  clientInfo: ClientInfo
  status: 'draft' | 'sent' | 'accepted'
  notes?: string
}
```

---

## ⚙️ Configuration & Environment

### Frontend Environment Variables

**File**: `.env.local` (copy from `.env.example`)

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `NEXT_PUBLIC_API_BASE_URL` | FastAPI backend URL | `http://localhost:8001` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `ws://localhost:8001` |
| `NEXT_PUBLIC_EMAIL_SERVICE_URL` | Spring Boot email service | `http://localhost:8080/api/email` |
| `NEXT_PUBLIC_QUOTATION_SERVICE_URL` | Spring Boot quotation service | `http://localhost:8081/api/quotations` |
| `NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES` | Feature flag | `true` |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS configuration | `service_eleganthome` |
| `JWT_SECRET` | Token signing secret | `your-secret-key` |

### Backend Environment Variables

**File**: `backend/.env`

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/furnish_db` |
| `JWT_SECRET` | Token signing secret | `your-secret-key` |
| `CORS_ORIGINS` | Allowed origins | `["http://localhost:3000"]` |

### Configuration Management

**Centralized Config**: `/lib/config/env.ts`
- Environment variable validation
- Service URL management
- Feature flag handling
- Default value provision

---

## 🐛 Known Issues & Enhancement Pointers

### Current Known Issues

1. **WebSocket Fallback**: Chat defaults to REST API instead of WebSocket
2. **PDF Service Dependency**: Calculator requires Spring Boot service for PDF generation
3. **Email Template**: EmailJS templates need customization for professional appearance
4. **Role Validation**: Admin routes need enhanced permission checking

### Planned Enhancements

#### Priority 1 - Critical
- [ ] Implement WebSocket chat with automatic fallback
- [ ] Enhanced error handling for service unavailability
- [ ] PDF generation fallback using client-side libraries

#### Priority 2 - Features
- [ ] Advanced quotation comparison tools
- [ ] Real-time collaboration features
- [ ] Mobile-responsive design improvements
- [ ] Advanced admin analytics dashboard

#### Priority 3 - Performance
- [ ] Image optimization and lazy loading
- [ ] API response caching
- [ ] Database query optimization
- [ ] Bundle size reduction

---

## 🚀 Development Setup & Commands

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+ and pip
- MongoDB 5.0+
- Java 11+ (for Spring Boot services)

### Quick Start

```bash
# Frontend Setup
cd frontend
npm install
cp .env.example .env.local
npm run dev           # http://localhost:3000

# Backend Setup
cd backend
pip install -r requirements.txt
cp .env.example .env
python app/main.py    # http://localhost:8001

# Spring Boot Services (optional)
cd email-service
./mvnw spring-boot:run    # Port 8080

cd quotation-service  
./mvnw spring-boot:run    # Port 8081
```

### Build Commands

```bash
# Frontend Production Build
cd frontend
npm run build
npm run start

# Backend Production
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8001

# Health Checks
curl http://localhost:3000/api/health      # Frontend health
curl http://localhost:8001/api/health      # Backend health
curl http://localhost:8080/api/email/health   # Email service
curl http://localhost:8081/api/quotations/health # Quotation service
```

### Development Best Practices

1. **Code Style**: ESLint + Prettier for frontend, Black for Python
2. **Testing**: Jest for frontend components, Pytest for backend
3. **Git Workflow**: Feature branches with PR reviews
4. **Documentation**: Keep this reference updated with changes
5. **Environment**: Use `.env.example` templates for all environments

---

## 📊 System Health & Monitoring

### Health Check Endpoints

| Service | Endpoint | Purpose |
|---------|----------|---------|
| Frontend | `/api/health` | Next.js application status |
| Backend | `/api/health` | FastAPI + MongoDB status |
| Email Service | `/api/email/health` | Spring Boot email service |
| Quotation Service | `/api/quotations/health` | Spring Boot quotation service |

### Service Health Monitoring

**Location**: `/lib/services/health-check.ts`

**Features**:
- Real-time service status checking
- Performance metric collection
- Automatic failover detection
- Service configuration validation

**Usage**:
```typescript
import { checkSystemHealth } from '@/lib/services/health-check'

const health = await checkSystemHealth()
// Returns: { overall_status, services[], timestamp, environment }
```

---

## 🎯 Feature Implementation Guide

### Adding New Pages

1. **Create Page Component**: `app/new-page/page.tsx`
2. **Update Routing**: Add to `middleware.ts` if protected
3. **Add Navigation**: Update `Header.tsx` menu items
4. **Test Authentication**: Verify route protection works

### Integrating New Services

1. **Update Environment Config**: Add URLs to `env.ts`
2. **Create API Client**: Add service calls to appropriate client
3. **Add Health Checks**: Include in `health-check.ts`
4. **Update Documentation**: Add to this reference file

### Database Schema Changes

1. **Update Pydantic Models**: Modify `app/models/*.py`
2. **Update TypeScript Types**: Mirror changes in frontend types
3. **Migration Script**: Create database migration if needed
4. **Test Integration**: Verify API contracts still work

---

## 📞 Support & Contact

For development questions or issues:

1. **Documentation**: Check this reference file first
2. **Health Checks**: Use `/api/health` endpoints for diagnostics
3. **Logs**: Check browser console and server logs
4. **Configuration**: Verify environment variables are set correctly

**Key Files for Troubleshooting**:
- `middleware.ts` - Route protection issues
- `auth-store.ts` - Authentication problems  
- `health-check.ts` - Service connectivity
- `env.ts` - Configuration problems

---

*Last Updated: September 14, 2025*  
*This reference should be updated whenever significant changes are made to the codebase.*