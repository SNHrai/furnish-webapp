# PowerShell script to run both Spring Boot services
# Usage: .\run-services.ps1

Write-Host "Starting Furnish Web App Services..." -ForegroundColor Green

# Set Java Home for Maven
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Function to start a service in background
function Start-Service($serviceName, $path, $port) {
    Write-Host "Starting $serviceName on port $port..." -ForegroundColor Yellow
    
    Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd '$path'; mvn spring-boot:run" -WindowStyle Minimized
    Start-Sleep -Seconds 3
    
    # Check if service is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port/actuator/health" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "$serviceName started successfully on http://localhost:$port" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "$serviceName is starting... (may take a few more seconds)" -ForegroundColor Yellow
    }
}

# Start Email Service
$emailServicePath = "C:\Users\shubham.rai\Desktop\furnish-webapp\email-service"
Start-Service -serviceName "Email Service" -path $emailServicePath -port 8081

# Start Quotation Service
$quotationServicePath = "C:\Users\shubham.rai\Desktop\furnish-webapp\quotation-service"
Start-Service -serviceName "Quotation Service" -path $quotationServicePath -port 8082

Write-Host "`nServices Status:" -ForegroundColor Cyan
Write-Host "- Email Service: http://localhost:8081" -ForegroundColor White
Write-Host "- Quotation Service: http://localhost:8082" -ForegroundColor White
Write-Host "- H2 Database Console: http://localhost:8082/h2-console" -ForegroundColor White

Write-Host "`nH2 Database Connection Details:" -ForegroundColor Cyan
Write-Host "- JDBC URL: jdbc:h2:mem:quotationdb" -ForegroundColor White
Write-Host "- User Name: sa" -ForegroundColor White
Write-Host "- Password: password" -ForegroundColor White

Write-Host "`nEmail Service Configuration:" -ForegroundColor Cyan
Write-Host "- Update src/main/resources/application.properties with your email credentials" -ForegroundColor Yellow
Write-Host "- Replace 'your-email@gmail.com' with your Gmail address" -ForegroundColor Yellow
Write-Host "- Replace 'your-app-password' with your Gmail app password" -ForegroundColor Yellow

Write-Host "`nPress any key to exit..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")