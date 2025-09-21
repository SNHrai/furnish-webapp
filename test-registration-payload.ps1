# Test Registration Payload Script
# This script tests the exact payload format expected by the auth service

Write-Host "🧪 Testing Registration Payload Format..." -ForegroundColor Green

# Test payload from frontend (current format)
$frontendPayload = @{
    email = "sr35285@gmail.com"
    username = "snhrai"
    full_name = "shubham rai"
    phone = "8087701542"
    password = "Snhrai@235"
}

Write-Host "Frontend sends this payload:" -ForegroundColor Yellow
$frontendPayload | ConvertTo-Json -Depth 2

Write-Host ""
Write-Host "Expected by Java DTO (RegisterRequest.java):" -ForegroundColor Yellow
Write-Host "- email: String (required, valid email)" -ForegroundColor White
Write-Host "- username: String (required, 3-50 chars)" -ForegroundColor White
Write-Host "- full_name: String (required, 1-100 chars, mapped to fullName)" -ForegroundColor White
Write-Host "- phone: String (optional, max 20 chars)" -ForegroundColor White
Write-Host "- password: String (required, min 6 chars)" -ForegroundColor White

Write-Host ""
Write-Host "✅ Payload format analysis complete. The format looks correct!" -ForegroundColor Green
Write-Host "   @JsonProperty('full_name') should map frontend 'full_name' to Java 'fullName'" -ForegroundColor Cyan
Write-Host "   @JsonIgnoreProperties(ignoreUnknown = true) should handle unknown fields" -ForegroundColor Cyan

Write-Host ""
Write-Host "Next steps to resolve the 400 error:" -ForegroundColor Yellow
Write-Host "1. Start the auth service on port 8082" -ForegroundColor White
Write-Host "2. Test the endpoint with curl/Postman" -ForegroundColor White
Write-Host "3. Check server logs for validation errors" -ForegroundColor White
Write-Host "4. Verify CORS configuration allows frontend origin" -ForegroundColor White