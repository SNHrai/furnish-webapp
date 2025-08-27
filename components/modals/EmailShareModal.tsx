'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { SavedQuotation, EmailQuotationData } from '@/lib/types/quotation'
import { EmailService } from '@/lib/services/email-service'
import { formatINR } from '@/lib/currency'

interface EmailShareModalProps {
  isOpen: boolean
  onClose: () => void
  quotation: SavedQuotation
}

const EmailShareModal: React.FC<EmailShareModalProps> = ({
  isOpen,
  onClose,
  quotation
}) => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    recipientName: '',
    subject: `Interior Design Quotation - ${quotation?.name}`,
    message: `Hello,\n\nPlease find attached your personalized interior design quotation for ${quotation.name}. This comprehensive quote includes all specifications, pricing details, and terms.\n\nWe're excited to help transform your space into something extraordinary.\n\nBest regards,\nElegant Home Team`
  })

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error'
    message: string
  }>({ type: 'idle', message: '' })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Email address is required'
    } else if (!EmailService.validateEmail(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email address'
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setStatus({ type: 'loading', message: 'Sending email...' })

    try {
      const emailData: EmailQuotationData = {
        recipientEmail: formData.recipientEmail,
        recipientName: formData.recipientName,
        senderName: 'Elegant Home',
        subject: formData.subject,
        message: formData.message,
        quotation,
        includeAttachment: true
      }

      // Use mock email service for demo (replace with real service in production)
      const result = await EmailService.sendQuotationMock(emailData)

      if (result.success) {
        setStatus({ type: 'success', message: result.message })
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          onClose()
          resetForm()
        }, 3000)
      } else {
        setStatus({ type: 'error', message: result.message })
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setStatus({ type: 'error', message: 'Failed to send email. Please try again.' })
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      recipientEmail: '',
      recipientName: '',
      subject: `Interior Design Quotation - ${quotation?.name || ''}`,
      message: `Hello,

Please find attached your personalized interior design quotation for ${quotation?.name || 'your project'}. This comprehensive quote includes all specifications, pricing details, and terms.

We're excited to help transform your space into something extraordinary.

Best regards,
Elegant Home Team`
    })
    setStatus({ type: 'idle', message: '' })
    setErrors({})
  }


  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && status.type !== 'loading' && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-luxury"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-gray-800 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Share Quotation via Email</h2>
                  <p className="text-sm opacity-90">Send quotation to client or colleague</p>
                </div>
              </div>
              {status.type !== 'loading' && (
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Quotation Summary */}
              <div className="bg-gradient-to-r from-accent-cream to-light-gray rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-primary-navy mb-2">Quotation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Project:</span>
                    <span className="ml-2 font-medium">{quotation.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ID:</span>
                    <span className="ml-2 font-mono text-xs">{quotation.id.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-2 font-bold text-accent-warm">{formatINR(quotation.calculation.totalPrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2">{new Intl.DateTimeFormat('en-IN').format(quotation.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {status.type !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`rounded-xl p-4 mb-6 flex items-center space-x-3 ${status.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : status.type === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                  >
                    {status.type === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                    {status.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {status.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium">{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Form */}
              {status.type !== 'success' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Recipient Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      value={formData.recipientEmail}
                      onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                      className={`form-input ${errors.recipientEmail ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="client@example.com"
                      disabled={status.type === 'loading'}
                    />
                    {errors.recipientEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.recipientEmail}</p>
                    )}
                  </div>

                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => handleInputChange('recipientName', e.target.value)}
                      className={`form-input ${errors.recipientName ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="John Doe"
                      disabled={status.type === 'loading'}
                    />
                    {errors.recipientName && (
                      <p className="text-red-500 text-xs mt-1">{errors.recipientName}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className={`form-input ${errors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                      disabled={status.type === 'loading'}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`form-input min-h-[120px] resize-y ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                      disabled={status.type === 'loading'}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={status.type === 'loading'}
                      className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status.type === 'loading'}
                      className="btn-luxury flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status.type === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Success State */}
              {status.type === 'success' && (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Email Sent Successfully!</h3>
                  <p className="text-gray-600 mb-4">
                    The quotation has been sent to {formData.recipientEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    This window will close automatically in a few seconds.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EmailShareModal
