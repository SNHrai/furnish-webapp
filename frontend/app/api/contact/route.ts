import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM system
    // 4. Send confirmation email to user
    
    // For now, we'll simulate these operations
    console.log('Contact form submission:', validatedData)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real implementation, you would:
    // - Save to database (MongoDB, PostgreSQL, etc.)
    // - Send email using service like SendGrid, Nodemailer, etc.
    // - Add lead to CRM like HubSpot, Salesforce, etc.
    // - Send SMS notification if phone provided
    
    // Example of what you might do:
    /*
    // Save to database
    await db.contacts.create({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      projectType: validatedData.projectType,
      budget: validatedData.budget,
      timeline: validatedData.timeline,
      message: validatedData.message,
      createdAt: new Date(),
      status: 'new'
    })
    
    // Send email notification to team
    await sendEmail({
      to: 'team@eleganthome.in',
      subject: `New Contact Form Submission - ${validatedData.projectType}`,
      template: 'new-contact',
      data: validatedData
    })
    
    // Send confirmation email to user
    await sendEmail({
      to: validatedData.email,
      subject: 'Thank you for contacting Elegant Home',
      template: 'contact-confirmation',
      data: validatedData
    })
    
    // Add to CRM or project management system
    await crm.leads.create(validatedData)
    */
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      data: {
        submissionId: generateSubmissionId(),
        estimatedResponse: '24 hours',
        nextSteps: [
          'Our design team will review your project details',
          'We\'ll prepare a personalized consultation proposal',
          'You\'ll receive a follow-up email with next steps',
          'Schedule your free design consultation'
        ]
      }
    }, { status: 200 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      return NextResponse.json({
        success: false,
        message: 'Please check your form inputs',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    // Server error
    console.error('Contact form error:', error)
    return NextResponse.json({
      success: false,
      message: 'We\'re experiencing technical difficulties. Please try again or call us directly.'
    }, { status: 500 })
  }
}

// Helper function to generate submission ID
function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `EH-${timestamp}-${randomStr}`.toUpperCase()
}

// Optional: GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Contact API endpoint is working',
    timestamp: new Date().toISOString()
  })
}
