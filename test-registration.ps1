# Test script to debug registration issues
Write-Host "🧪 Testing Registration API with Browser-like Behavior..." -ForegroundColor Green

# Test data - using the same data from your screenshot
$registrationData = @{
    email = "sr35285@gmail.com"
    username = "snhrai"
    full_name = "shubham rai"
    phone = "8087701542"
    password = "Snhrai@235"
}

$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:3000"
    "Referer" = "http://localhost:3000/"
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

$body = $registrationData | ConvertTo-Json

Write-Host "📤 Sending request with data:" -ForegroundColor Yellow
Write-Host $body -ForegroundColor Cyan

try {
    # First, test OPTIONS preflight request
    Write-Host "🔍 Testing OPTIONS preflight request..." -ForegroundColor Yellow
    $optionsHeaders = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "content-type"
    }
    
    $optionsResponse = Invoke-WebRequest -Uri "http://localhost:8082/api/auth/register" -Method OPTIONS -Headers $optionsHeaders -ErrorAction Stop
    Write-Host "✅ OPTIONS request successful - Status: $($optionsResponse.StatusCode)" -ForegroundColor Green
    
    # Show CORS headers
    Write-Host "📋 CORS Response Headers:" -ForegroundColor Yellow
    $optionsResponse.Headers.GetEnumerator() | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value -join ', ')" -ForegroundColor Cyan
    }
    
    # Now test actual POST request
    Write-Host "🚀 Testing POST registration request..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:8082/api/auth/register" -Method POST -Headers $headers -Body $body -ErrorAction Stop
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Body:" -ForegroundColor Yellow
    Write-Host $response.Content -ForegroundColor Cyan
    
    # Show response headers
    Write-Host "📋 Response Headers:" -ForegroundColor Yellow
    $response.Headers.GetEnumerator() | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value -join ', ')" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ Request failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            if ($errorBody) {
                Write-Host "Error Response Body:" -ForegroundColor Red
                Write-Host $errorBody -ForegroundColor Red
            }
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "🔍 Next steps if this works but browser doesn't:" -ForegroundColor Yellow
Write-Host "1. Clear browser cache and cookies" -ForegroundColor Cyan
Write-Host "2. Try in incognito/private mode" -ForegroundColor Cyan
Write-Host "3. Check browser console for detailed error messages" -ForegroundColor Cyan
Write-Host "4. Restart auth service if configuration was changed" -ForegroundColor Cyan