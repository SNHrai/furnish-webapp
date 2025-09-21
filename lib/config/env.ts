// Environment configuration utility
// Centralized configuration for all environment variables

export const env = {
  // API Services
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001',

  // Spring Boot Microservices
  EMAIL_SERVICE_URL: process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || 'http://localhost:8080/api/email',
  QUOTATION_SERVICE_URL: process.env.NEXT_PUBLIC_QUOTATION_SERVICE_URL || 'http://localhost:8081/api/quotations',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-here-change-in-production',

  // EmailJS Configuration
  EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_eleganthome',
  EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_quotation',
  EMAILJS_USER_ID: process.env.NEXT_PUBLIC_EMAILJS_USER_ID || 'user_eleganthome',

  // App Configuration
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Elegant Home',
  COMPANY_EMAIL: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'hello@eleganthome.com',
  COMPANY_PHONE: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210',

  // Feature Flags
  ENABLE_SPRING_BOOT_SERVICES: process.env.NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES === 'true',
  ENABLE_WEBSOCKET_CHAT: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET_CHAT === 'true',
  ENABLE_PDF_GENERATION: process.env.NEXT_PUBLIC_ENABLE_PDF_GENERATION !== 'false', // Default to true

  // Development flags
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

// Validation function to check required environment variables
export const validateEnvironment = (): { isValid: boolean; missingVars: string[] } => {
  const requiredVars = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_APP_URL',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName] && !getDefaultValue(varName)
  );

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

// Helper function to get default values
const getDefaultValue = (varName: string): string | undefined => {
  const defaults: Record<string, string> = {
    'NEXT_PUBLIC_API_BASE_URL': 'http://localhost:8001',
    'NEXT_PUBLIC_APP_URL': 'http://localhost:3000',
  };

  return defaults[varName];
};

// Utility functions for service availability
export const isServiceEnabled = (service: 'springboot' | 'websocket' | 'pdf'): boolean => {
  switch (service) {
    case 'springboot':
      return env.ENABLE_SPRING_BOOT_SERVICES;
    case 'websocket':
      return env.ENABLE_WEBSOCKET_CHAT;
    case 'pdf':
      return env.ENABLE_PDF_GENERATION;
    default:
      return false;
  }
};

// Service URLs object for easy access
export const serviceUrls = {
  api: env.API_BASE_URL,
  websocket: env.WS_URL,
  email: env.EMAIL_SERVICE_URL,
  quotation: env.QUOTATION_SERVICE_URL,
} as const;

// Company information object
export const companyInfo = {
  name: env.COMPANY_NAME,
  email: env.COMPANY_EMAIL,
  phone: env.COMPANY_PHONE,
  website: env.APP_URL,
} as const;

// EmailJS configuration object
export const emailJsConfig = {
  serviceId: env.EMAILJS_SERVICE_ID,
  templateId: env.EMAILJS_TEMPLATE_ID,
  userId: env.EMAILJS_USER_ID,
} as const;

export default env;