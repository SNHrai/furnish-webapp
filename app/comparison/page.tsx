'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  Award, 
  AlertCircle,
  CheckCircle,
  X,
  FileText,
  Calendar,
  Home,
  Palette,
  Package,
  DollarSign,
  Download,
  Share
} from 'lucide-react'
import { SavedQuotation } from '@/lib/types/quotation'
import { QuotationStorageService } from '@/lib/services/quotation-storage'
import { QuotationComparisonService } from '@/lib/services/quotation-comparison'
import { formatINR } from '@/lib/currency'

export default function ComparisonPage() {
  const [savedQuotations, setSavedQuotations] = useState<SavedQuotation[]>([])
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [comparison, setComparison] = useState<any>(null)

  // Load saved quotations on component mount
  useEffect(() => {
    try {
      const quotations = QuotationStorageService.getSaved()
      setSavedQuotations(quotations)
    } catch (error) {
      console.error('Error loading saved quotations:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update comparison when selected quotations change
  useEffect(() => {
    if (selectedQuotations.length >= 2) {
      const quotationsToCompare = savedQuotations.filter(q => selectedQuotations.includes(q.id))
      try {
        const comparisonResult = QuotationComparisonService.compareQuotations(quotationsToCompare)
        setComparison(comparisonResult)
      } catch (error) {
        console.error('Error comparing quotations:', error)
        setComparison(null)
      }
    } else {
      setComparison(null)
    }
  }, [selectedQuotations, savedQuotations])

  // Handle quotation selection
  const handleQuotationToggle = (quotationId: string) => {
    setSelectedQuotations(prev => {
      if (prev.includes(quotationId)) {
        return prev.filter(id => id !== quotationId)
      } else {
        // Limit to maximum 4 quotations for comparison
        if (prev.length >= 4) {
          return [...prev.slice(1), quotationId] // Remove first, add new
        }
        return [...prev, quotationId]
      }
    })
  }

  // Get comparison matrix
  const comparisonMatrix = comparison ? QuotationComparisonService.getComparisonMatrix(comparison.quotations) : null

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container-elegant section-padding">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your saved quotations...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="section-padding bg-gradient-to-br from-accent-cream via-white to-light-gray">
        <div className="container-elegant">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <BarChart3 className="w-4 h-4" />
              <span>Quotation Comparison</span>
            </div>
            <h1 className="hero-text mb-6">
              Compare Your <span className="gradient-text">Design Quotations</span>
            </h1>
            <p className="text-xl text-primary-charcoal leading-relaxed max-w-3xl mx-auto mb-8">
              Analyze and compare your saved quotations side-by-side to make informed decisions 
              about your interior design project. Find the perfect balance of price, style, and features.
            </p>
            <Link href="/calculator" className="btn-secondary mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calculator
            </Link>
            <Link href="#saved-quotations" className="btn-luxury">
              <FileText className="w-4 h-4 mr-2" />
              View Saved Quotations
            </Link>
          </motion.div>

          {/* No Quotations State */}
          {savedQuotations.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16"
            >
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Saved Quotations</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You don't have any saved quotations yet. Create some quotations using our AI calculator to start comparing.
              </p>
              <Link href="/calculator" className="btn-luxury">
                Create Your First Quotation
              </Link>
            </motion.div>
          )}

          {/* Few Quotations State */}
          {savedQuotations.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16"
            >
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Need More Quotations</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You need at least 2 saved quotations to use the comparison feature. Create more quotations to compare different options.
              </p>
              <Link href="/calculator" className="btn-luxury">
                Create Another Quotation
              </Link>
            </motion.div>
          )}

          {/* Quotation Selection */}
          {savedQuotations.length >= 2 && (
            <div id="saved-quotations">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mb-16"
              >
                <motion.h2 variants={itemVariants} className="text-3xl font-heading font-bold text-primary-navy mb-4 text-center">
                  Select Quotations to Compare
                </motion.h2>
                <motion.p variants={itemVariants} className="text-center text-gray-600 mb-8">
                  Choose 2-4 quotations to compare side-by-side. Selected: {selectedQuotations.length}/4
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedQuotations.map((quotation, index) => (
                    <motion.div
                      key={quotation.id}
                      variants={itemVariants}
                      className={`card-elegant p-6 cursor-pointer transition-all duration-300 ${
                        selectedQuotations.includes(quotation.id)
                          ? 'ring-2 ring-accent-gold bg-accent-cream'
                          : 'hover:shadow-luxury'
                      }`}
                      onClick={() => handleQuotationToggle(quotation.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-primary-navy mb-2">{quotation.name}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Intl.DateTimeFormat('en-IN').format(quotation.timestamp)}
                          </div>
                        </div>
                        <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                          selectedQuotations.includes(quotation.id)
                            ? 'bg-accent-gold border-accent-gold'
                            : 'border-gray-300'
                        }`}>
                          {selectedQuotations.includes(quotation.id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Price:</span>
                          <span className="font-bold text-accent-warm">{formatINR(quotation.calculation.totalPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Room:</span>
                          <span className="text-sm capitalize">{quotation.formData.roomType.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Style:</span>
                          <span className="text-sm capitalize">{quotation.formData.style}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            quotation.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                            quotation.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                            quotation.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {quotation.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Comparison Results */}
          <AnimatePresence>
            {comparison && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="space-y-12"
              >
                {/* Insights Summary */}
                <div className="bg-gradient-to-r from-primary-navy to-primary-charcoal rounded-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-6">Comparison Insights</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <TrendingDown className="w-8 h-8 text-accent-sage mx-auto mb-2" />
                      <div className="text-2xl font-bold text-accent-sage mb-1">
                        {formatINR(comparison.insights.lowestPrice.calculation.totalPrice)}
                      </div>
                      <div className="text-sm text-gray-300">Lowest Price</div>
                      <div className="text-xs text-gray-400 mt-1">{comparison.insights.lowestPrice.name}</div>
                    </div>
                    
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-400 mb-1">
                        {formatINR(comparison.insights.highestPrice.calculation.totalPrice)}
                      </div>
                      <div className="text-sm text-gray-300">Highest Price</div>
                      <div className="text-xs text-gray-400 mt-1">{comparison.insights.highestPrice.name}</div>
                    </div>
                    
                    <div className="text-center">
                      <Award className="w-8 h-8 text-accent-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-accent-gold mb-1">Recommended</div>
                      <div className="text-sm text-gray-300">{comparison.insights.recommendedOption.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatINR(comparison.insights.recommendedOption.calculation.totalPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <p className="text-sm leading-relaxed">
                      {QuotationComparisonService.generateComparisonSummary(comparison)}
                    </p>
                  </div>
                </div>

                {/* Detailed Comparison Table */}
                {comparisonMatrix && (
                  <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-primary-navy">Detailed Comparison</h3>
                      <p className="text-gray-600 mt-1">Side-by-side comparison of all attributes</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-light-gray">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-primary-navy">Attribute</th>
                            {comparison.quotations.map((quotation: SavedQuotation) => (
                              <th key={quotation.id} className="px-6 py-4 text-center text-sm font-semibold text-primary-navy min-w-[150px]">
                                <div className="truncate">{quotation.name}</div>
                                <div className="text-xs text-gray-500 font-normal mt-1">
                                  {quotation.id.substring(0, 8).toUpperCase()}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonMatrix.map((row: any, rowIndex: number) => (
                            <tr key={row.key} className={`border-b border-gray-100 ${row.hasDifferences ? 'bg-yellow-50' : ''}`}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center">
                                {row.key === 'totalPrice' && <DollarSign className="w-4 h-4 mr-2 text-accent-warm" />}
                                {row.key === 'roomType' && <Home className="w-4 h-4 mr-2 text-blue-600" />}
                                {row.key === 'style' && <Palette className="w-4 h-4 mr-2 text-purple-600" />}
                                {row.key === 'furnitureCount' && <Package className="w-4 h-4 mr-2 text-green-600" />}
                                {row.label}
                                {row.hasDifferences && (
                                  <span className="ml-2 w-2 h-2 bg-yellow-500 rounded-full" title="Differences found"></span>
                                )}
                              </td>
                              {row.values.map((valueObj: any, cellIndex: number) => {
                                const isRecommended = comparison.insights.recommendedOption.id === valueObj.quotation.id
                                const isLowestPrice = row.key === 'totalPrice' && valueObj.quotation.id === comparison.insights.lowestPrice.id
                                const isHighestPrice = row.key === 'totalPrice' && valueObj.quotation.id === comparison.insights.highestPrice.id
                                
                                return (
                                  <td key={valueObj.quotation.id} className={`px-6 py-4 text-sm text-center ${
                                    isRecommended ? 'bg-accent-gold bg-opacity-10' : ''
                                  }`}>
                                    <div className={`${
                                      isLowestPrice ? 'text-green-600 font-semibold' :
                                      isHighestPrice ? 'text-red-600 font-semibold' :
                                      'text-gray-900'
                                    }`}>
                                      {QuotationComparisonService.formatAttributeValue(valueObj.value, row.format)}
                                    </div>
                                    {isRecommended && (
                                      <div className="text-xs text-accent-gold font-medium mt-1">⭐ RECOMMENDED</div>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setSelectedQuotations([])}
                    className="btn-secondary"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Selection
                  </button>
                  <button className="btn-primary">
                    <Download className="w-4 h-4 mr-2" />
                    Export Comparison
                  </button>
                  <button className="btn-luxury">
                    <Share className="w-4 h-4 mr-2" />
                    Share Comparison
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  )
}
