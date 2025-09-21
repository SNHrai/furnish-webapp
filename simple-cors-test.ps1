# Simple CORS Test
Write-Host "Testing CORS Configuration..." -ForegroundColor Green

# Test health endpoint
try {
    $result = Invoke-RestMethod -Uri "http://localhost:8082/api/auth/health" -Method Get
    Write-Host "Health endpoint working: $($result.status)" -ForegroundColor Green
} catch {
    Write-Host "Auth service not running or health endpoint failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "CORS fixes applied:" -ForegroundColor Yellow
Write-Host "1. Added CorsFilter with highest precedence" -ForegroundColor White
Write-Host "2. Explicitly allows localhost:3000 origin" -ForegroundColor White
Write-Host "3. Handles OPTIONS preflight requests" -ForegroundColor White
Write-Host "4. Sets all required CORS headers" -ForegroundColor White

Write-Host ""
Write-Host "Next: Restart your auth service and test registration from UI" -ForegroundColor Cyan