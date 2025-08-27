'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Home, 
  Search, 
  ArrowRight, 
  Calculator,
  Palette,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react'

export default function NotFound() {
  const quickLinks = [
    {
      icon: Home,
      title: 'Home',
      description: 'Return to our homepage',
      href: '/',
      color: 'text-accent-warm'
    },
    {
      icon: Calculator,
      title: 'Price Calculator',
      description: 'Get instant quotes',
      href: '/calculator',
      color: 'text-accent-gold'
    },
    {
      icon: Palette,
      title: 'Our Services',
      description: 'Explore design services',
      href: '/services',
      color: 'text-accent-sage'
    },
    {
      icon: Phone,
      title: 'Contact Us',
      description: 'Get in touch',
      href: '/contact',
      color: 'text-primary-navy'
    }
  ]

  const popularPages = [
    { name: 'Complete Home Makeover', href: '/services#home-makeover' },
    { name: 'Room Design', href: '/services#room-design' },
    { name: 'AI Price Calculator', href: '/calculator' },
    { name: 'About Our Team', href: '/about' },
    { name: 'Design Portfolio', href: '/#portfolio' },
    { name: 'Customer Reviews', href: '/#testimonials' }
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const query = formData.get('search') as string
    if (query.trim()) {
      // In a real implementation, this would redirect to a search results page
      window.location.href = `/?search=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-light-gray">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-elegant relative z-10 min-h-screen flex items-center justify-center py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Main 404 Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            {/* 404 Illustration */}
            <motion.div
              variants={itemVariants}
              className="relative mx-auto mb-8"
            >
              <div className="relative w-80 h-80 mx-auto">
                {/* Animated 404 Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-8xl md:text-9xl font-bold font-heading text-accent-gold/20"
                  >
                    404
                  </motion.span>
                </div>
                
                {/* Floating Decorations */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 w-16 h-16 bg-accent-warm/10 rounded-full flex items-center justify-center"
                >
                  <Home className="w-8 h-8 text-accent-warm" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 left-8 w-12 h-12 bg-accent-sage/10 rounded-full flex items-center justify-center"
                >
                  <Palette className="w-6 h-6 text-accent-sage" />
                </motion.div>
                
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-4 w-8 h-8 bg-accent-gold/10 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-accent-gold" />
                </motion.div>
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-navy mb-4">
                Oops! Page Not Found
              </h1>
              <p className="text-xl text-primary-charcoal mb-2 max-w-2xl mx-auto leading-relaxed">
                The page you're looking for seems to have been redesigned out of existence! 
                Don't worry, our design team is much better at creating beautiful spaces than hiding pages.
              </p>
              <p className="text-primary-charcoal">
                Let's get you back to exploring our luxury interior design services.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div variants={itemVariants} className="mb-8">
              <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search for services, designs, or inspiration..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-accent-warm focus:ring-2 focus:ring-accent-warm/20 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-warm text-white px-4 py-2 rounded-lg hover:bg-accent-warm/90 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/" className="btn-luxury group">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/calculator" className="btn-secondary group">
                <Calculator className="w-5 h-5 mr-2" />
                Try Price Calculator
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Links Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                variants={itemVariants}
                className="group"
              >
                <Link
                  href={link.href}
                  className="block card-elegant p-6 text-center hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100 group-hover:bg-gray-200 transition-colors`}>
                    <link.icon className={`w-6 h-6 ${link.color}`} />
                  </div>
                  <h3 className="font-semibold text-primary-navy mb-2">{link.title}</h3>
                  <p className="text-sm text-primary-charcoal">{link.description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Popular Pages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-elegant-lg"
          >
            <h2 className="font-heading text-2xl font-bold text-primary-navy mb-6 text-center">
              Popular Pages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularPages.map((page, index) => (
                <motion.div
                  key={page.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={page.href}
                    className="block p-4 rounded-xl hover:bg-accent-cream/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <ArrowRight className="w-4 h-4 text-accent-gold group-hover:translate-x-1 transition-transform" />
                      <span className="text-primary-charcoal group-hover:text-primary-navy font-medium">
                        {page.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-br from-primary-navy to-primary-charcoal text-white rounded-2xl p-8">
              <h2 className="font-heading text-2xl font-bold mb-4">
                Need Immediate Assistance?
              </h2>
              <p className="text-gray-300 mb-6">
                Our design experts are here to help you find exactly what you're looking for.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="w-5 h-5 text-accent-gold" />
                  <div>
                    <div className="font-semibold">Call Us</div>
                    <div className="text-sm text-gray-300">+91 98765 43210</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="w-5 h-5 text-accent-gold" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-sm text-gray-300">hello@eleganthome.in</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <Clock className="w-5 h-5 text-accent-gold" />
                  <div>
                    <div className="font-semibold">Working Hours</div>
                    <div className="text-sm text-gray-300">Mon-Sat, 9AM-7PM</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
