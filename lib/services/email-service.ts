import emailjs from '@emailjs/browser';
import { emailJsConfig, companyInfo, isServiceEnabled } from '@/lib/config/env';
import { QuotationRequest } from './springboot-api';

export interface EmailJsTemplateParams {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  quotation_items?: string;
  total_amount?: string;
  notes?: string;
  quotation_date?: string;
}

export interface EmailJsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class EmailService {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      if (typeof window !== 'undefined' && emailJsConfig.userId) {
        emailjs.init({
          publicKey: emailJsConfig.userId,
        });
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }

  // Send a general email using EmailJS
  async sendEmail(templateParams: EmailJsTemplateParams): Promise<EmailJsResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'EmailJS is not initialized. Check your environment configuration.',
      };
    }

    try {
      const result = await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        templateParams
      );

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error('EmailJS send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  }

  // Send quotation email with formatted data
  async sendQuotationEmail(quotation: QuotationRequest): Promise<EmailJsResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'EmailJS is not initialized. Check your environment configuration.',
      };
    }

    try {
      // Format quotation items for email template
      const formattedItems = quotation.items
        .map(
          (item, index) =>
            `${index + 1}. ${item.name} - ${item.description}\\n   Quantity: ${item.quantity}, Price: ₹${item.price.toFixed(2)}, Subtotal: ₹${item.subtotal.toFixed(2)}`
        )
        .join('\\n\\n');

      const templateParams: EmailJsTemplateParams = {
        customer_name: quotation.customerName,
        customer_email: quotation.customerEmail,
        customer_phone: quotation.customerPhone,
        company_name: companyInfo.name,
        company_email: companyInfo.email,
        company_phone: companyInfo.phone,
        quotation_items: formattedItems,
        total_amount: `₹${quotation.totalAmount.toFixed(2)}`,
        notes: quotation.notes || '',
        quotation_date: new Date().toLocaleDateString('en-IN'),
      };

      return await this.sendEmail(templateParams);
    } catch (error) {
      console.error('Error sending quotation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send quotation email',
      };
    }
  }

  // Send contact form email
  async sendContactEmail(
    contactData: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }
  ): Promise<EmailJsResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'EmailJS is not initialized. Check your environment configuration.',
      };
    }

    try {
      const templateParams: EmailJsTemplateParams = {
        customer_name: contactData.name,
        customer_email: contactData.email,
        customer_phone: contactData.phone || '',
        company_name: companyInfo.name,
        company_email: companyInfo.email,
        company_phone: companyInfo.phone,
        notes: `Subject: ${contactData.subject}\n\nMessage: ${contactData.message}`,
        quotation_date: new Date().toLocaleDateString('en-IN'),
      };

      return await this.sendEmail(templateParams);
    } catch (error) {
      console.error('Error sending contact email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send contact email',
      };
    }
  }

  // Check if EmailJS is available and configured
  isAvailable(): boolean {
    return this.isInitialized && !!emailJsConfig.serviceId && !!emailJsConfig.templateId;
  }

  // Get service configuration info
  getConfig() {
    return {
      serviceId: emailJsConfig.serviceId,
      templateId: emailJsConfig.templateId,
      isInitialized: this.isInitialized,
      isAvailable: this.isAvailable(),
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Utility function to determine which email service to use
export const getPreferredEmailService = (): 'springboot' | 'emailjs' => {
  if (isServiceEnabled('springboot')) {
    return 'springboot';
  }
  return 'emailjs';
};

// Unified email sending function that chooses the best available service
export const sendQuotationEmail = async (
  quotation: QuotationRequest
): Promise<{ success: boolean; message?: string; error?: string; service: string }> => {
  const preferredService = getPreferredEmailService();

  if (preferredService === 'springboot') {
    // Try Spring Boot service first
    const { springBootApi } = await import('./springboot-api');
    const result = await springBootApi.sendQuotationEmail(quotation);
    return {
      ...result,
      service: 'springboot',
    };
  } else {
    // Fallback to EmailJS
    const result = await emailService.sendQuotationEmail(quotation);
    return {
      ...result,
      service: 'emailjs',
    };
  }
};

export default emailService;
