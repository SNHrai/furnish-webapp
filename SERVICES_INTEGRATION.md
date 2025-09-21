# Services Integration Guide

This document provides a comprehensive guide to the services integration in the Furnish WebApp, including Spring Boot microservices, EmailJS fallback, and configuration management.

## Architecture Overview

The application follows a microservices architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   FastAPI       │    │  Spring Boot    │
│   Frontend      │◄──►│   Backend       │◄──►│  Microservices  │
│                 │    │                 │    │                 │
│ - Auth Store    │    │ - Authentication│    │ - Email Service │
│ - API Clients   │    │ - Chat API      │    │ - PDF Generation│
│ - Health Checks │    │ - User Mgmt     │    │ - Quotations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                   │
                                   ▼
                           ┌─────────────────┐
                           │    EmailJS      │
                           │   (Fallback)    │
                           └─────────────────┘
```

## Services Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

```bash
# API Services
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_WS_URL=ws://localhost:8001

# Spring Boot Microservices
NEXT_PUBLIC_EMAIL_SERVICE_URL=http://localhost:8080/api/email
NEXT_PUBLIC_QUOTATION_SERVICE_URL=http://localhost:8081/api/quotations

# Feature Flags
NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES=true
NEXT_PUBLIC_ENABLE_WEBSOCKET_CHAT=false
NEXT_PUBLIC_ENABLE_PDF_GENERATION=true

# EmailJS Configuration (Fallback)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_eleganthome
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_quotation
NEXT_PUBLIC_EMAILJS_USER_ID=user_eleganthome
```

### Centralized Configuration

All environment variables are managed through `lib/config/env.ts`:

```typescript
import { env, serviceUrls, isServiceEnabled } from '@/lib/config/env';

// Check if a service is enabled
const springBootEnabled = isServiceEnabled('springboot');

// Access service URLs
const emailServiceUrl = serviceUrls.email;
```

## Service Integrations

### 1. Spring Boot Email Service

**Location**: `lib/services/springboot-api.ts`

**Features**:
- Send general emails
- Send formatted quotation emails
- JWT authentication integration
- Health checks

**Usage**:
```typescript
import { springBootApi } from '@/lib/services/springboot-api';

// Send quotation email
const result = await springBootApi.sendQuotationEmail(quotationData);

// Check service health
const health = await springBootApi.checkEmailServiceHealth();
```

### 2. Spring Boot Quotation Service

**Features**:
- Generate PDF quotations
- Save quotations to database
- Retrieve quotation history
- Download PDF directly

**Usage**:
```typescript
// Generate and download PDF
const success = await downloadPDF(quotationData, 'my-quotation.pdf');

// Save quotation
const result = await springBootApi.saveQuotation(quotationData);

// Get quotation history
const quotations = await springBootApi.getQuotations();
```

### 3. EmailJS Fallback Service

**Location**: `lib/services/email-service.ts`

**Features**:
- Client-side email sending
- Automatic fallback when Spring Boot is unavailable
- Contact form integration
- Template-based emails

**Usage**:
```typescript
import { sendQuotationEmail } from '@/lib/services/email-service';

// Automatically chooses best available service
const result = await sendQuotationEmail(quotationData);
console.log(`Email sent via: ${result.service}`); // 'springboot' or 'emailjs'
```

### 4. Health Check Service

**Location**: `lib/services/health-check.ts`

**Features**:
- Monitor all services health
- System-wide health assessment
- Service configuration validation
- Performance metrics

**Usage**:
```typescript
import { checkSystemHealth, checkCriticalHealth } from '@/lib/services/health-check';

// Full system health check
const systemHealth = await checkSystemHealth();

// Quick critical services check
const { isHealthy, issues } = await checkCriticalHealth();
```

## Service Integration Patterns

### 1. Graceful Degradation

Services are designed to degrade gracefully when dependencies are unavailable:

```typescript
// Email service automatically falls back to EmailJS
if (springBootServiceDown) {
  // Automatically uses EmailJS
  await sendQuotationEmail(data);
}
```

### 2. Feature Flags

Use environment variables to enable/disable features:

```typescript
if (isServiceEnabled('pdf')) {
  // PDF generation is enabled
  await generatePDF(data);
} else {
  // Show alternative UI or disable feature
  showPDFUnavailableMessage();
}
```

### 3. Health Monitoring

Integrate health checks in your components:

```typescript
import { useEffect, useState } from 'react';
import { checkCriticalHealth } from '@/lib/services/health-check';

