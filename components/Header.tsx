'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Calculator, Briefcase, Phone, Info, BarChart3 } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'Compare', href: '/comparison', icon: BarChart3 },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
  ]

  return (
    <motion.header 
      className={`navbar transition-all duration-300 ${isScrolled ? 'bg-white/98 shadow-elegant-md' : 'bg-white/95'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-elegant">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-gold to-accent-warm rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-primary-navy">
                  Elegant Home
                </h1>
                <p className="text-xs text-primary-charcoal font-medium">
                  Luxury Interiors
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="nav-link group flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* CTA Button */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/calculator" className="btn-luxury">
              Get Quote
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-primary-charcoal hover:text-accent-warm transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-white shadow-elegant-lg border-t border-medium-gray"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container-elegant py-4">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 py-3 text-primary-charcoal hover:text-accent-warm transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="pt-4 border-t border-medium-gray mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Link
                    href="/calculator"
                    className="btn-luxury w-full text-center block"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Quote
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}