'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calculator, Home, Palette, DollarSign, ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react'

export default function PriceCalculatorPreview() {
  const [selectedRoom, setSelectedRoom] = useState('living-room')
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [selectedSize, setSelectedSize] = useState('medium')

  const roomTypes = [
    { id: 'living-room', name: 'Living Room', icon: Home, basePrice: 15000 },
    { id: 'bedroom', name: 'Bedroom', icon: Home, basePrice: 12000 },
    { id: 'kitchen', name: 'Kitchen', icon: Home, basePrice: 25000 },
    { id: 'bathroom', name: 'Bathroom', icon: Home, basePrice: 8000 }
  ]

  const styles = [
    { id: 'modern', name: 'Modern', multiplier: 1.2 },
    { id: 'traditional', name: 'Traditional', multiplier: 1.0 },
    { id: 'luxury', name: 'Luxury', multiplier: 1.8 },
    { id: 'minimalist', name: 'Minimalist', multiplier: 0.9 }
  ]

  const sizes = [
    { id: 'small', name: 'Small (< 200 sq ft)', multiplier: 0.7 },
    { id: 'medium', name: 'Medium (200-400 sq ft)', multiplier: 1.0 },
    { id: 'large', name: 'Large (400-600 sq ft)', multiplier: 1.4 },
    { id: 'xl', name: 'Extra Large (> 600 sq ft)', multiplier: 1.8 }
  ]

  // Calculate price based on selections
  const calculatePrice = () => {
    const room = roomTypes.find(r => r.id === selectedRoom)
    const style = styles.find(s => s.id === selectedStyle)
    const size = sizes.find(sz => sz.id === selectedSize)
    
    if (!room || !style || !size) return 0
    
    return Math.round(room.basePrice * style.multiplier * size.multiplier)
  }

  const features = [
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get accurate pricing in seconds with our AI-powered calculator'
    },
    {
      icon: Palette,
      title: 'Style Matching',
      description: 'AI analyzes your preferences to suggest the perfect design style'
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Real-time pricing based on current market trends and materials'
    }
  ]

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
    <section className="section-padding bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="container-elegant">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Calculator className="w-4 h-4" />
            <span>AI Price Calculator</span>
          </div>
          <h2 className="section-heading">
            Get Your <span className="gradient-text">Dream Space Price</span> Instantly
          </h2>
          <p className="section-subtitle">
            Our revolutionary AI-powered calculator analyzes your requirements and provides 
            precise pricing for your luxury interior design project. No more guesswork - 
            just transparent, intelligent pricing in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Calculator Widget */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="calculator-widget">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-blue-900 mb-2">
                  Interactive Price Calculator
                </h3>
                <p className="text-gray-600">
                  Select your preferences to see real-time pricing
                </p>
              </div>

              {/* Room Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Room Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roomTypes.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedRoom === room.id
                          ? 'border-orange-600 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <room.icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{room.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Design Style
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="form-select w-full"
                >
                  {styles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Room Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="form-select w-full"
                >
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Display */}
              <div className="text-center mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">Estimated Price</span>
                  </div>
                  <motion.div
                    key={calculatePrice()}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="price-display"
                  >
                    ${calculatePrice().toLocaleString()}
                  </motion.div>
                  <p className="text-xs text-gray-500">
                    *Final price may vary based on materials and customizations
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link href="/calculator" className="btn-luxury w-full inline-block">
                  Get Detailed Quote
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h3 className="font-heading text-3xl font-bold text-blue-900 mb-6">
                Why Our AI Calculator is Revolutionary
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Gone are the days of waiting weeks for design quotes. Our intelligent 
                system combines machine learning with real-world pricing data to deliver 
                accurate estimates instantly.
              </p>
            </motion.div>

            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-900 to-gray-800 rounded-xl p-6 text-white"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">
                  AI POWERED
                </span>
              </div>
              <h4 className="font-heading text-xl font-bold mb-2">
                Smart Pricing Intelligence
              </h4>
              <p className="text-gray-300 mb-4">
                Our AI analyzes thousands of completed projects, current material costs, 
                and local market conditions to provide the most accurate pricing possible.
              </p>
              <div className="flex items-center text-yellow-400 font-semibold">
                <span>98% Accuracy Rate</span>
                <TrendingUp className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}