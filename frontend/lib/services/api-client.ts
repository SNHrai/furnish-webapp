/**
 * API Client for integrating with Spring Boot microservices
 * Handles email service and quotation service integration
 */

import { useAuthStore } from '@/lib/stores/auth-store'
import { SavedQuotation } from '@/lib/types/quotation'

// Service URLs - these would be configured via environment variables in production
const SERVICES = {
  EMAIL_SERVICE: process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || 'http://localhost:8080/api/email',
  QUOTATION_SERVICE: process.env.NEXT_PUBLIC_QUOTATION_SERVICE_URL || 'http://localhost:8081/api/quotations',
  AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8082/api',
  FASTAPI_SERVICE: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api'
}

// Response interfaces
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface EmailRequest {
  to: string
  subject: string
  templateName: string
  templateData: Record<string, any>
  attachments?: Array<{
    filename: string
    content: string
    contentType: string
  }>
}

interface QuotationPDFRequest {
  quotation: SavedQuotation
  customerInfo: {
    name: string
    email: string
    phone?: string
  }
  companyInfo: {
    name: string
    logo?: string
    address: string
    phone: string
    email: string
    website: string
  }
}

/**
 * Base API client class with common functionality
 */
class BaseApiClient {
  protected async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Get auth token
      const token = useAuthStore.getState().token
      
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`
      }
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        credentials: 'include',
      })

      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || responseData.detail || `HTTP ${response.status}`,
          data: responseData
        }
      }

      return {
        success: true,
        data: responseData,
        message: responseData.message
      }
    } catch (error: any) {
      console.error(`API request failed:`, error)
      return {
        success: false,
        error: error.message || 'Network error occurred',
      }
    }
  }

  protected async downloadFile(url: string, options: RequestInit = {}): Promise<Blob | null> {
    try {
      const token = useAuthStore.getState().token
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('File download failed:', error)
      return null
    }
  }
}

/**
 * Email Service API Client
 * Integrates with Java Spring Boot Email Service
 */
export class EmailServiceClient extends BaseApiClient {
  
  /**
   * Send quotation email using Spring Boot email service
   */
  async sendQuotationEmail(
    quotation: SavedQuotation,
    recipientEmail: string,
    recipientName: string,
    customMessage?: string
  ): Promise<ApiResponse> {
    const emailRequest: EmailRequest = {
      to: recipientEmail,
      subject: `Interior Design Quotation - ${quotation.name}`,
      templateName: 'quotation-email',
      templateData: {
        recipientName,
        customMessage: customMessage || 'Thank you for your interest in our interior design services.',
        quotation: {
          id: quotation.id,
          name: quotation.name,
          totalPrice: quotation.calculation.totalPrice,
          roomType: quotation.formData.roomType,
          style: quotation.formData.style,
          date: quotation.timestamp.toISOString()
        },
        company: {
          name: 'Elegant Home',
          phone: '+91 98765 43210',
          email: 'hello@eleganthome.com',
          website: 'www.eleganthome.com'
        }
      }
    }

    return this.makeRequest(
      `${SERVICES.EMAIL_SERVICE}/send`,
      {
        method: 'POST',
        body: JSON.stringify(emailRequest),
      }
    )
  }

  /**
   * Send general email
   */
  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    templateData: Record<string, any>
  ): Promise<ApiResponse> {
    const emailRequest: EmailRequest = {
      to,
      subject,
      templateName,
      templateData
    }

    return this.makeRequest(
      `${SERVICES.EMAIL_SERVICE}/send`,
      {
        method: 'POST',
        body: JSON.stringify(emailRequest),
      }
    )
  }

  /**
   * Send contact form email
   */
  async sendContactFormEmail(
    name: string,
    email: string,
    phone: string,
    message: string,
    subject: string = 'New Contact Form Submission'
  ): Promise<ApiResponse> {
    return this.sendEmail(
      'hello@eleganthome.com',
      subject,
      'contact-form',
      {
        senderName: name,
        senderEmail: email,
        senderPhone: phone,
        message,
        timestamp: new Date().toISOString()
      }
    )
  }
}

/**
 * Quotation Service API Client
 * Integrates with Java Spring Boot Quotation Service
 */
export class QuotationServiceClient extends BaseApiClient {
  
  /**
   * Generate PDF quotation using Spring Boot service
   */
  async generateQuotationPDF(
    quotation: SavedQuotation,
    customerInfo: {
      name: string
      email: string
      phone?: string
    }
  ): Promise<Blob | null> {
    const request: QuotationPDFRequest = {
      quotation,
      customerInfo,
      companyInfo: {
        name: 'Elegant Home',
        address: '123 Design Street, Luxury District, Mumbai - 400001',
        phone: '+91 98765 43210',
        email: 'hello@eleganthome.com',
        website: 'www.eleganthome.com'
      }
    }

    return this.downloadFile(
      `${SERVICES.QUOTATION_SERVICE}/generate-pdf`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    )
  }

  /**
   * Save quotation to Spring Boot service
   */
  async saveQuotation(quotation: SavedQuotation): Promise<ApiResponse> {
    return this.makeRequest(
      `${SERVICES.QUOTATION_SERVICE}/save`,
      {
        method: 'POST',
        body: JSON.stringify(quotation),
      }
    )
  }

  /**
   * Get quotation by ID from Spring Boot service
   */
  async getQuotation(quotationId: string): Promise<ApiResponse<SavedQuotation>> {
    return this.makeRequest(
      `${SERVICES.QUOTATION_SERVICE}/${quotationId}`,
      {
        method: 'GET',
      }
    )
  }

  /**
   * Get user's quotations from Spring Boot service
   */
  async getUserQuotations(userId: string): Promise<ApiResponse<SavedQuotation[]>> {
    return this.makeRequest(
      `${SERVICES.QUOTATION_SERVICE}/user/${userId}`,
      {
        method: 'GET',
      }
    )
  }

  /**
   * Delete quotation
   */
  async deleteQuotation(quotationId: string): Promise<ApiResponse> {
    return this.makeRequest(
      `${SERVICES.QUOTATION_SERVICE}/${quotationId}`,
      {
        method: 'DELETE',
      }
    )
  }
}

// Service instances
export const emailServiceClient = new EmailServiceClient()
export const quotationServiceClient = new QuotationServiceClient()

// Utility function to check if Spring Boot services are available
export async function checkServicesHealth(): Promise<{
  emailService: boolean
  quotationService: boolean
  fastApiService: boolean
}> {
  const checkService = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        timeout: 5000,
      } as any)
      return response.ok
    } catch {
      return false
    }
  }

  const [emailService, quotationService, fastApiService] = await Promise.all([
    checkService(SERVICES.EMAIL_SERVICE),
    checkService(SERVICES.QUOTATION_SERVICE),
    checkService(SERVICES.FASTAPI_SERVICE)
  ])

  return {
    emailService,
    quotationService,
    fastApiService
  }
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export default {
  emailServiceClient,
  quotationServiceClient,
  checkServicesHealth
}