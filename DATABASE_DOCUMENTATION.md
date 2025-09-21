# Furnish Web App - Database Architecture Documentation

## Overview

The Furnish Web App uses a **hybrid database architecture** with different database technologies optimized for specific use cases:

- **MongoDB**: For user management, authentication, AI chat functionality, and flexible data storage
- **MySQL**: For quotation management with structured data and ACID compliance

## Database Technologies Used

### 1. MongoDB (Version 7.0.8)
- **Purpose**: User authentication, profiles, AI chat sessions, project templates
- **Database Name**: `furnish_webapp`
- **Connection**: `mongodb://localhost:27017/furnish_webapp`
- **Benefits**: 
  - Flexible schema for user preferences and chat data
  - Excellent for real-time chat applications
  - Easy scaling for user-generated content
  - Native JSON support

### 2. MySQL (Version 8.0+)
- **Purpose**: Quotation management, billing, PDF tracking
- **Database Name**: `furnish_quotations`
- **Connection**: `jdbc:mysql://localhost:3306/furnish_quotations`
- **Credentials**: `root` / `rootuser`
- **Benefits**:
  - ACID compliance for financial data
  - Strong consistency for quotations
  - JSON support for flexible form data
  - Mature ecosystem and tooling

---

## Service-Database Mapping

| Service | Technology | Database | Purpose |
|---------|------------|----------|---------|
| Python Backend (FastAPI) | MongoDB | `furnish_webapp` | User auth, chat, preferences |
| Quotation Service (Spring Boot) | MySQL | `furnish_quotations` | Quotation management |
| Email Service (Spring Boot) | None | N/A | Stateless email sending |

---

## MongoDB Schema (furnish_webapp)

### Collections Overview

#### 1. **users** Collection
```javascript
{
  "_id": ObjectId,
  "email": "string (unique)",
  "username": "string (unique)", 
  "fullName": "string",
  "phone": "string (optional)",
  "role": "customer|designer|admin",
  "is_active": boolean,
  "hashed_password": "string",
  "created_at": Date,
  "updated_at": Date,
  "last_login": Date (optional)
}
```

**Indexes:**
- `email` (unique)
- `username` (unique) 
- `role`
- `is_active`
- `created_at` (descending)

**Sample User Credentials:**
- Admin: `admin@eleganthome.com` / `admin123`
- Designer: `designer@eleganthome.com` / `designer123` 
- Customer: `customer@example.com` / `customer123`

#### 2. **chat_sessions** Collection
```javascript
{
  "_id": ObjectId,
  "session_id": "string (unique)",
  "user_id": "string",
  "title": "string (max 200 chars)",
  "created_at": Date,
  "updated_at": Date,
  "is_active": boolean,
  "context": Object (optional)
}
```

**Indexes:**
- `session_id` (unique)
- `user_id`
- `user_id, created_at` (compound, descending)
- `is_active`

#### 3. **chat_messages** Collection
```javascript
{
  "_id": ObjectId,
  "session_id": "string",
  "user_id": "string", 
  "message_type": "user|assistant|system",
  "content": "string (max 10000 chars)",
  "timestamp": Date,
  "metadata": Object (optional)
}
```

**Indexes:**
- `session_id, timestamp` (compound)
- `user_id`
- `message_type`
- `timestamp` (descending)

#### 4. **user_preferences** Collection
```javascript
{
  "_id": ObjectId,
  "user_id": "string (unique)",
  "design_preferences": Object (optional),
  "notification_settings": Object (optional),
  "theme": "light|dark|system",
  "language": "string",
  "created_at": Date,
  "updated_at": Date
}
```

**Indexes:**
- `user_id` (unique)

#### 5. **project_templates** Collection
```javascript
{
  "_id": ObjectId,
  "name": "string (max 200 chars)",
  "category": "living-room|bedroom|kitchen|bathroom|office|commercial",
  "description": "string (max 1000 chars)",
  "template_data": {
    "style": "string",
    "color_scheme": ["string"],
    "furniture_types": ["string"],
    "budget_range": "string"
  },
  "preview_images": ["string"] (optional),
  "is_active": boolean,
  "created_by": "string (optional)",
  "created_at": Date,
  "updated_at": Date
}
```

**Indexes:**
- `category`
- `is_active` 
- `created_at` (descending)

**Sample Templates:**
- Modern Living Room (contemporary design)
- Luxury Bedroom (elegant finishes)
- Scandinavian Kitchen (clean, functional)

---

## MySQL Schema (furnish_quotations)

### Tables Overview

#### 1. **quotations** Table
```sql
CREATE TABLE quotations (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    form_data JSON,
    calculation_data JSON,
    client_info JSON,
    status ENUM('draft', 'sent', 'approved', 'rejected') DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    pdf_file_path VARCHAR(512),
    email_sent BOOLEAN DEFAULT FALSE
);
```

