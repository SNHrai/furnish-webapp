'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react'
import { QuotationFormData, QuotationCalculation } from '@/lib/types/quotation'
import { QuotationStorageService, generateQuotationId, createDefaultClientInfo } from '@/lib/services/quotation-storage'
import { formatINR } from '@/lib/currency'

interface SaveQuotationModalProps {
  isOpen: boolean
  onClose: () => void
  formData: QuotationFormData
  calculation: QuotationCalculation
  onSaveSuccess?: (quotationId: string) => void
}

const SaveQuotationModal: React.FC<SaveQuotationModalProps> = ({
  isOpen,
  onClose,
  formData,
  calculation,
  onSaveSuccess
}) => {
  const [quotationName, setQuotationName] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error'
    message: string
  }>({ type: 'idle', message: '' })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!quotationName.trim()) {
      newErrors.quotationName = 'Quotation name is required'
    } else if (quotationName.trim().length < 3) {
      newErrors.quotationName = 'Quotation name must be at least 3 characters long'
    } else if (quotationName.trim().length > 50) {
      newErrors.quotationName = 'Quotation name must be less than 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setStatus({ type: 'loading', message: 'Saving quotation...' })

    try {
      // Save to localStorage
      const savedQuotation = QuotationStorageService.save(formData, calculation, quotationName.trim(), notes.trim() || undefined)

      setStatus({ type: 'success', message: 'Quotation saved successfully!' })
      
      // Call success callback if provided
      if (onSaveSuccess) {
        onSaveSuccess(savedQuotation.id)
      }

      // Auto-close modal after 2 seconds
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error) {
      console.error('Error saving quotation:', error)
      setStatus({ type: 'error', message: 'Failed to save quotation. Please try again.' })
    }
  }

  // Reset form
  const resetForm = () => {
    setQuotationName('')
    setNotes('')
    setStatus({ type: 'idle', message: '' })
    setErrors({})
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    if (field === 'quotationName') {
      setQuotationName(value)
    } else if (field === 'notes') {
      setNotes(value)
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Generate suggested name based on form data
  const generateSuggestedName = () => {
    const roomTypeLabels: { [key: string]: string } = {
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'kitchen': 'Kitchen',
      'bathroom': 'Bathroom',
      'dining': 'Dining Room',
      'office': 'Home Office',
      'whole-home': 'Whole Home'
    }

    const styleLabels: { [key: string]: string } = {
      'modern': 'Modern',
      'traditional': 'Traditional',
      'contemporary': 'Contemporary',
      'minimalist': 'Minimalist',
      'luxury': 'Luxury',
      'transitional': 'Transitional'
    }

    const roomLabel = roomTypeLabels[formData.roomType] || formData.roomType
    const styleLabel = styleLabels[formData.style] || formData.style
    
    return `${roomLabel} - ${styleLabel} Design`
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
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-luxury"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-accent-gold to-accent-warm text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Save className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Save Quotation</h2>
                  <p className="text-sm opacity-90">Save to your profile for future reference</p>
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

            <div className="p-6">
              {/* Quotation Summary */}
              <div className="bg-gradient-to-r from-accent-cream to-light-gray rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-primary-navy mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Quotation Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-accent-warm">{formatINR(calculation.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="capitalize">{formData.roomType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Design Style:</span>
                    <span className="capitalize">{formData.style}</span>
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
                    className={`rounded-xl p-4 mb-6 flex items-center space-x-3 ${
                      status.type === 'success' 
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

              {/* Save Form */}
              {status.type !== 'success' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Quotation Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quotation Name *
                    </label>
                    <input
                      type="text"
                      value={quotationName}
                      onChange={(e) => handleInputChange('quotationName', e.target.value)}
                      className={`form-input ${errors.quotationName ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder={generateSuggestedName()}
                      disabled={status.type === 'loading'}
                      maxLength={50}
                    />
                    {errors.quotationName && (
                      <p className="text-red-500 text-xs mt-1">{errors.quotationName}</p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <button
                        type="button"
                        onClick={() => setQuotationName(generateSuggestedName())}
                        className="text-xs text-accent-warm hover:text-accent-gold transition-colors"
                        disabled={status.type === 'loading'}
                      >
                        Use suggested name
                      </button>
                      <span className="text-xs text-gray-400">{quotationName.length}/50</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="form-input min-h-[80px] resize-y"
                      placeholder="Add any additional notes or comments about this quotation..."
                      disabled={status.type === 'loading'}
                      maxLength={500}
                    />
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-400">{notes.length}/500</span>
                    </div>
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
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Quotation
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
                  <h3 className="text-xl font-bold text-green-800 mb-2">Quotation Saved!</h3>
                  <p className="text-gray-600 mb-4">
                    Your quotation "{quotationName}" has been saved successfully.
                  </p>
                  <p className="text-sm text-gray-500">
                    You can access it from your saved quotations list.
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

export default SaveQuotationModal
