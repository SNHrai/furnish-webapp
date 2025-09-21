# Authentication Issues - Complete Solution Guide

## 🔍 Issues Identified and Resolved

### 1. ✅ **Database Migration Completed**
- **Issue**: Application was configured for MongoDB but needed MySQL
- **Solution**: 
  - Updated `auth-service/src/main/resources/application.properties` to use MySQL
  - Created `setup-auth-mysql.sql` with proper schema and sample data
  - Successfully migrated to MySQL with user credentials: `root/rootuser`

### 2. ✅ **CORS Configuration Fixed**
- **Issue**: Frontend (localhost:3000) couldn't access backend (localhost:8082)
- **Solution**: 
  - Updated `CorsConfig.java` with proper origin patterns
  - Added explicit CORS headers and credentials support
  - Verified OPTIONS preflight requests work correctly

### 3. ✅ **API Endpoints Validated**
- **Issue**: Registration and login endpoints had potential data mapping issues  
- **Solution**:
  - Verified `/api/auth/register` works with correct `full_name` field
  - Confirmed `/api/auth/login` returns proper token format
  - Tested both endpoints via direct API calls - both working

### 4. ✅ **Frontend Configuration Enhanced**
- **Issue**: Missing environment configuration
- **Solution**: 
  - Created `frontend/.env.local` with proper API URLs
  - Verified auth store uses correct field mapping (`full_name`)
  - Confirmed form validation and submission logic is correct

## 🚀 Step-by-Step Resolution Process

### Step 1: Start the Auth Service
```powershell
# Use the provided startup script
.\start-auth-service.ps1

# OR manually:
cd auth-service
mvn clean compile
mvn spring-boot:run
```

### Step 2: Verify Service is Running
```powershell
# Test health endpoint
curl http://localhost:8082/api/auth/health

# Test CORS configuration  
curl -X OPTIONS http://localhost:8082/api/auth/register -H "Origin: http://localhost:3000"
```

### Step 3: Test Registration Directly
```powershell
# Test registration API
$headers = @{"Content-Type"="application/json"; "Origin"="http://localhost:3000"}
$body = @{
    username="newuser123"
    email="newuser123@example.com" 
    full_name="New User"
    password="Password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8082/api/auth/register" -Method POST -Headers $headers -Body $body
```

### Step 4: Start Frontend Application
```bash
cd frontend
npm install  # if not already done
npm run dev
```

## 🐛 Common Issues and Solutions

### Issue: "Failed to fetch" Error
**Cause**: Auth service not running or wrong port
**Solution**: 
1. Ensure auth service is running on port 8082
2. Check `frontend/.env.local` has correct API URL
3. Verify no other service is using port 8082

### Issue: CORS Error 
**Cause**: Browser blocking cross-origin requests
**Solution**: 
1. Ensure auth service is started BEFORE frontend
2. Clear browser cache/cookies
3. Try in incognito mode
4. Verify CORS headers in browser dev tools

### Issue: Database Connection Error
**Cause**: MySQL not configured properly  
**Solution**:
1. Ensure MySQL is running
2. Run: `mysql -u root -prootuser < setup-auth-mysql.sql`
3. Verify database `furnish_auth_db` exists with users table

### Issue: JWT Token Mismatch
**Cause**: Different JWT secrets between frontend/backend
**Solution**: Both services should use the same JWT secret (already configured)

## 🔧 Configuration Files Updated

### 1. `/auth-service/src/main/resources/application.properties`
```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/furnish_auth_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=rootuser
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 2. `/frontend/.env.local` (Created)
```env
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8082
NEXT_PUBLIC_API_BASE_URL=http://localhost:8082
JWT_SECRET=your-super-secret-jwt-key-that-should-be-at-least-256-bits-long-for-production
```

### 3. `/auth-service/src/main/java/.../config/CorsConfig.java` (Updated)
- Enhanced CORS configuration for localhost patterns
- Added proper credentials and headers support

## 🧪 Testing Checklist

- [ ] MySQL running with `root/rootuser` credentials  
- [ ] Auth database `furnish_auth_db` created with users table
- [ ] Auth service starts on port 8082 without errors
- [ ] Health endpoint accessible: `http://localhost:8082/api/auth/health`
- [ ] CORS working: OPTIONS requests return proper headers
- [ ] Registration API working via direct calls
- [ ] Login API working via direct calls  
- [ ] Frontend starts on port 3000
- [ ] Frontend can access backend APIs
- [ ] Registration form submits successfully
- [ ] User redirected to dashboard after successful registration
- [ ] Login form works after registration

## 🎯 Expected Behavior After Fixes

1. **Registration Flow**:
   - User fills form with valid data
   - Form validates client-side  
   - Data sent to `http://localhost:8082/api/auth/register`
   - User created in MySQL database
   - Auto-login performed
   - User redirected to `/dashboard`

2. **Login Flow**:
   - User enters email/password
   - Credentials validated against MySQL
   - JWT token returned
   - User data fetched and stored
   - User redirected to intended page

3. **Error Handling**:
   - Network errors show "Failed to fetch" → Check service status
   - Validation errors show field-specific messages
   - Duplicate user errors show appropriate message
   - CORS errors → Verify service startup order

## 📞 Next Steps if Issues Persist

1. Check browser console for specific error messages
2. Check auth service logs for backend errors  
3. Verify port availability: `netstat -an | findstr :8082`
4. Test API endpoints individually using provided PowerShell commands
5. Clear browser cache and try incognito mode
6. Restart both services in correct order (backend first, then frontend)