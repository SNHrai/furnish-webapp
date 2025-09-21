'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Star, Award, Users, Palette } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    services: [
      { name: 'Interior Design', href: '/services/interior-design' },
      { name: 'Custom Furniture', href: '/services/custom-furniture' },
      { name: 'Space Planning', href: '/services/space-planning' },
      { name: '3D Visualization', href: '/services/3d-visualization' },
      { name: 'Consultation', href: '/services/consultation' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Process', href: '/process' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Careers', href: '/careers' },
    ],
    resources: [
      { name: 'Design Calculator', href: '/calculator' },
      { name: 'Style Guide', href: '/resources/style-guide' },
      { name: 'Maintenance Tips', href: '/resources/maintenance' },
      { name: 'Blog', href: '/blog' },
      { name: 'FAQs', href: '/faq' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/eleganthome', color: '#1877F2' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/eleganthome', color: '#E4405F' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/eleganthome', color: '#1DA1F2' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/eleganthome', color: '#0A66C2' },
  ]

  const stats = [
    { icon: Users, value: '5000+', label: 'Happy Clients' },
    { icon: Home, value: '8000+', label: 'Projects Completed' },
    { icon: Star, value: '4.9/5', label: 'Client Rating' },
    { icon: Award, value: '25+', label: 'Design Awards' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    },
  }

  return (
    <footer className="bg-primary-navy text-white">
      {/* Stats Section */}
      <motion.div 
        className="border-b border-primary-charcoal"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container-elegant py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-gold/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-accent-gold" />
                </div>
                <div className="text-3xl font-bold font-heading text-accent-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <motion.div
        className="container-elegant py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-gold to-accent-warm rounded-xl flex items-center justify-center">
                <Home className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Elegant Home
                </h3>
                <p className="text-accent-gold font-medium">Luxury Interiors</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transform your space into a luxurious haven with our AI-powered interior design solutions. 
              Professional craftsmanship meets cutting-edge technology to create your dream home.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-accent-gold flex-shrink-0" />
                <span>123 Design Street, Luxury District, New York, NY 10001</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-accent-gold flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-accent-gold flex-shrink-0" />
                <span>hello@eleganthome.com</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="font-heading text-xl font-semibold text-white mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent-gold transition-colors duration-300 flex items-center group"
                  >
                    <Palette className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 text-accent-gold transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="font-heading text-xl font-semibold text-white mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="font-heading text-xl font-semibold text-white mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="font-heading text-xl font-semibold text-white mb-6">
              Stay Updated
            </h4>
            <p className="text-gray-300 mb-4">
              Get the latest design trends and exclusive offers.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-primary-charcoal border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-accent-gold transition-colors"
              />
              <button className="w-full bg-gradient-to-r from-accent-gold to-accent-warm text-white py-3 rounded-lg font-semibold hover:transform hover:-translate-y-1 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Social Links & Copyright */}
      <motion.div
        className="border-t border-primary-charcoal"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container-elegant py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div variants={itemVariants}>
              <p className="text-gray-400">
                © 2024 Elegant Home. All rights reserved. Crafted with love for luxury living.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-accent-gold transition-all duration-300 transform hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-6 h-6" />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}