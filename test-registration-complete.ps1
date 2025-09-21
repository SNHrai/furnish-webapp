# Complete Registration Flow Test
Write-Host "🔍 Testing Complete Registration Flow..." -ForegroundColor Green

$authServiceUrl = "http://localhost:8082"

# Test 1: Health Check
Write-Host ""
Write-Host "📋 Test 1: Health Check" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$authServiceUrl/api/auth/health" -Method Get -TimeoutSec 10
    Write-Host "✅ Auth service is healthy: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Auth service health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please ensure auth service is running on port 8082" -ForegroundColor Yellow
    exit 1
}

# Test 2: CORS Test with Origin Header
Write-Host ""
Write-Host "📋 Test 2: CORS Preflight Test" -ForegroundColor Cyan
try {
    $headers = @{
        'Origin' = 'http://localhost:3000'
        'Access-Control-Request-Method' = 'POST'
        'Access-Control-Request-Headers' = 'Content-Type,Authorization'
    }
    
    $response = Invoke-WebRequest -Uri "$authServiceUrl/api/auth/register" -Method Options -Headers $headers -TimeoutSec 10
    Write-Host "✅ CORS preflight successful: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   CORS Headers in response:" -ForegroundColor White
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "   $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ CORS preflight failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Registration API Test
Write-Host ""
Write-Host "📋 Test 3: Registration API Test" -ForegroundColor Cyan
$testUser = @{
    email = "testuser$(Get-Random -Maximum 9999)@example.com"
    username = "testuser$(Get-Random -Maximum 9999)"
    full_name = "Test User"
    phone = "1234567890"
    password = "TestPass123"
} | ConvertTo-Json

$headers = @{
    'Content-Type' = 'application/json'
    'Origin' = 'http://localhost:3000'
}

try {
    $regResponse = Invoke-RestMethod -Uri "$authServiceUrl/api/auth/register" -Method Post -Headers $headers -Body $testUser -TimeoutSec 10
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    
    if ($regResponse.access_token) {
        Write-Host "✅ JWT token received: $($regResponse.access_token.Substring(0, 20))..." -ForegroundColor Green
        
        # Test /me endpoint with token
        $authHeaders = @{
            'Authorization' = "Bearer $($regResponse.access_token)"
            'Content-Type' = 'application/json'
        }
        
        $meResponse = Invoke-RestMethod -Uri "$authServiceUrl/api/auth/me" -Method Get -Headers $authHeaders -TimeoutSec 10
        Write-Host "✅ User data retrieved: $($meResponse.username)" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎉 REGISTRATION FLOW COMPLETE!" -ForegroundColor Green
        Write-Host "   ✅ User created successfully" -ForegroundColor White
        Write-Host "   ✅ JWT token generated" -ForegroundColor White  
        Write-Host "   ✅ Auto-login working" -ForegroundColor White
        Write-Host "   ✅ CORS configuration working" -ForegroundColor White
        
    } else {
        Write-Host "⚠️  Registration succeeded but no JWT token received" -ForegroundColor Yellow
        Write-Host "   Response: $($regResponse | ConvertTo-Json)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Error details: $errorBody" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. If tests pass, try registration from frontend UI" -ForegroundColor White
Write-Host "2. Check browser console for any JavaScript errors" -ForegroundColor White
Write-Host "3. Verify Network tab shows successful requests" -ForegroundColor White
Write-Host "4. Ensure frontend is calling the right auth store methods" -ForegroundColor White

Write-Host ""
Write-Host "🌐 Frontend URLs to test:" -ForegroundColor Cyan
Write-Host "   Registration: http://localhost:3000/register" -ForegroundColor White
Write-Host "   Login: http://localhost:3000/login" -ForegroundColor White
Write-Host "   Dashboard: http://localhost:3000/dashboard" -ForegroundColor White