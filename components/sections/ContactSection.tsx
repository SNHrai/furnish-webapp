'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles } from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    message: '',
    timeline: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Showroom',
      content: '123 Design Street\nLuxury District\nNew York, NY 10001',
      link: 'https://maps.google.com',
      linkText: 'Get Directions'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (555) 123-4567\nToll Free: +1 (800) 123-4567',
      link: 'tel:+15551234567',
      linkText: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@eleganthome.com\ninfo@eleganthome.com',
      link: 'mailto:hello@eleganthome.com',
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
    'Under $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000 - $200,000',
    'Over $200,000'
  ]

  const timelines = [
    'ASAP',
    'Within 1 month',
    '2-3 months',
    '4-6 months',
    '6+ months',
    'Just exploring'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Project Type & Budget Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Type *
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
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
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
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
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Describe your dream space, style preferences, specific requirements..."
                    required
                  />
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
                    📧 Confirmation email sent to: <strong>{formData.email}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
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