export function ServiceStatusBanner() {
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    checkCriticalHealth().then(({ isHealthy }) => {
      setIsHealthy(isHealthy);
    });
  }, []);

  if (!isHealthy) {
    return <div className="alert">Some services are currently unavailable</div>;
  }

  return null;
}
```

## API Integration Examples

### Calculator Component Integration

```typescript
import { downloadPDF, sendQuotationWithPDF } from '@/lib/services/springboot-api';

export function Calculator() {
  const handleDownloadPDF = async (quotationData) => {
    const success = await downloadPDF(quotationData, 'quotation.pdf');
    if (success) {
      toast.success('PDF downloaded successfully');
    } else {
      toast.error('Failed to generate PDF');
    }
  };

  const handleEmailQuotation = async (quotationData) => {
    const success = await sendQuotationWithPDF(quotationData);
    if (success) {
      toast.success('Quotation emailed successfully');
    }
  };
}
```

### Admin Dashboard Integration

```typescript
import { checkSystemHealth } from '@/lib/services/health-check';

export function AdminDashboard() {
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      const health = await checkSystemHealth();
      setSystemHealth(health);
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>System Status: {systemHealth?.overall_status}</h2>
      {systemHealth?.services.map(service => (
        <div key={service.name} className={`service-${service.status}`}>
          <h3>{service.name}</h3>
          <p>Status: {service.status}</p>
          <p>Message: {service.message}</p>
          {service.response_time && (
            <p>Response Time: {service.response_time}ms</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Deployment Configuration

### Development

```bash
# .env.local
NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES=false
NEXT_PUBLIC_ENABLE_PDF_GENERATION=true
```

### Staging

```bash
# .env.staging
NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES=true
NEXT_PUBLIC_EMAIL_SERVICE_URL=https://staging-email.company.com/api/email
NEXT_PUBLIC_QUOTATION_SERVICE_URL=https://staging-quotation.company.com/api/quotations
```

### Production

```bash
# .env.production
NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES=true
NEXT_PUBLIC_EMAIL_SERVICE_URL=https://api-email.company.com/api/email
NEXT_PUBLIC_QUOTATION_SERVICE_URL=https://api-quotation.company.com/api/quotations
```

## Error Handling

All services implement consistent error handling:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Usage
const result = await springBootApi.sendEmail(data);
if (!result.success) {
  console.error('Email failed:', result.error);
  // Handle error appropriately
  showErrorMessage(result.error);
}
```

## Testing Services

### Health Check Endpoint

Create a health check page for monitoring:

```typescript
// pages/api/health.ts
import { checkSystemHealth } from '@/lib/services/health-check';

export default async function handler(req, res) {
  const health = await checkSystemHealth();
  res.status(health.overall_status === 'unhealthy' ? 503 : 200).json(health);
}
```

### Service Testing

```typescript
// Test individual services
import { springBootApi } from '@/lib/services/springboot-api';

// Test email service
const emailTest = await springBootApi.checkEmailServiceHealth();
console.log('Email service status:', emailTest);

// Test quotation service
const quotationTest = await springBootApi.checkQuotationServiceHealth();
console.log('Quotation service status:', quotationTest);
```

## Best Practices

1. **Always check service availability** before using features
2. **Implement graceful degradation** for better user experience
3. **Use environment variables** for configuration management
4. **Monitor service health** regularly
5. **Handle errors gracefully** with user-friendly messages
6. **Log service interactions** for debugging
7. **Test fallback mechanisms** thoroughly

## Troubleshooting

### Common Issues

1. **Service unavailable**: Check health endpoints and network connectivity
2. **Authentication failures**: Verify JWT tokens and service URLs
3. **CORS errors**: Configure CORS properly on Spring Boot services
4. **Environment configuration**: Ensure all required variables are set

### Debug Commands

```bash
# Check service configuration
curl http://localhost:3000/api/health

# Test Spring Boot services directly
curl http://localhost:8080/api/email/health
curl http://localhost:8081/api/quotations/health

# Check environment variables
npm run env:check
```

## Future Enhancements

- [ ] Service discovery and automatic failover
- [ ] Circuit breaker pattern implementation
- [ ] Distributed tracing integration
- [ ] Performance monitoring and alerting
- [ ] Automated service scaling
- [ ] Message queue integration for async operations