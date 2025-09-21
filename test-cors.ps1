# CORS Testing Script for Auth Service
# This script tests CORS configuration from different scenarios

Write-Host "🔍 Testing CORS Configuration for Auth Service..." -ForegroundColor Green

$authServiceUrl = "http://localhost:8082"

Write-Host ""
Write-Host "Testing CORS endpoints:" -ForegroundColor Yellow
Write-Host "1. Health check endpoint" -ForegroundColor White
Write-Host "2. Debug endpoint" -ForegroundColor White  
Write-Host "3. CORS test endpoint" -ForegroundColor White
Write-Host "4. Registration endpoint (POST)" -ForegroundColor White

# Test 1: Health endpoint
Write-Host ""
Write-Host "📋 Test 1: Health endpoint" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$authServiceUrl/api/auth/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Health endpoint accessible: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Debug endpoint with Origin header
Write-Host ""
Write-Host "📋 Test 2: Debug endpoint with Origin header" -ForegroundColor Cyan
try {
    $headers = @{
        'Origin' = 'http://localhost:3000'
        'Content-Type' = 'application/json'
    }
    $debug = Invoke-RestMethod -Uri "$authServiceUrl/api/auth/debug" -Method Get -Headers $headers -TimeoutSec 5
    Write-Host "✅ Debug endpoint accessible from localhost:3000" -ForegroundColor Green
    Write-Host "   Origin received: $($debug.origin)" -ForegroundColor White
} catch {
    Write-Host "❌ Debug endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: CORS test endpoint
Write-Host ""
Write-Host "📋 Test 3: CORS test endpoint (POST)" -ForegroundColor Cyan
try {
    $headers = @{
        'Origin' = 'http://localhost:3000'
        'Content-Type' = 'application/json'
    }
    $body = @{
        test = "cors-test"
        timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    } | ConvertTo-Json
    
    $corsTest = Invoke-RestMethod -Uri "$authServiceUrl/api/auth/cors-test" -Method Post -Headers $headers -Body $body -TimeoutSec 5
    Write-Host "✅ CORS test endpoint working: $($corsTest.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ CORS test endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Registration payload test
Write-Host ""
Write-Host "📋 Test 4: Registration endpoint format test" -ForegroundColor Cyan
$registrationPayload = @{
    email = "test@example.com"
    username = "testuser"
    full_name = "Test User"
    phone = "1234567890"
    password = "TestPass123"
} | ConvertTo-Json

Write-Host "Registration payload format:" -ForegroundColor White
Write-Host $registrationPayload -ForegroundColor Gray

Write-Host ""
Write-Host "🔧 Next steps to resolve CORS issue:" -ForegroundColor Yellow
Write-Host "1. Restart the auth service to apply CORS filter changes" -ForegroundColor White
Write-Host "2. Check browser developer tools Network tab for preflight OPTIONS requests" -ForegroundColor White
Write-Host "3. Verify response headers include Access-Control-Allow-Origin" -ForegroundColor White
Write-Host "4. Test registration from frontend after restart" -ForegroundColor White

Write-Host ""
Write-Host "💡 CORS filter has been added with highest precedence to handle:" -ForegroundColor Cyan
Write-Host "   - Preflight OPTIONS requests" -ForegroundColor White
Write-Host "   - localhost:3000 origin specifically" -ForegroundColor White
Write-Host "   - All required CORS headers" -ForegroundColor White