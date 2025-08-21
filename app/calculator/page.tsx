'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calculator, Home, Palette, DollarSign, ArrowRight, Sparkles, Zap, TrendingUp, Check, Star } from 'lucide-react'

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

  const roomTypes = [
    { id: 'living-room', name: 'Living Room', icon: '🛋️', basePrice: 15000, description: 'Complete living space transformation' },
    { id: 'bedroom', name: 'Master Bedroom', icon: '🛏️', basePrice: 12000, description: 'Luxurious bedroom retreat' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', basePrice: 25000, description: 'Gourmet kitchen renovation' },
    { id: 'bathroom', name: 'Bathroom', icon: '🛁', basePrice: 18000, description: 'Spa-like bathroom design' },
    { id: 'dining', name: 'Dining Room', icon: '🍽️', basePrice: 10000, description: 'Elegant dining experience' },
    { id: 'office', name: 'Home Office', icon: '💻', basePrice: 8000, description: 'Productive workspace design' },
    { id: 'whole-home', name: 'Whole Home', icon: '🏡', basePrice: 80000, description: 'Complete home makeover' },
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
    { id: 'standard', name: 'Standard Premium', multiplier: 0.8, range: '$15K - $40K' },
    { id: 'luxury', name: 'Luxury Collection', multiplier: 1.0, range: '$40K - $80K' },
    { id: 'ultra', name: 'Ultra Luxury', multiplier: 1.5, range: '$80K - $150K' },
    { id: 'bespoke', name: 'Bespoke Excellence', multiplier: 2.0, range: '$150K+' }
  ]

  const materials = [
    { id: 'premium', name: 'Premium Materials', multiplier: 1.2, items: 'Italian marble, hardwood, designer fabrics' },
    { id: 'luxury', name: 'Luxury Materials', multiplier: 1.0, items: 'High-quality stone, engineered wood, premium textiles' },
    { id: 'standard', name: 'Standard Premium', multiplier: 0.8, items: 'Quality materials with excellent finishes' }
  ]

  const furnitureOptions = [
    { id: 'custom-sofas', name: 'Custom Sofas & Seating', price: 8000 },
    { id: 'dining-set', name: 'Designer Dining Set', price: 6000 },
    { id: 'bedroom-suite', name: 'Master Bedroom Suite', price: 12000 },
    { id: 'custom-storage', name: 'Built-in Storage Solutions', price: 7000 },
    { id: 'lighting', name: 'Designer Lighting Package', price: 4000 },
    { id: 'window-treatments', name: 'Custom Window Treatments', price: 3000 },
    { id: 'artwork', name: 'Curated Art Collection', price: 5000 },
    { id: 'accessories', name: 'Luxury Accessories Package', price: 2500 }
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
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Progress & Price Display */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              {/* Progress Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="font-heading text-lg font-bold text-blue-900 mb-4">
                  Progress ({step}/6)
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 h-3 rounded-full transition-all duration-500"
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
                        <div className="w-4 h-4 rounded-full border-2 border-current" />
                      )}
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl p-6 text-white sticky top-24">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-300">Live Estimate</span>
                  </div>
                  <motion.div
                    key={currentPrice}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold font-accent text-yellow-400 mb-2"
                  >
                    ${currentPrice.toLocaleString()}
                  </motion.div>
                  <p className="text-xs text-gray-400">
                    *Final price may vary based on customizations
                  </p>
                </div>

                {currentPrice > 0 && (
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex items-center space-x-2 text-yellow-400 mb-3">
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
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                
                {/* Step 1: Room Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="font-heading text-2xl font-bold text-blue-900 mb-2">
                        What space are you transforming?
                      </h2>
                      <p className="text-gray-600">
                        Select the room type to get started with your personalized estimate.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          <div className="text-3xl mb-3">{room.icon}</div>
                          <h3 className="font-semibold mb-1">{room.name}</h3>
                          <p className="text-sm opacity-75 mb-2">{room.description}</p>
                          <div className="text-sm font-semibold">
                            From ${room.basePrice.toLocaleString()}
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
                      <h2 className="font-heading text-2xl font-bold text-blue-900 mb-2">
                        What's the size of your space?
                      </h2>
                      <p className="text-gray-600">
                        The room size helps us calculate materials and labor accurately.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <div className="flex items-center space-x-3 mb-3">
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
                      <h2 className="font-heading text-2xl font-bold text-blue-900 mb-2">
                        What's your design style?
                      </h2>
                      <p className="text-gray-600">
                        Your style preference determines the materials, finishes, and overall aesthetic.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">{style.icon}</div>
                            <h3 className="font-semibold">{style.name}</h3>
                          </div>
                          <p className="text-sm opacity-75 mb-2">{style.description}</p>
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
                      <h2 className="font-heading text-2xl font-bold text-blue-900 mb-2">
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
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold mb-1">{budget.name}</h3>
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
                      <h2 className="font-heading text-2xl font-bold text-blue-900 mb-2">
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
                          <div className="flex justify-between items-start mb-2">
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
                      <h2 className="font-heading text-2xl font-bold text-blue-900 mb-2">
                        Select additional furniture & accessories
                      </h2>
                      <p className="text-gray-600">
                        Choose from our curated collection of luxury furniture and accessories. (Optional)
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-sm">{furniture.name}</h3>
                            <div className="text-sm font-bold">
                              +${furniture.price.toLocaleString()}
                            </div>
                          </div>
                          {formData.furniture.includes(furniture.id) && (
                            <div className="flex items-center text-green-600 text-xs">
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
                <div className="flex justify-between items-center mt-12 pt-6 border-t">
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
                    <div className="flex space-x-4">
                      <button className="btn-secondary">
                        Download Estimate
                      </button>
                      <button className="btn-luxury">
                        Schedule Consultation
                      </button>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
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
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}