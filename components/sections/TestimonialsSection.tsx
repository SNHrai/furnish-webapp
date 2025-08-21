'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'CEO, Tech Innovations',
      location: 'Manhattan, NY',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c1de1e5d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MDk3fDB8MXxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwd29tYW4lMjBoZWFkc2hvdHxlbnwwfHx8fDE3NTU3ODM2NzR8MA&ixlib=rb-4.1.0&q=85&w=400&h=400',
      rating: 5,
      project: 'Complete Home Renovation',
      quote: "Elegant Home transformed our space beyond our wildest dreams. The AI calculator was incredibly accurate, and the final result exceeded all expectations. The attention to detail and luxury finishes are simply outstanding.",
      beforeImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&h=300',
      afterImage: 'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?q=80&w=400&h=300',
      investment: '$125,000'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Investment Banker',
      location: 'Upper East Side, NY',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MDk3fDB8MXxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsJTIwbWFuJTIwaGVhZHNob3R8ZW58MHx8fHwxNzU1NzgzNjc0fDA&ixlib=rb-4.1.0&q=85&w=400&h=400',
      rating: 5,
      project: 'Luxury Kitchen & Living Space',
      quote: "The level of sophistication and craftsmanship is unmatched. Every element was perfectly curated to reflect our lifestyle. The team's expertise in luxury design is evident in every corner of our home.",
      beforeImage: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=400&h=300',
      afterImage: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=400&h=300',
      investment: '$95,000'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      title: 'Creative Director',
      location: 'Brooklyn Heights, NY',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MDk3fDB8MXxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwd29tYW4lMjBoZWFkc2hvdHxlbnwwfHx8fDE3NTU3ODM2NzR8MA&ixlib=rb-4.1.0&q=85&w=400&h=400',
      rating: 5,
      project: 'Master Suite Transformation',
      quote: "Working with Elegant Home was a dream. They understood our vision perfectly and created a space that's both functional and breathtakingly beautiful. The quality of materials and execution is exceptional.",
      beforeImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&h=300',
      afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=400&h=300',
      investment: '$68,000'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="section-padding bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900 text-white overflow-hidden">
      <div className="container-elegant">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Client Success Stories</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover why discerning homeowners trust us to transform their spaces into 
            luxury sanctuaries that reflect their unique style and sophistication.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              
              {/* Left Column - Testimonial Content */}
              <div className="order-2 lg:order-1">
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-yellow-400 mb-4" />
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-2xl font-light text-gray-100 mb-8 leading-relaxed font-accent">
                  "{currentTestimonial.quote}"
                </blockquote>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-gray-300">
                      {currentTestimonial.title}
                    </p>
                    <p className="text-sm text-yellow-400">
                      {currentTestimonial.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Project Type</p>
                    <p className="font-semibold text-white">{currentTestimonial.project}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Investment</p>
                    <p className="font-semibold text-yellow-400">{currentTestimonial.investment}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Before/After Images */}
              <div className="order-1 lg:order-2 relative">
                <div className="relative">
                  {/* Before/After Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Before Image */}
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold z-10">
                        Before
                      </div>
                      <div className="relative h-64 rounded-xl overflow-hidden">
                        <Image
                          src={currentTestimonial.beforeImage}
                          alt="Before transformation"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* After Image */}
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold z-10">
                        After
                      </div>
                      <div className="relative h-64 rounded-xl overflow-hidden shadow-2xl">
                        <Image
                          src={currentTestimonial.afterImage}
                          alt="After transformation"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floating Stats */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 shadow-xl"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-xs">Satisfaction</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-yellow-400 w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20"
        >
          {[
            { value: '500+', label: 'Luxury Projects', icon: '🏡' },
            { value: '98%', label: 'Client Satisfaction', icon: '⭐' },
            { value: '$50M+', label: 'Project Value', icon: '💰' },
            { value: '25+', label: 'Design Awards', icon: '🏆' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}