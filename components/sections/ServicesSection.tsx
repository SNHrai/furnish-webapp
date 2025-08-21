'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, Palette, Ruler, Lightbulb, Sofa, Hammer, ArrowRight, Sparkles } from 'lucide-react'

export default function ServicesSection() {
  const services = [
    {
      icon: Palette,
      title: 'Complete Interior Design',
      description: 'Transform your entire space with our comprehensive design solutions, from concept to completion.',
      features: ['Space Planning', '3D Visualization', 'Material Selection', 'Project Management'],
      price: 'From $15,000',
      popular: true,
      href: '/services/interior-design'
    },
    {
      icon: Sofa,
      title: 'Custom Furniture Design',
      description: 'Bespoke furniture pieces crafted by master artisans to perfectly fit your space and style.',
      features: ['Custom Measurements', 'Premium Materials', 'Unique Designs', 'Expert Craftsmanship'],
      price: 'From $5,000',
      popular: false,
      href: '/services/custom-furniture'
    },
    {
      icon: Ruler,
      title: 'Space Planning & Layout',
      description: 'Optimize your space with intelligent layout solutions that maximize both function and beauty.',
      features: ['Flow Analysis', 'Furniture Placement', 'Traffic Patterns', 'Storage Solutions'],
      price: 'From $2,500',
      popular: false,
      href: '/services/space-planning'
    },
    {
      icon: Lightbulb,
      title: 'Lighting Design',
      description: 'Create the perfect ambiance with professionally designed lighting that enhances your space.',
      features: ['Mood Lighting', 'Task Lighting', 'Accent Features', 'Smart Controls'],
      price: 'From $3,000',
      popular: false,
      href: '/services/lighting'
    },
    {
      icon: Home,
      title: '3D Visualization',
      description: 'See your future space in stunning detail with photorealistic 3D renderings and virtual tours.',
      features: ['Photorealistic Renders', 'Virtual Walkthrough', 'Multiple Angles', 'Real-time Changes'],
      price: 'From $1,500',
      popular: false,
      href: '/services/3d-visualization'
    },
    {
      icon: Hammer,
      title: 'Installation & Styling',
      description: 'Professional installation and styling services to bring your design vision to life perfectly.',
      features: ['Expert Installation', 'Final Styling', 'Quality Assurance', 'Post-Service Support'],
      price: 'From $2,000',
      popular: false,
      href: '/services/installation'
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
    <section className="section-padding bg-light-gray">
      <div className="container-elegant">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-accent-gold/10 text-accent-warm px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Our Premium Services</span>
          </div>
          <h2 className="section-heading">
            Luxury Design Services
          </h2>
          <p className="section-subtitle">
            From complete home transformations to bespoke furniture pieces, our comprehensive 
            suite of services covers every aspect of luxury interior design. Each service is 
            tailored to your unique vision and delivered with impeccable craftsmanship.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className={`card-elegant group relative ${service.popular ? 'ring-2 ring-accent-gold' : ''}`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-6 bg-gradient-to-r from-accent-gold to-accent-warm text-white px-3 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              {/* Service Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-accent-gold/10 to-accent-warm/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-accent-gold" />
              </div>

              {/* Service Content */}
              <div className="mb-6">
                <h3 className="font-heading text-xl font-semibold text-primary-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-primary-charcoal mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-primary-charcoal">
                      <div className="w-1.5 h-1.5 bg-accent-gold rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and CTA */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold font-accent text-accent-warm">
                    {service.price}
                  </span>
                  <div className="text-xs text-primary-charcoal">
                    Starting price
                  </div>
                </div>
                
                <Link
                  href={service.href}
                  className="w-full bg-primary-navy text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-accent-warm hover:transform hover:-translate-y-1 group"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-navy to-primary-charcoal rounded-2xl p-8 md:p-12 text-white">
            <h3 className="font-heading text-3xl font-bold mb-4">
              Not Sure Which Service You Need?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Let our AI-powered calculator analyze your space and recommend the perfect 
              combination of services for your dream transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator" className="btn-luxury">
                Try Our AI Calculator
              </Link>
              <Link href="/consultation" className="bg-transparent border-2 border-accent-gold text-accent-gold px-8 py-4 rounded-xl font-semibold hover:bg-accent-gold hover:text-white transition-all duration-300">
                Free Consultation
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}