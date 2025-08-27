'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calculator, Home, Palette, IndianRupee, ArrowRight, Sparkles, Zap, TrendingUp, Check, Star, Download, Mail, Save, BarChart3 } from 'lucide-react'
import { formatINR, formatINRRange, PRICING_CONSTANTS } from '@/lib/currency'
import { QuotationFormData, QuotationCalculation, SavedQuotation } from '@/lib/types/quotation'
import { QuotationStorageService, createDefaultClientInfo } from '@/lib/services/quotation-storage'
import SaveQuotationModal from '@/components/modals/SaveQuotationModal'
import EmailShareModal from '@/components/modals/EmailShareModal'

export default function CalculatorPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    roomType: '',
    roomSize: '',
    style: '',
    budget: '',
    materials: '',
    furniture: [],
    timeline: '',
    special: ''
  })

  // Modal states
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [savedQuotations, setSavedQuotations] = useState<SavedQuotation[]>([])

  // Load saved quotations on component mount
  useEffect(() => {
    try {
      const quotations = QuotationStorageService.getSaved()
      setSavedQuotations(quotations)
    } catch (error) {
      console.error('Error loading saved quotations:', error)
    }
  }, [])

  const roomTypes = [
    { id: 'living-room', name: 'Living Room', icon: '🛋️', basePrice: PRICING_CONSTANTS.ROOM_PRICES.LIVING_ROOM, description: 'Complete living space transformation' },
    { id: 'bedroom', name: 'Master Bedroom', icon: '🛏️', basePrice: PRICING_CONSTANTS.ROOM_PRICES.BEDROOM, description: 'Luxurious bedroom retreat' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', basePrice: PRICING_CONSTANTS.ROOM_PRICES.KITCHEN, description: 'Gourmet kitchen renovation' },
    { id: 'bathroom', name: 'Bathroom', icon: '🛁', basePrice: PRICING_CONSTANTS.ROOM_PRICES.BATHROOM, description: 'Spa-like bathroom design' },
    { id: 'dining', name: 'Dining Room', icon: '🍽️', basePrice: PRICING_CONSTANTS.ROOM_PRICES.DINING, description: 'Elegant dining experience' },
    { id: 'office', name: 'Home Office', icon: '💻', basePrice: PRICING_CONSTANTS.ROOM_PRICES.OFFICE, description: 'Productive workspace design' },
    { id: 'whole-home', name: 'Whole Home', icon: '🏡', basePrice: PRICING_CONSTANTS.ROOM_PRICES.WHOLE_HOME, description: 'Complete home makeover' },
  ]

  const roomSizes = [
    { id: 'small', name: 'Small (< 200 sq ft)', multiplier: 0.7, icon: '📏' },
    { id: 'medium', name: 'Medium (200-400 sq ft)', multiplier: 1.0, icon: '📐' },
    { id: 'large', name: 'Large (400-600 sq ft)', multiplier: 1.4, icon: '📊' },
    { id: 'xl', name: 'Extra Large (> 600 sq ft)', multiplier: 1.8, icon: '🏠' }
  ]

  const styles = [
    { id: 'modern', name: 'Modern Luxury', multiplier: 1.3, icon: '✨', description: 'Clean lines, premium materials, cutting-edge design' },
    { id: 'traditional', name: 'Classic Traditional', multiplier: 1.1, icon: '🏛️', description: 'Timeless elegance with rich textures' },
    { id: 'contemporary', name: 'Contemporary Chic', multiplier: 1.2, icon: '🎨', description: 'Current trends with sophisticated touches' },
    { id: 'minimalist', name: 'Minimalist Zen', multiplier: 0.9, icon: '🪴', description: 'Less is more, premium simplicity' },
    { id: 'luxury', name: 'Ultra Luxury', multiplier: 2.1, icon: '💎', description: 'No expense spared, ultimate opulence' },
    { id: 'transitional', name: 'Transitional Blend', multiplier: 1.15, icon: '⚖️', description: 'Perfect balance of classic and modern' }
  ]

  const budgets = [
    { id: 'standard', name: 'Standard Premium', multiplier: 0.8, range: formatINRRange(PRICING_CONSTANTS.BUDGET_RANGES.STANDARD.min, PRICING_CONSTANTS.BUDGET_RANGES.STANDARD.max) },
    { id: 'luxury', name: 'Luxury Collection', multiplier: 1.0, range: formatINRRange(PRICING_CONSTANTS.BUDGET_RANGES.LUXURY.min, PRICING_CONSTANTS.BUDGET_RANGES.LUXURY.max) },
    { id: 'ultra', name: 'Ultra Luxury', multiplier: 1.5, range: formatINRRange(PRICING_CONSTANTS.BUDGET_RANGES.ULTRA.min, PRICING_CONSTANTS.BUDGET_RANGES.ULTRA.max) },
    { id: 'bespoke', name: 'Bespoke Excellence', multiplier: 2.0, range: formatINRRange(PRICING_CONSTANTS.BUDGET_RANGES.BESPOKE.min) }
  ]

  const materials = [
    { id: 'premium', name: 'Premium Materials', multiplier: 1.2, items: 'Italian marble, hardwood, designer fabrics' },
    { id: 'luxury', name: 'Luxury Materials', multiplier: 1.0, items: 'High-quality stone, engineered wood, premium textiles' },
    { id: 'standard', name: 'Standard Premium', multiplier: 0.8, items: 'Quality materials with excellent finishes' }
  ]

  const furnitureOptions = [
    { id: 'custom-sofas', name: 'Custom Sofas & Seating', price: PRICING_CONSTANTS.FURNITURE_PRICES.CUSTOM_SOFAS },
    { id: 'dining-set', name: 'Designer Dining Set', price: PRICING_CONSTANTS.FURNITURE_PRICES.DINING_SET },
    { id: 'bedroom-suite', name: 'Master Bedroom Suite', price: PRICING_CONSTANTS.FURNITURE_PRICES.BEDROOM_SUITE },
    { id: 'custom-storage', name: 'Built-in Storage Solutions', price: PRICING_CONSTANTS.FURNITURE_PRICES.CUSTOM_STORAGE },
    { id: 'lighting', name: 'Designer Lighting Package', price: PRICING_CONSTANTS.FURNITURE_PRICES.LIGHTING },
    { id: 'window-treatments', name: 'Custom Window Treatments', price: PRICING_CONSTANTS.FURNITURE_PRICES.WINDOW_TREATMENTS },
    { id: 'artwork', name: 'Curated Art Collection', price: PRICING_CONSTANTS.FURNITURE_PRICES.ARTWORK },
    { id: 'accessories', name: 'Luxury Accessories Package', price: PRICING_CONSTANTS.FURNITURE_PRICES.ACCESSORIES }
  ]

  const calculatePrice = () => {
    if (!formData.roomType || !formData.roomSize || !formData.style) return 0

    const room = roomTypes.find(r => r.id === formData.roomType)
    const size = roomSizes.find(s => s.id === formData.roomSize)
    const style = styles.find(st => st.id === formData.style)
    const budget = budgets.find(b => b.id === formData.budget) || { multiplier: 1.0 }
    const material = materials.find(m => m.id === formData.materials) || { multiplier: 1.0 }
    
    if (!room || !size || !style) return 0

    let basePrice = room.basePrice * size.multiplier * style.multiplier * budget.multiplier * material.multiplier
    
    // Add furniture costs
    const furnitureCost = formData.furniture.reduce((total, furnitureId) => {
      const furniture = furnitureOptions.find(f => f.id === furnitureId)
      return total + (furniture ? furniture.price : 0)
    }, 0)

    return Math.round(basePrice + furnitureCost)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFurnitureToggle = (furnitureId: string) => {
    setFormData(prev => ({
      ...prev,
      furniture: prev.furniture.includes(furnitureId)
        ? prev.furniture.filter(id => id !== furnitureId)
        : [...prev.furniture, furnitureId]
    }))
  }

  const nextStep = () => {
    if (step < 6) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const currentPrice = calculatePrice()

  // Generate complete quotation data
  const generateQuotationData = (): { formData: QuotationFormData, calculation: QuotationCalculation } => {
    const room = roomTypes.find(r => r.id === formData.roomType)
    const size = roomSizes.find(s => s.id === formData.roomSize)
    const style = styles.find(st => st.id === formData.style)
    const budget = budgets.find(b => b.id === formData.budget)
    const material = materials.find(m => m.id === formData.materials)
    
    const basePrice = room ? room.basePrice : 0
    const sizeMultiplier = size ? size.multiplier : 1
    const styleMultiplier = style ? style.multiplier : 1
    const budgetMultiplier = budget ? budget.multiplier : 1
    const materialMultiplier = material ? material.multiplier : 1
    
    const subtotal = basePrice * sizeMultiplier * styleMultiplier * budgetMultiplier * materialMultiplier
    
    const selectedFurniture = formData.furniture.map(id => {
      const furniture = furnitureOptions.find(f => f.id === id)
      return furniture ? { id: furniture.id, name: furniture.name, price: furniture.price } : null
    }).filter(Boolean) as Array<{ id: string, name: string, price: number }>
    
    const furnitureCost = selectedFurniture.reduce((sum, item) => sum + item.price, 0)
    const totalPrice = Math.round(subtotal + furnitureCost)
    
    const quotationFormData: QuotationFormData = {
      roomType: formData.roomType,
      roomSize: formData.roomSize,
      style: formData.style,
      budget: formData.budget,
      materials: formData.materials,
      furniture: formData.furniture,
      timeline: formData.timeline || '8-12 weeks',
      special: formData.special || ''
    }
    
    const calculation: QuotationCalculation = {
      basePrice,
      sizeMultiplier,
      styleMultiplier,
      budgetMultiplier,
      materialMultiplier,
      subtotal: Math.round(subtotal),
      selectedFurniture,
      furnitureCost,
      totalPrice
    }
    
    return { formData: quotationFormData, calculation }
  }

  // Handle PDF download - Backend implementation
  const handleDownloadPDF = async () => {
    try {
      const { formData: quotationFormData, calculation } = generateQuotationData()
      
      // TODO: Replace with actual backend API call to Spring Boot service
      // Example: POST /api/v1/quotations/pdf with quotation data
      // const response = await fetch('/api/quotations/pdf', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ formData: quotationFormData, calculation })
      // })
      // const blob = await response.blob()
      // const url = URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = url
      // link.download = `quotation-${Date.now()}.pdf`
      // link.click()
      // URL.revokeObjectURL(url)
      
      alert('PDF generation will be available once the backend service is implemented.')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  // Handle save quotation
  const handleSaveQuotation = (name: string, notes?: string) => {
    try {
      const { formData: quotationFormData, calculation } = generateQuotationData()
      const savedQuotation = QuotationStorageService.save(quotationFormData, calculation, name, notes)
      setSavedQuotations(prev => [savedQuotation, ...prev])
      setSaveModalOpen(false)
    } catch (error) {
      console.error('Error saving quotation:', error)
      throw error
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Header />
      
      <section className="section-padding">
        <div className="container-elegant">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center px-4 py-2 mb-4 space-x-2 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Price Calculator</span>
            </div>
            <h1 className="section-heading">
              Get Your <span className="gradient-text">Dream Space Price</span> in Minutes
            </h1>
            <p className="section-subtitle">
              Our intelligent calculator analyzes your preferences and provides accurate pricing 
              for your luxury interior design project. Answer a few questions to get started.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            
            {/* Progress & Price Display */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              {/* Progress Bar */}
              <div className="p-6 mb-6 bg-white shadow-lg rounded-2xl">
                <h3 className="mb-4 text-lg font-bold text-blue-900 font-heading">
                  Progress ({step}/6)
                </h3>
                <div className="w-full h-3 mb-4 bg-gray-200 rounded-full">
                  <div 
                    className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600"
                    style={{ width: `${(step / 6) * 100}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { step: 1, name: 'Room Selection' },
                    { step: 2, name: 'Size & Layout' },
                    { step: 3, name: 'Design Style' },
                    { step: 4, name: 'Budget Range' },
                    { step: 5, name: 'Materials & Finishes' },
                    { step: 6, name: 'Furniture Selection' }
                  ].map((item) => (
                    <div 
                      key={item.step}
                      className={`flex items-center space-x-2 ${
                        step >= item.step ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {step > item.step ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-current rounded-full" />
                      )}
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div className="sticky p-6 text-white bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl top-24">
                <div className="mb-4 text-center">
                  <div className="flex items-center justify-center mb-2 space-x-2">
                    <IndianRupee className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-300">Live Estimate</span>
                  </div>
                  <motion.div
                    key={currentPrice}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-2 text-4xl font-bold text-yellow-400 font-accent"
                  >
                    {formatINR(currentPrice)}
                  </motion.div>
                  <p className="text-xs text-gray-400">
                    *Final price may vary based on customizations
                  </p>
                </div>

                {currentPrice > 0 && (
                  <div className="pt-4 border-t border-gray-600">
                    <div className="flex items-center mb-3 space-x-2 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">Premium Package Includes:</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-300">
                      <div>✓ 3D Design Visualization</div>
                      <div>✓ Professional Installation</div>
                      <div>✓ Premium Material Selection</div>
                      <div>✓ 1-Year Warranty</div>
                      <div>✓ Dedicated Project Manager</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Calculator Steps */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="p-8 bg-white shadow-lg rounded-2xl">
                
                {/* Step 1: Room Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="mb-2 text-2xl font-bold text-blue-900 font-heading">
                        What space are you transforming?
                      </h2>
                      <p className="text-gray-600">
                        Select the room type to get started with your personalized estimate.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {roomTypes.map((room) => (
                        <motion.button
                          key={room.id}
                          variants={itemVariants}
                          onClick={() => handleInputChange('roomType', room.id)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                            formData.roomType === room.id
                              ? 'border-orange-600 bg-orange-50 text-orange-600'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="mb-3 text-3xl">{room.icon}</div>
                          <h3 className="mb-1 font-semibold">{room.name}</h3>
                          <p className="mb-2 text-sm opacity-75">{room.description}</p>
                          <div className="text-sm font-semibold">
                            From {formatINR(room.basePrice)}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Room Size */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="mb-2 text-2xl font-bold text-blue-900 font-heading">
                        What's the size of your space?
                      </h2>
                      <p className="text-gray-600">
                        The room size helps us calculate materials and labor accurately.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {roomSizes.map((size) => (
                        <motion.button
                          key={size.id}
                          variants={itemVariants}
                          onClick={() => handleInputChange('roomSize', size.id)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                            formData.roomSize === size.id
                              ? 'border-orange-600 bg-orange-50 text-orange-600'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center mb-3 space-x-3">
                            <div className="text-2xl">{size.icon}</div>
                            <h3 className="font-semibold">{size.name}</h3>
                          </div>
                          <div className="text-sm">
                            Price multiplier: {size.multiplier}x
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Design Style */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="mb-2 text-2xl font-bold text-blue-900 font-heading">
                        What's your design style?
                      </h2>
                      <p className="text-gray-600">
                        Your style preference determines the materials, finishes, and overall aesthetic.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {styles.map((style) => (
                        <motion.button
                          key={style.id}
                          variants={itemVariants}
                          onClick={() => handleInputChange('style', style.id)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                            formData.style === style.id
                              ? 'border-orange-600 bg-orange-50 text-orange-600'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center mb-3 space-x-3">
                            <div className="text-2xl">{style.icon}</div>
                            <h3 className="font-semibold">{style.name}</h3>
                          </div>
                          <p className="mb-2 text-sm opacity-75">{style.description}</p>
                          <div className="text-sm font-medium">
                            {style.multiplier}x base price
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Budget Range */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="mb-2 text-2xl font-bold text-blue-900 font-heading">
                        What's your budget range?
                      </h2>
                      <p className="text-gray-600">
                        This helps us recommend the right level of finishes and customizations.
                      </p>
                    </motion.div>

                    <div className="space-y-4">
                      {budgets.map((budget) => (
                        <motion.button
                          key={budget.id}
                          variants={itemVariants}
                          onClick={() => handleInputChange('budget', budget.id)}
                          className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                            formData.budget === budget.id
                              ? 'border-orange-600 bg-orange-50 text-orange-600'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="mb-1 font-semibold">{budget.name}</h3>
                              <div className="text-sm font-medium">{budget.range}</div>
                            </div>
                            <div className="text-sm">
                              {budget.multiplier}x multiplier
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Materials */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="mb-2 text-2xl font-bold text-blue-900 font-heading">
                        Choose your materials & finishes
                      </h2>
                      <p className="text-gray-600">
                        Select the quality level that matches your vision and budget.
                      </p>
                    </motion.div>

                    <div className="space-y-4">
                      {materials.map((material) => (
                        <motion.button
                          key={material.id}
                          variants={itemVariants}
                          onClick={() => handleInputChange('materials', material.id)}
                          className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                            formData.materials === material.id
                              ? 'border-orange-600 bg-orange-50 text-orange-600'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{material.name}</h3>
                            <div className="text-sm font-medium">
                              {material.multiplier}x
                            </div>
                          </div>
                          <p className="text-sm opacity-75">{material.items}</p>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Furniture Selection */}
                {step === 6 && (
                  <motion.div
                    key="step6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="mb-2 text-2xl font-bold text-blue-900 font-heading">
                        Select additional furniture & accessories
                      </h2>
                      <p className="text-gray-600">
                        Choose from our curated collection of luxury furniture and accessories. (Optional)
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {furnitureOptions.map((furniture) => (
                        <motion.button
                          key={furniture.id}
                          variants={itemVariants}
                          onClick={() => handleFurnitureToggle(furniture.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                            formData.furniture.includes(furniture.id)
                              ? 'border-orange-600 bg-orange-50 text-orange-600'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">{furniture.name}</h3>
                            <div className="text-sm font-bold">
                              +${furniture.price.toLocaleString()}
                            </div>
                          </div>
                          {formData.furniture.includes(furniture.id) && (
                            <div className="flex items-center text-xs text-green-600">
                              <Check className="w-3 h-3 mr-1" />
                              Added to estimate
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 mt-12 border-t">
                  <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {step < 6 ? (
                    <button
                      onClick={nextStep}
                      disabled={
                        (step === 1 && !formData.roomType) ||
                        (step === 2 && !formData.roomSize) ||
                        (step === 3 && !formData.style)
                      }
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {/* Final Quotation Summary */}
                      <div className="p-6 mb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                        <div className="text-center">
                          <h3 className="mb-2 text-xl font-bold text-primary-navy">
                            🎉 Your Interior Design Quote is Ready!
                          </h3>
                          <div className="mb-2 text-3xl font-bold text-accent-warm">
                            {formatINR(currentPrice)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Complete design solution for your {formData.roomType?.replace('-', ' ')} space
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <button
                          onClick={handleDownloadPDF}
                          disabled={!currentPrice}
                          className="btn-secondary disabled:opacity-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </button>
                        
                        <button
                          onClick={() => setEmailModalOpen(true)}
                          disabled={!currentPrice}
                          className="btn-primary disabled:opacity-50"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email Quote
                        </button>
                        
                        <button
                          onClick={() => setSaveModalOpen(true)}
                          disabled={!currentPrice}
                          className="btn-luxury disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Quote
                        </button>
                        
                        <Link
                          href="/comparison"
                          className="btn-secondary "
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Compare ({savedQuotations.length})
                        </Link>
                      </div>

                      {/* Saved Quotations Preview */}
                      {savedQuotations.length > 0 && (
                        <div className="p-4 mt-6 rounded-lg bg-gray-50">
                          <h4 className="mb-3 font-semibold text-gray-800">
                            Your Saved Quotations ({savedQuotations.length})
                          </h4>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {savedQuotations.slice(0, 4).map((quotation) => (
                              <div key={quotation.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {quotation.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatINR(quotation.calculation.totalPrice)}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Intl.DateTimeFormat('en-IN').format(quotation.timestamp)}
                                </div>
                              </div>
                            ))}
                          </div>
                          {savedQuotations.length > 4 && (
                            <Link href="/comparison" className="block mt-2 text-sm font-medium text-accent-gold hover:underline">
                              View all {savedQuotations.length} saved quotations →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-3"
          >
            {[
              {
                icon: Zap,
                title: 'Instant Results',
                description: 'Get accurate pricing in real-time as you make selections'
              },
              {
                icon: Palette,
                title: 'AI-Powered Accuracy',
                description: 'Our algorithm considers thousands of completed projects'
              },
              {
                icon: TrendingUp,
                title: 'Live Market Data',
                description: 'Pricing reflects current material costs and trends'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 text-center bg-white shadow-lg rounded-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="mb-2 font-semibold text-blue-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
      
      {/* Modals */}
      {step === 6 && currentPrice > 0 && (
        <>
          <SaveQuotationModal
            isOpen={saveModalOpen}
            onClose={() => setSaveModalOpen(false)}
            formData={generateQuotationData().formData}
            calculation={generateQuotationData().calculation}
            onSaveSuccess={(quotationId) => {
              const savedQuotations = QuotationStorageService.getSaved()
              setSavedQuotations(savedQuotations)
            }}
          />
          
          <EmailShareModal
            isOpen={emailModalOpen}
            onClose={() => setEmailModalOpen(false)}
            quotation={(() => {
              const data = generateQuotationData()
              return {
                id: `temp-${Date.now()}`,
                name: 'Current Quotation',
                timestamp: new Date(),
                formData: data.formData,
                calculation: data.calculation,
                clientInfo: createDefaultClientInfo(),
                status: 'draft' as const,
                notes: undefined
              }
            })()}
          />
        </>
      )}
    </div>
  )
}
