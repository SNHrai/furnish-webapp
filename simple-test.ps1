Write-Host "Testing Auth Service..." -ForegroundColor Green

try {
    $health = Invoke-RestMethod -Uri "http://localhost:8082/api/auth/health" -Method Get
    Write-Host "Auth service is healthy: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "Auth service is not running" -ForegroundColor Red
    exit 1
}

Write-Host "Testing registration endpoint..." -ForegroundColor Yellow

$testUser = @{
    email = "test123@example.com"
    username = "test123"
    full_name = "Test User"
    phone = "1234567890"
    password = "TestPass123"
} | ConvertTo-Json

$headers = @{
    'Content-Type' = 'application/json'
    'Origin' = 'http://localhost:3000'
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8082/api/auth/register" -Method Post -Headers $headers -Body $testUser
    Write-Host "Registration successful!" -ForegroundColor Green
    
    if ($response.access_token) {
        Write-Host "JWT token received!" -ForegroundColor Green
    } else {
        Write-Host "No JWT token in response" -ForegroundColor Red
    }
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Now test from your browser at http://localhost:3000/register" -ForegroundColor Cyan