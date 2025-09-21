# Comprehensive CORS Preflight Test Script
Write-Host "🔍 Testing CORS Preflight Configuration..." -ForegroundColor Green

$authServiceUrl = "http://localhost:8082"

# Test 1: Simple health check
Write-Host ""
Write-Host "📋 Test 1: Health Check" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$authServiceUrl/api/auth/health" -Method Get
    Write-Host "✅ Auth service is healthy: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Auth service not running. Please start it first." -ForegroundColor Red
    exit 1
}

# Test 2: Direct OPTIONS request to registration endpoint
Write-Host ""
Write-Host "📋 Test 2: OPTIONS Preflight to Registration Endpoint" -ForegroundColor Cyan
try {
    $headers = @{
        'Origin' = 'http://localhost:3000'
        'Access-Control-Request-Method' = 'POST'
        'Access-Control-Request-Headers' = 'Content-Type,Authorization'
    }
    
    $response = Invoke-WebRequest -Uri "$authServiceUrl/api/auth/register" -Method Options -Headers $headers
    Write-Host "✅ Registration OPTIONS successful: $($response.StatusCode)" -ForegroundColor Green
    
    # Check CORS headers in response
    $corsHeaders = @()
    $response.Headers.GetEnumerator() | ForEach-Object {
        if ($_.Key -like "*Access-Control*") {
            $corsHeaders += "$($_.Key): $($_.Value)"
        }
    }
    
    if ($corsHeaders.Count -gt 0) {
        Write-Host "✅ CORS headers found:" -ForegroundColor Green
        $corsHeaders | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    } else {
        Write-Host "⚠️  No CORS headers found in response" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Registration OPTIONS failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This is the exact issue causing the CORS error!" -ForegroundColor Yellow
}

# Test 3: Test custom preflight endpoint
Write-Host ""
Write-Host "📋 Test 3: Custom Preflight Test Endpoint" -ForegroundColor Cyan
try {
    $headers = @{
        'Origin' = 'http://localhost:3000'
        'Access-Control-Request-Method' = 'POST'
        'Access-Control-Request-Headers' = 'Content-Type'
    }
    
    $response = Invoke-WebRequest -Uri "$authServiceUrl/api/auth/preflight-test" -Method Options -Headers $headers
    Write-Host "✅ Custom preflight successful: $($response.StatusCode)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Custom preflight failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Full registration flow
Write-Host ""
Write-Host "📋 Test 4: Full Registration Flow" -ForegroundColor Cyan

# First do OPTIONS request
try {
    $headers = @{
        'Origin' = 'http://localhost:3000'
        'Access-Control-Request-Method' = 'POST'
        'Access-Control-Request-Headers' = 'Content-Type'
    }
    
    $preflightResponse = Invoke-WebRequest -Uri "$authServiceUrl/api/auth/register" -Method Options -Headers $headers
    Write-Host "✅ Preflight check passed: $($preflightResponse.StatusCode)" -ForegroundColor Green
    
    # Now do actual registration
    $testUser = @{
        email = "testcors$(Get-Random -Maximum 9999)@example.com"
        username = "testcors$(Get-Random -Maximum 9999)"
        full_name = "CORS Test User"
        phone = "1234567890"
        password = "TestPass123"
    } | ConvertTo-Json
    
    $postHeaders = @{
        'Content-Type' = 'application/json'
        'Origin' = 'http://localhost:3000'
    }
    
    $regResponse = Invoke-RestMethod -Uri "$authServiceUrl/api/auth/register" -Method Post -Headers $postHeaders -Body $testUser
    Write-Host "✅ Registration successful with JWT token!" -ForegroundColor Green
    Write-Host "   Token: $($regResponse.access_token.Substring(0, 20))..." -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Full registration flow failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 Summary & Next Steps:" -ForegroundColor Yellow
Write-Host "1. If Test 2 fails, the CORS preflight issue is still present" -ForegroundColor White
Write-Host "2. If all tests pass, restart auth service and test from browser" -ForegroundColor White
Write-Host "3. Check browser Network tab for successful OPTIONS requests" -ForegroundColor White
Write-Host "4. The registration should work without CORS errors" -ForegroundColor White

Write-Host ""
Write-Host "🚀 If tests pass, run:" -ForegroundColor Cyan
Write-Host "   mvn spring-boot:run" -ForegroundColor White
Write-Host "   Then test at: http://localhost:3000/register" -ForegroundColor White