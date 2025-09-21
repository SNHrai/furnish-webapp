import { getToken } from '@/hooks/useAuth';
import { serviceUrls, isServiceEnabled } from '@/lib/config/env';

// Types for API requests and responses
export interface QuotationRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: QuotationItem[];
  totalAmount: number;
  notes?: string;
}

export interface QuotationItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded
  contentType: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class SpringBootApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Email Service Methods
  async sendEmail(emailRequest: EmailRequest): Promise<ApiResponse> {
    if (!isServiceEnabled('springboot')) {
      return {
        success: false,
        error: 'Spring Boot services are disabled. Enable NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES in environment.',
      };
    }

    try {
      const response = await fetch(`${serviceUrls.email}/send`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(emailRequest),
      });

      return await this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  }

  async sendQuotationEmail(quotation: QuotationRequest): Promise<ApiResponse> {
    if (!isServiceEnabled('springboot')) {
      return {
        success: false,
        error: 'Spring Boot services are disabled. Enable NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES in environment.',
      };
    }

    try {
      const response = await fetch(`${serviceUrls.email}/quotation`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(quotation),
      });

      return await this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send quotation email',
      };
    }
  }

  // Quotation Service Methods
  async generateQuotationPDF(quotation: QuotationRequest): Promise<ApiResponse<Blob>> {
    if (!isServiceEnabled('springboot')) {
      return {
        success: false,
        error: 'Spring Boot services are disabled. Enable NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES in environment.',
      };
    }

    try {
      const response = await fetch(`${serviceUrls.quotation}/generate-pdf`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(quotation),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate PDF',
      };
    }
  }

  async saveQuotation(quotation: QuotationRequest): Promise<ApiResponse<{ id: string }>> {
    if (!isServiceEnabled('springboot')) {
      return {
        success: false,
        error: 'Spring Boot services are disabled. Enable NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES in environment.',
      };
    }

    try {
      const response = await fetch(`${serviceUrls.quotation}/save`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(quotation),
      });

      return await this.handleResponse<{ id: string }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save quotation',
      };
    }
  }

  async getQuotation(quotationId: string): Promise<ApiResponse<QuotationRequest>> {
    if (!isServiceEnabled('springboot')) {
      return {
        success: false,
        error: 'Spring Boot services are disabled. Enable NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES in environment.',
      };
    }

    try {
      const response = await fetch(`${serviceUrls.quotation}/${quotationId}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse<QuotationRequest>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch quotation',
      };
    }
  }

  async getQuotations(): Promise<ApiResponse<QuotationRequest[]>> {
    if (!isServiceEnabled('springboot')) {
      return {
        success: false,
        error: 'Spring Boot services are disabled. Enable NEXT_PUBLIC_ENABLE_SPRING_BOOT_SERVICES in environment.',
      };
    }

    try {
      const response = await fetch(`${serviceUrls.quotation}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse<QuotationRequest[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch quotations',
      };
    }
  }

  // Health check methods
  async checkEmailServiceHealth(): Promise<ApiResponse<{ status: string }>> {
    try {
      const response = await fetch(`${serviceUrls.email}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      return await this.handleResponse<{ status: string }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email service is unavailable',
      };
    }
  }

  async checkQuotationServiceHealth(): Promise<ApiResponse<{ status: string }>> {
    try {
      const response = await fetch(`${serviceUrls.quotation}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      return await this.handleResponse<{ status: string }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Quotation service is unavailable',
      };
    }
  }
}

// Export singleton instance
export const springBootApi = new SpringBootApiClient();

// Utility functions for easier usage
export const downloadPDF = async (quotation: QuotationRequest, filename?: string): Promise<boolean> => {
  const result = await springBootApi.generateQuotationPDF(quotation);
  
  if (!result.success || !result.data) {
    console.error('Failed to generate PDF:', result.error);
    return false;
  }

  // Create download link
  const url = window.URL.createObjectURL(result.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `quotation-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return true;
};

export const sendQuotationWithPDF = async (quotation: QuotationRequest): Promise<boolean> => {
  try {
    // First, send the email with quotation
    const emailResult = await springBootApi.sendQuotationEmail(quotation);
    
    if (!emailResult.success) {
      console.error('Failed to send quotation email:', emailResult.error);
      return false;
    }

    // Optionally save the quotation for record keeping
    const saveResult = await springBootApi.saveQuotation(quotation);
    
    if (!saveResult.success) {
      console.warn('Quotation email sent but failed to save:', saveResult.error);
    }

    return true;
  } catch (error) {
    console.error('Error sending quotation with PDF:', error);
    return false;
  }
};