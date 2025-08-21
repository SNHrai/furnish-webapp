'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, DollarSign, Sparkles, TrendingUp } from 'lucide-react'

export default function BeforeAfterSection() {
  const [activeTransformation, setActiveTransformation] = useState(0)

  const transformations = [
    {
      id: 1,
      title: 'Manhattan Penthouse',
      category: 'Complete Renovation',
      timeline: '4 months',
      investment: '$180,000',
      beforeImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwwfHx8fDE3NTU3ODM4Njd8MA&ixlib=rb-4.1.0&q=85&w=600&h=400',
      afterImage: 'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwwfHx8YmxhY2t8MTc1NTc3OTU3NHww&ixlib=rb-4.1.0&q=85&w=600&h=400',
      description: 'Transformed from dated 90s interior to contemporary luxury masterpiece with custom furnishings and smart home integration.',
      features: ['Smart Home Integration', 'Custom Millwork', 'Italian Marble', 'Designer Lighting'],
      roi: '145%'
    },
    {
      id: 2,
      title: 'Brooklyn Townhouse',
      category: 'Kitchen Renovation',
      timeline: '6 weeks',
      investment: '$85,000',
      beforeImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBraXRjaGVufGVufDB8fHx8MTc1NTc4MzkwNHww&ixlib=rb-4.1.0&q=85&w=600&h=400',
      afterImage: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU1Nzc5NjIyfDA&ixlib=rb-4.1.0&q=85&w=600&h=400',
      description: 'Complete kitchen overhaul featuring dark green cabinetry, marble countertops, and high-end appliances for the modern chef.',
      features: ['Quartz Countertops', 'Custom Cabinetry', 'High-End Appliances', 'Task Lighting'],
      roi: '120%'
    },
    {
      id: 3,
      title: 'Upper East Side Condo',
      category: 'Master Bedroom',
      timeline: '3 months',
      investment: '$65,000',
      beforeImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBiZWRyb29tfGVufDB8fHx8MTc1NTc4MzkxNHww&ixlib=rb-4.1.0&q=85&w=600&h=400',
      afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU1Nzc5NjE2fDA&ixlib=rb-4.1.0&q=85&w=600&h=400',
      description: 'Luxury master bedroom transformation with sophisticated dark tones, custom headboard, and premium textiles.',
      features: ['Custom Headboard', 'Premium Textiles', 'Accent Lighting', 'Built-in Storage'],
      roi: '110%'
    }
  ]

  const currentTransformation = transformations[activeTransformation]

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
    <section className="section-padding bg-gray-50">
      <div className="container-elegant">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Transformations</span>
          </div>
          <h2 className="section-heading">
            Before & After <span className="gradient-text">Transformations</span>
          </h2>
          <p className="section-subtitle">
            Witness the remarkable transformations that have earned us recognition as NYC's 
            premier luxury interior design firm. Each project showcases our commitment to 
            excellence and attention to detail.
          </p>
        </motion.div>

        {/* Transformation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {transformations.map((transformation, index) => (
            <button
              key={transformation.id}
              onClick={() => setActiveTransformation(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTransformation === index
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg transform -translate-y-1'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:transform hover:-translate-y-0.5'
              }`}
            >
              {transformation.title}
            </button>
          ))}
        </motion.div>

        {/* Main Transformation Display */}
        <motion.div
          key={activeTransformation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          
          {/* Before Image */}
          <div className="relative group">
            <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold z-10">
              BEFORE
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={currentTransformation.beforeImage}
                alt={`${currentTransformation.title} - Before`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Transformation Arrow & Info */}
          <div className="flex flex-col justify-center items-center space-y-6">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg"
            >
              <ArrowRight className="w-8 h-8 text-white" />
            </motion.div>

            <div className="text-center bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-heading text-xl font-bold text-blue-900 mb-2">
                {currentTransformation.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {currentTransformation.category}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{currentTransformation.timeline}</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>{currentTransformation.investment}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-gray-500 mb-1">ROI Increase</div>
                <div className="text-2xl font-bold text-green-600">
                  +{currentTransformation.roi}
                </div>
              </div>
            </div>
          </div>

          {/* After Image */}
          <div className="relative group">
            <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold z-10">
              AFTER
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={currentTransformation.afterImage}
                alt={`${currentTransformation.title} - After`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Luxury Badge */}
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
              LUXURY
            </div>
          </div>
        </motion.div>

        {/* Transformation Details */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          
          {/* Description */}
          <motion.div variants={itemVariants}>
            <h3 className="font-heading text-2xl font-bold text-blue-900 mb-4">
              Project Highlights
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              {currentTransformation.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Key Features:</h4>
              <div className="grid grid-cols-2 gap-3">
                {currentTransformation.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary">
              View Full Case Study
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="font-heading text-xl font-bold text-blue-900 mb-6">
                Project Impact
              </h4>
              
              <div className="space-y-6">
                {[
                  { label: 'Investment', value: currentTransformation.investment, color: 'text-blue-600' },
                  { label: 'Timeline', value: currentTransformation.timeline, color: 'text-green-600' },
                  { label: 'ROI Increase', value: `+${currentTransformation.roi}`, color: 'text-yellow-600' },
                  { label: 'Satisfaction', value: '100%', color: 'text-purple-600' }
                ].map((stat, index) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className={`text-xl font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h4 className="font-heading text-lg font-bold mb-2">
                  Award Winner
                </h4>
                <p className="text-gray-300 text-sm">
                  This project won the NYC Interior Design Excellence Award 2024
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="font-heading text-2xl font-bold text-blue-900 mb-4">
              Ready for Your Transformation?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of satisfied clients who have transformed their spaces with our expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-luxury">
                Start My Project
              </button>
              <button className="btn-secondary">
                View More Transformations
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}