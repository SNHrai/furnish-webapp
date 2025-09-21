import { springBootApi } from './springboot-api';
import { emailService } from './email-service';
import { isServiceEnabled, serviceUrls, emailJsConfig } from '@/lib/config/env';

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'disabled' | 'unknown';
  message?: string;
  response_time?: number;
  last_checked: string;
}

export interface SystemHealth {
  overall_status: 'healthy' | 'degraded' | 'unhealthy';
  services: ServiceHealth[];
  timestamp: string;
  environment: {
    springboot_enabled: boolean;
    emailjs_enabled: boolean;
    pdf_generation_enabled: boolean;
    websocket_enabled: boolean;
  };
}

class HealthCheckService {
  async checkEmailService(): Promise<ServiceHealth> {
    const start = Date.now();
    
    if (!isServiceEnabled('springboot')) {
      return {
        name: 'Email Service (Spring Boot)',
        status: 'disabled',
        message: 'Spring Boot services are disabled',
        last_checked: new Date().toISOString(),
      };
    }

    try {
      const result = await springBootApi.checkEmailServiceHealth();
      const response_time = Date.now() - start;

      return {
        name: 'Email Service (Spring Boot)',
        status: result.success ? 'healthy' : 'unhealthy',
        message: result.error || result.data?.status || 'Service operational',
        response_time,
        last_checked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'Email Service (Spring Boot)',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed',
        response_time: Date.now() - start,
        last_checked: new Date().toISOString(),
      };
    }
  }

  async checkQuotationService(): Promise<ServiceHealth> {
    const start = Date.now();
    
    if (!isServiceEnabled('springboot')) {
      return {
        name: 'Quotation Service (Spring Boot)',
        status: 'disabled',
        message: 'Spring Boot services are disabled',
        last_checked: new Date().toISOString(),
      };
    }

    try {
      const result = await springBootApi.checkQuotationServiceHealth();
      const response_time = Date.now() - start;

      return {
        name: 'Quotation Service (Spring Boot)',
        status: result.success ? 'healthy' : 'unhealthy',
        message: result.error || result.data?.status || 'Service operational',
        response_time,
        last_checked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'Quotation Service (Spring Boot)',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed',
        response_time: Date.now() - start,
        last_checked: new Date().toISOString(),
      };
    }
  }

  async checkEmailJsService(): Promise<ServiceHealth> {
    try {
      const config = emailService.getConfig();
      
      if (!config.isAvailable) {
        return {
          name: 'EmailJS Service',
          status: 'disabled',
          message: 'EmailJS is not configured or initialized',
          last_checked: new Date().toISOString(),
        };
      }

      // EmailJS doesn't have a health endpoint, so we check configuration
      const hasValidConfig = config.serviceId && 
                           config.templateId && 
                           config.isInitialized;

      return {
        name: 'EmailJS Service',
        status: hasValidConfig ? 'healthy' : 'unhealthy',
        message: hasValidConfig 
          ? 'Configuration valid and initialized' 
          : 'Invalid configuration or initialization failed',
        last_checked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'EmailJS Service',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Service check failed',
        last_checked: new Date().toISOString(),
      };
    }
  }

  async checkApiService(): Promise<ServiceHealth> {
    const start = Date.now();
    
    try {
      // Check the main FastAPI backend health
      const response = await fetch(`${serviceUrls.api}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const response_time = Date.now() - start;

      if (!response.ok) {
        return {
          name: 'FastAPI Backend',
          status: 'unhealthy',
          message: `HTTP ${response.status}: ${response.statusText}`,
          response_time,
          last_checked: new Date().toISOString(),
        };
      }

      const data = await response.json().catch(() => ({}));
      
      return {
        name: 'FastAPI Backend',
        status: 'healthy',
        message: data.message || 'Service operational',
        response_time,
        last_checked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'FastAPI Backend',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed',
        response_time: Date.now() - start,
        last_checked: new Date().toISOString(),
      };
    }
  }

  async checkAllServices(): Promise<SystemHealth> {
    const timestamp = new Date().toISOString();
    
    // Run all health checks in parallel
    const [apiHealth, emailHealth, quotationHealth, emailJsHealth] = await Promise.all([
      this.checkApiService(),
      this.checkEmailService(),
      this.checkQuotationService(),
      this.checkEmailJsService(),
    ]);

    const services = [apiHealth, emailHealth, quotationHealth, emailJsHealth];
    
    // Determine overall status
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;
    const totalActiveServices = services.filter(s => s.status !== 'disabled').length;
    
    let overall_status: 'healthy' | 'degraded' | 'unhealthy';
    
    if (unhealthyServices === 0) {
      overall_status = 'healthy';
    } else if (healthyServices > unhealthyServices) {
      overall_status = 'degraded';
    } else {
      overall_status = 'unhealthy';
    }

    return {
      overall_status,
      services,
      timestamp,
      environment: {
        springboot_enabled: isServiceEnabled('springboot'),
        emailjs_enabled: emailService.isAvailable(),
        pdf_generation_enabled: isServiceEnabled('pdf'),
        websocket_enabled: isServiceEnabled('websocket'),
      },
    };
  }

  // Quick health check for critical services only
  async checkCriticalServices(): Promise<{ isHealthy: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // Check main API
    const apiHealth = await this.checkApiService();
    if (apiHealth.status === 'unhealthy') {
      issues.push(`Main API: ${apiHealth.message}`);
    }
    
    // Check at least one email service is available
    const emailHealth = await this.checkEmailService();
    const emailJsHealth = await this.checkEmailJsService();
    
    const hasEmailService = emailHealth.status === 'healthy' || emailJsHealth.status === 'healthy';
    if (!hasEmailService) {
      issues.push('No email service available');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
    };
  }

  // Get service configuration info
  getServiceConfiguration() {
    return {
      services: {
        fastapi: {
          url: serviceUrls.api,
          websocket_url: serviceUrls.websocket,
        },
        spring_boot: {
          email_service: serviceUrls.email,
          quotation_service: serviceUrls.quotation,
          enabled: isServiceEnabled('springboot'),
        },
        emailjs: {
          service_id: emailJsConfig.serviceId,
          template_id: emailJsConfig.templateId,
          configured: emailService.isAvailable(),
        },
      },
      features: {
        pdf_generation: isServiceEnabled('pdf'),
        websocket_chat: isServiceEnabled('websocket'),
      },
    };
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService();

// Convenience functions
export const checkSystemHealth = () => healthCheckService.checkAllServices();
export const checkCriticalHealth = () => healthCheckService.checkCriticalServices();
export const getServiceConfig = () => healthCheckService.getServiceConfiguration();

export default healthCheckService;