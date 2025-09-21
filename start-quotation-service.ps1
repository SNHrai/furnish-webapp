# Start Quotation Service with Java 17
# This script sets the correct JAVA_HOME and starts the quotation service

Write-Host "🚀 Starting Quotation Service with Java 17..." -ForegroundColor Green

# Set Java 17 as JAVA_HOME for this session
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Change to quotation service directory
Set-Location "C:\Users\shubham.rai\Desktop\furnish-webapp\quotation-service"

# Verify Java version
Write-Host "📋 Verifying Java configuration..." -ForegroundColor Yellow
mvn -version

Write-Host "`n🔧 Starting Maven Spring Boot application..." -ForegroundColor Yellow
Write-Host "Service will be available at: http://localhost:8082" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor Gray

# Start the application
mvn spring-boot:run