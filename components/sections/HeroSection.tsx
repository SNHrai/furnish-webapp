'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calculator, Star, ArrowRight, Sparkles, Home, Palette } from 'lucide-react'

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const heroImages = [
    'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwwfHx8YmxhY2t8MTc1NTc3OTU3NHww&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1613939622947-77342d556084?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDB8fHxibGFja3wxNzU1Nzc5NTgyfDA&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU1Nzc5NjE2fDA&ixlib=rb-4.1.0&q=85'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: Calculator,
      title: 'AI Price Calculator',
      description: 'Instant luxury pricing for any room'
    },
    {
      icon: Star,
      title: '5000+ Projects',
      description: 'Trusted by discerning clients worldwide'
    },
    {
      icon: Palette,
      title: 'Bespoke Design',
      description: 'Tailored to your unique lifestyle'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent-cream via-white to-light-gray">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-elegant relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-accent-gold/10 text-accent-warm px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Luxury Design</span>
              <Sparkles className="w-4 h-4" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="hero-text mb-6"
            >
              Transform Your Space Into a 
              <span className="gradient-text block mt-2">Luxury Haven</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl text-primary-charcoal mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Experience the future of interior design with our AI-powered price calculator 
              and bespoke luxury furniture solutions. From concept to completion, we craft 
              spaces that reflect your unique style and sophistication.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Link href="/calculator" className="btn-luxury group">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate My Dream Space
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/portfolio" className="btn-secondary group">
                View Portfolio
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left group"
                >
                  <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-accent-gold/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-accent-gold" />
                  </div>
                  <h3 className="font-semibold text-primary-navy mb-1">{feature.title}</h3>
                  <p className="text-sm text-primary-charcoal">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-luxury">
              {/* Image Carousel */}
              <div className="relative w-full h-full">
                {heroImages.map((image, index) => (
                  <motion.div
                    key={image}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: currentImageIndex === index ? 1 : 0,
                      scale: currentImageIndex === index ? 1 : 1.1
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={image}
                      alt={`Luxury Interior Design ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Overlay with Floating Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent">
                
                {/* Price Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-luxury"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-4 h-4 text-accent-gold fill-current" />
                    <span className="text-sm font-semibold text-primary-navy">Premium Design</span>
                  </div>
                  <div className="text-2xl font-bold font-accent text-accent-warm">
                    $25,999
                  </div>
                  <div className="text-xs text-primary-charcoal">
                    Complete makeover
                  </div>
                </motion.div>

                {/* Feature Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-luxury"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary-navy text-sm">
                        AI-Calculated
                      </div>
                      <div className="text-xs text-primary-charcoal">
                        Precision pricing
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index 
                        ? 'bg-accent-gold w-6' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Decoration */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-accent-gold to-accent-warm rounded-full opacity-20 blur-xl"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-accent-sage to-accent-warm rounded-full opacity-15 blur-xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-navy rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-accent-gold rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}