**JSON Field Structures:**

**form_data:**
```json
{
  "roomType": "living-room|bedroom|kitchen|bathroom",
  "roomSize": "small|medium|large",
  "style": "modern|luxury|scandinavian|traditional",
  "budget": "low|medium|high",
  "preferences": ["string"]
}
```

**calculation_data:**
```json
{
  "basePrice": number,
  "furnitureCost": number,
  "laborCost": number,
  "totalPrice": number,
  "taxAmount": number,
  "finalAmount": number
}
```

**client_info:**
```json
{
  "clientName": "string",
  "email": "string", 
  "phone": "string",
  "address": "string"
}
```

**Indexes:**
- `user_id`
- `status` 
- `created_at`
- `user_id, status` (compound)
- `user_id, created_at` (compound)

#### 2. **quotation_summary** View
Provides a simplified view of quotations with extracted JSON fields:
```sql
SELECT 
    id, user_id, name, status,
    JSON_UNQUOTE(JSON_EXTRACT(calculation_data, '$.totalPrice')) as total_price,
    JSON_UNQUOTE(JSON_EXTRACT(client_info, '$.clientName')) as client_name,
    JSON_UNQUOTE(JSON_EXTRACT(client_info, '$.email')) as client_email,
    created_at, updated_at, email_sent
FROM quotations;
```

#### 3. **Stored Procedures & Functions**

**GetUserQuotationsByStatus(user_id, status)**
- Returns quotations for a user filtered by status
- Use `'all'` as status to get all quotations

**GetUserQuotationCount(user_id)**
- Returns total number of quotations for a user

---

## Database Connection Configuration

### Spring Boot Services (application.properties)

#### Quotation Service
```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/furnish_quotations?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=rootuser
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8082
```

#### Email Service  
```properties
# Server Configuration
server.port=8081

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### Python Backend (.env)
```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/furnish_webapp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-furnish-webapp-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8080
```

---

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Python Backend (FastAPI) | 8000 | http://localhost:8000 |
| Email Service | 8081 | http://localhost:8081 |  
| Quotation Service | 8082 | http://localhost:8082 |
| Frontend (Next.js) | 3000 | http://localhost:3000 |

---

## Database Setup Scripts

### MongoDB Setup
```bash
# Run the Python setup script
python setup_mongodb.py
```

### MySQL Setup  
```bash
# Run the SQL setup script
Get-Content "setup-mysql.sql" | mysql -u root -prootuser
```

---

## Data Flow Architecture

```
Frontend (Next.js)
    ↓
┌─────────────────────┐
│  API Gateway/Proxy  │
└─────────────────────┘
    ↓               ↓               ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Python    │ │  Quotation  │ │   Email     │
│   Backend   │ │   Service   │ │   Service   │  
│   (8000)    │ │   (8082)    │ │   (8081)    │
└─────────────┘ └─────────────┘ └─────────────┘
    ↓               ↓               ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   MongoDB   │ │    MySQL    │ │  External   │
│ furnish_    │ │  furnish_   │ │  SMTP       │
│  webapp     │ │ quotations  │ │  Service    │
└─────────────┘ └─────────────┘ └─────────────┘
```

---

## Backup & Maintenance

### MongoDB Backup
```bash
mongodump --db furnish_webapp --out ./backups/mongodb/
```

### MongoDB Restore
```bash
mongorestore --db furnish_webapp ./backups/mongodb/furnish_webapp/
```

### MySQL Backup
```bash
mysqldump -u root -prootuser furnish_quotations > ./backups/mysql/furnish_quotations.sql
```

### MySQL Restore
```bash
mysql -u root -prootuser furnish_quotations < ./backups/mysql/furnish_quotations.sql
```

---

## Performance Optimizations

### MongoDB
- All collections have appropriate indexes
- Compound indexes for common query patterns
- Connection pooling via Motor (async driver)

### MySQL
- Indexes on frequently queried columns
- JSON extraction optimized with functions
- Connection pooling via HikariCP

---

## Security Considerations

### MongoDB
- Authentication disabled for development (enable for production)
- Network access restricted to localhost
- Regular security updates

### MySQL  
- Strong password for root user
- Network access restricted to localhost
- SSL disabled for local development (enable for production)
- Regular security updates

### Application Level
- JWT tokens for authentication
- Password hashing with bcrypt
- CORS configured for development origins
- Environment variables for sensitive data

---

## Monitoring & Logging

### Database Monitoring
- MongoDB: Enable profiling for slow queries
- MySQL: Enable slow query log
- Both: Monitor connection pool metrics

### Application Logging
- FastAPI: Structured logging with timestamps
- Spring Boot: Logback with appropriate levels
- All services: Request/response logging

---

This documentation serves as a comprehensive guide for the Furnish Web App database architecture. Update this document when making schema changes or adding new services.