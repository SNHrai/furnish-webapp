import emailjs from 'emailjs-com'
import { EmailQuotationData, SavedQuotation } from '@/lib/types/quotation'
import { formatINR } from '@/lib/currency'

// EmailJS configuration - these would normally be in environment variables
const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_eleganthome',
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_quotation',
  USER_ID: process.env.NEXT_PUBLIC_EMAILJS_USER_ID || 'user_eleganthome'
}

/**
 * Email service for sending quotations
 * Uses EmailJS for client-side email sending
 * In production, this would be replaced with a server-side email service
 */
export class EmailService {
  
  /**
   * Initialize EmailJS (call this once when the app loads)
   */
  static init() {
    if (typeof window !== 'undefined') {
      emailjs.init(EMAILJS_CONFIG.USER_ID)
    }
  }

  /**
   * Send quotation via email
   */
  static async sendQuotation(data: EmailQuotationData): Promise<{ success: boolean; message: string }> {
    try {
      // Validate email address
      if (!this.validateEmail(data.recipientEmail)) {
        return { success: false, message: 'Please enter a valid email address' }
      }

      // Prepare email template data
      const templateParams = {
        to_email: data.recipientEmail,
        to_name: data.recipientName,
        from_name: data.senderName || 'Elegant Home',
        subject: data.subject,
        message: data.message,
        quotation_id: data.quotation.id.toUpperCase(),
        quotation_name: data.quotation.name,
        quotation_date: new Intl.DateTimeFormat('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).format(data.quotation.timestamp),
        total_amount: formatINR(data.quotation.calculation.totalPrice),
        room_type: this.getRoomTypeLabel(data.quotation.formData.roomType),
        design_style: this.getStyleLabel(data.quotation.formData.style),
        company_name: 'Elegant Home',
        company_email: 'hello@eleganthome.com',
        company_phone: '+91 98765 43210',
        company_website: 'www.eleganthome.com'
      }

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.USER_ID
      )

      if (result.status === 200) {
        return { 
          success: true, 
          message: `Quotation sent successfully to ${data.recipientEmail}` 
        }
      } else {
        return { 
          success: false, 
          message: 'Failed to send email. Please try again.' 
        }
      }
    } catch (error) {
      console.error('Error sending email:', error)
      return { 
        success: false, 
        message: 'Failed to send email. Please check your internet connection and try again.' 
      }
    }
  }

  /**
   * Mock email sending for development/demo purposes
   */
  static async sendQuotationMock(data: EmailQuotationData): Promise<{ success: boolean; message: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Validate email
    if (!this.validateEmail(data.recipientEmail)) {
      return { success: false, message: 'Please enter a valid email address' }
    }

    // Mock successful response
    console.log('📧 Mock Email Sent:', {
      to: data.recipientEmail,
      subject: data.subject,
      quotationId: data.quotation.id,
      amount: formatINR(data.quotation.calculation.totalPrice)
    })

    return { 
      success: true, 
      message: `Quotation sent successfully to ${data.recipientEmail}` 
    }
  }

  /**
   * Validate email address format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Generate email template for quotation
   */
  static generateEmailTemplate(data: EmailQuotationData): string {
    const quotation = data.quotation
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interior Design Quotation</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1A365D, #2D3748); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
        .tagline { font-size: 14px; opacity: 0.9; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
        .quotation-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-amount { font-size: 24px; color: #C05621; font-weight: bold; text-align: center; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table th, .details-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
        .details-table th { background: #f8f9fa; font-weight: 600; }
        .cta-button { display: inline-block; padding: 12px 24px; background: #D4AF37; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Elegant Home</div>
            <div class="tagline">Luxury Interior Design</div>
        </div>
        
        <div class="content">
            <h2>Your Interior Design Quotation</h2>
            <p>Dear ${data.recipientName},</p>
            <p>${data.message}</p>
            
            <div class="quotation-summary">
                <h3 style="margin-top: 0;">Quotation Summary</h3>
                <table class="details-table">
                    <tr><th>Quotation ID</th><td>${quotation.id.toUpperCase()}</td></tr>
                    <tr><th>Project Name</th><td>${quotation.name}</td></tr>
                    <tr><th>Room Type</th><td>${this.getRoomTypeLabel(quotation.formData.roomType)}</td></tr>
                    <tr><th>Design Style</th><td>${this.getStyleLabel(quotation.formData.style)}</td></tr>
                    <tr><th>Date</th><td>${new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(quotation.timestamp)}</td></tr>
                </table>
                
                <div class="total-amount">
                    Total: ${formatINR(quotation.calculation.totalPrice)}
                </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review the attached detailed quotation</li>
                <li>Schedule a consultation to discuss your project</li>
                <li>Finalize design specifications</li>
                <li>Begin your dream space transformation</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="tel:+919876543210" class="cta-button">Call Us: +91 98765 43210</a>
            </div>
            
            <p>This quotation is valid for 30 days. We look forward to bringing your vision to life!</p>
        </div>
        
        <div class="footer">
            <p><strong>Elegant Home - Luxury Interior Design</strong></p>
            <p>123 Design Street, Luxury District, Mumbai - 400001</p>
            <p>Phone: +91 98765 43210 | Email: hello@eleganthome.com</p>
            <p>Website: www.eleganthome.com</p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * Helper function to get room type label
   */
  private static getRoomTypeLabel(roomType: string): string {
    const labels: { [key: string]: string } = {
      'living-room': 'Living Room',
      'bedroom': 'Master Bedroom',
      'kitchen': 'Kitchen',
      'bathroom': 'Bathroom',
      'dining': 'Dining Room',
      'office': 'Home Office',
      'whole-home': 'Whole Home'
    }
    return labels[roomType] || roomType
  }

  /**
   * Helper function to get style label
   */
  private static getStyleLabel(style: string): string {
    const labels: { [key: string]: string } = {
      'modern': 'Modern Luxury',
      'traditional': 'Classic Traditional',
      'contemporary': 'Contemporary Chic',
      'minimalist': 'Minimalist Zen',
      'luxury': 'Ultra Luxury',
      'transitional': 'Transitional Blend'
    }
    return labels[style] || style
  }
}

// Initialize EmailJS when the module is loaded (client-side only)
if (typeof window !== 'undefined') {
  EmailService.init()
}
