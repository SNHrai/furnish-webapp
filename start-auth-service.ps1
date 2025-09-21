# Auth Service Startup Script for Furnish WebApp
# This script starts the Spring Boot auth service with proper configuration

Write-Host "🚀 Starting Auth Service for Furnish WebApp..." -ForegroundColor Green

# Check if Maven is available
try {
    $mvnVersion = mvn -version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Maven not found"
    }
    Write-Host "✅ Maven is available" -ForegroundColor Green
}
catch {
    Write-Host "❌ Maven is not available. Please install Maven and add it to your PATH." -ForegroundColor Red
    exit 1
}

# Check if MySQL is running
try {
    $mysqlTest = mysql -u root -prootuser -e "SELECT 1;" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  MySQL connection failed. Please ensure MySQL is running with user 'root' and password 'rootuser'" -ForegroundColor Yellow
        Write-Host "   You can start MySQL and create the database by running:" -ForegroundColor Yellow
        Write-Host "   mysql -u root -p < setup-auth-mysql.sql" -ForegroundColor Yellow
    }
    else {
        Write-Host "✅ MySQL connection successful" -ForegroundColor Green
    }
}
catch {
    Write-Host "⚠️  MySQL check failed. Please ensure MySQL is installed and running." -ForegroundColor Yellow
}

# Change to auth service directory
Set-Location "C:\Users\shubham.rai\Desktop\furnish-webapp\auth-service"

# Clean and compile
Write-Host "🔨 Cleaning and compiling auth service..." -ForegroundColor Yellow
mvn clean compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to compile auth service" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilation successful" -ForegroundColor Green

# Start the service
Write-Host "🌟 Starting Spring Boot Auth Service on port 8082..." -ForegroundColor Green
Write-Host "   Visit http://localhost:8082/api/auth/health to check if it's running" -ForegroundColor Cyan
Write-Host "   Visit http://localhost:8082/api/auth/debug to test CORS" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the service" -ForegroundColor Yellow

mvn spring-boot:run