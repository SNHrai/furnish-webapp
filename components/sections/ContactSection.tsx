'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles, AlertCircle } from 'lucide-react'

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

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formResponseData, setFormResponseData] = useState<any>(null)
  const [serverError, setServerError] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: '',
      budget: '',
      message: '',
      timeline: ''
    }
  })

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Showroom',
      content: 'Elegant Home Studio\nBandra West\nMumbai, Maharashtra 400050',
      link: 'https://maps.google.com',
      linkText: 'Get Directions'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 98765 43210\nToll Free: 1800 123 4567',
      link: 'tel:+919876543210',
      linkText: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@eleganthome.in\ninfo@eleganthome.in',
      link: 'mailto:hello@eleganthome.in',
      linkText: 'Send Email'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: By Appointment',
      link: '#',
      linkText: 'Schedule Consultation'
    }
  ]

  const projectTypes = [
    'Complete Home Renovation',
    'Single Room Design',
    'Kitchen Remodel',
    'Bathroom Renovation',
    'Custom Furniture',
    'Consultation Only'
  ]

  const budgetRanges = [
    'Under ₹5,00,000',
    '₹5,00,000 - ₹10,00,000',
    '₹10,00,000 - ₹25,00,000',
    '₹25,00,000 - ₹50,00,000',
    'Over ₹50,00,000'
  ]

  const timelines = [
    'ASAP',
    'Within 1 month',
    '2-3 months',
    '4-6 months',
    '6+ months',
    'Just exploring'
  ]

  const onSubmit = async (data: ContactFormData) => {
    setServerError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        if (result.errors) {
          // Handle validation errors from server if any
          throw new Error(result.message || 'Form submission failed')
        } else {
          throw new Error(result.message || 'An unknown error occurred')
        }
      }
      
      // Success
      setFormResponseData(result.data)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
      setServerError(error instanceof Error ? error.message : 'Failed to submit form. Please try again.')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="container-elegant">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h2 className="section-heading">
            Start Your <span className="gradient-text">Luxury Journey</span>
          </h2>
          <p className="section-subtitle">
            Ready to transform your space? Our team of expert designers is here to bring your 
            vision to life. Schedule a consultation today and discover what's possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h3 className="font-heading text-2xl font-bold text-blue-900 mb-6">
                Let's Create Something Beautiful Together
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you're looking to redesign a single room or transform your entire home, 
                our team is ready to guide you through every step of the process. From initial 
                consultation to final installation, we ensure a seamless and enjoyable experience.
              </p>
            </motion.div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                      <info.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        {info.title}
                      </h4>
                      <p className="text-gray-600 text-sm whitespace-pre-line mb-3">
                        {info.content}
                      </p>
                      <a
                        href={info.link}
                        className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
                      >
                        {info.linkText} →
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-900 to-gray-800 rounded-xl p-6 text-white"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">24h</div>
                  <div className="text-sm text-gray-300">Response Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">500+</div>
                  <div className="text-sm text-gray-300">Projects Completed</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div>
                  <h3 className="font-heading text-xl font-bold text-blue-900 mb-6">
                    Tell Us About Your Project
                  </h3>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className={`form-input ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`form-input ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="form-input"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Project Type & Budget Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Type *
                    </label>
                    <select
                      {...register('projectType')}
                      className={`form-select ${errors.projectType ? 'border-red-500 bg-red-50' : ''}`}
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.projectType && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.projectType.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      {...register('budget')}
                      className="form-select"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((budget) => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Timeline
                  </label>
                  <select
                    {...register('timeline')}
                    className="form-select"
                  >
                    <option value="">When would you like to start?</option>
                    {timelines.map((timeline) => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tell us about your vision *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className={`form-input resize-none ${errors.message ? 'border-red-500 bg-red-50' : ''}`}
                    placeholder="Describe your dream space, style preferences, specific requirements..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-luxury disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message & Get Quote
                    </>
                  )}
                </button>

                {/* Server error message */}
                {serverError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <div>{serverError}</div>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to receive communications from us. 
                  We respect your privacy and will never share your information.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-blue-900 mb-4">
                  Thank You!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your message has been sent successfully. Our team will review your project 
                  details and get back to you within 24 hours with a personalized consultation proposal.
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-700">
                    📧 Confirmation email sent to: <strong>{getValues('email')}</strong>
                  </p>
                  {formResponseData && formResponseData.submissionId && (
                    <p className="text-sm text-green-700 mt-2">
                      🔖 Reference ID: <strong>{formResponseData.submissionId}</strong>
                    </p>
                  )}
                </div>
                
                {formResponseData && formResponseData.nextSteps && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                      {formResponseData.nextSteps.map((step: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormResponseData(null)
                    reset()
                  }}
                  className="btn-secondary"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}