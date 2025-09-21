'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  Home, 
  Palette, 
  Sofa, 
  Hammer, 
  Lightbulb,
  Ruler,
  Shield,
  Clock,
  Star,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  Users,
  Calculator,
  Phone
} from 'lucide-react'

export default function ServicesPage() {
  const heroServices = [
    {
      icon: Home,
      title: 'Complete Home Makeover',
      description: 'End-to-end transformation of your entire home',
      price: 'Starting ₹8,00,000',
      features: ['Full home design', '3D visualization', 'Premium materials', 'Project management']
    },
    {
      icon: Sofa,
      title: 'Room-Specific Design',
      description: 'Focused transformation of individual rooms',
      price: 'Starting ₹1,20,000',
      features: ['Single room focus', 'Custom furniture', 'Color consultation', 'Styling services']
    },
    {
      icon: Palette,
      title: 'Design Consultation',
      description: 'Expert guidance for your design decisions',
      price: 'Starting ₹15,000',
      features: ['2-hour consultation', 'Design roadmap', 'Material suggestions', 'Color palette']
    }
  ]

  const allServices = [
    {
      category: 'Interior Design Services',
      services: [
        {
          name: 'Complete Home Makeover',
          description: 'Comprehensive transformation of your entire living space',
          price: '₹8,00,000 - ₹25,00,000',
          duration: '3-6 months',
          icon: Home,
          features: [
            'Full home design planning',
            '3D visualization and walkthroughs',
            'Premium material selection',
            'Dedicated project manager',
            'Complete furniture package',
            'Lighting design',
            '1-year warranty'
          ]
        },
        {
          name: 'Room-Specific Design',
          description: 'Focused design for individual rooms',
          price: '₹1,20,000 - ₹4,00,000',
          duration: '4-8 weeks',
          icon: Sofa,
          features: [
            'Single room transformation',
            'Custom furniture design',
            'Color consultation',
            'Space optimization',
            'Styling and accessories',
            '6-month warranty'
          ]
        },
        {
          name: 'Design Consultation',
          description: 'Expert advice and design direction',
          price: '₹15,000 - ₹50,000',
          duration: '1-2 sessions',
          icon: Palette,
          features: [
            '2-hour consultation session',
            'Detailed design roadmap',
            'Material and color suggestions',
            'Budget planning guidance',
            'Digital mood board',
            'Follow-up support'
          ]
        },
        {
          name: '3D Visualization',
          description: 'Photorealistic 3D renders of your space',
          price: '₹25,000 - ₹75,000',
          duration: '1-2 weeks',
          icon: Lightbulb,
          features: [
            'Photorealistic 3D renders',
            'Virtual walkthrough',
            'Multiple design options',
            'Material visualization',
            'Lighting simulation',
            'Revision rounds included'
          ]
        }
      ]
    },
    {
      category: 'Furniture Services',
      services: [
        {
          name: 'Custom Furniture Design',
          description: 'Bespoke furniture crafted to your specifications',
          price: '₹50,000 - ₹5,00,000',
          duration: '6-12 weeks',
          icon: Hammer,
          features: [
            'Custom design and sizing',
            'Premium wood selection',
            'Handcrafted construction',
            'Quality hardware',
            'Professional installation',
            'Lifetime craftsmanship warranty'
          ]
        },
        {
          name: 'Ready-Made Premium Furniture',
          description: 'Curated collection of luxury furniture pieces',
          price: '₹25,000 - ₹3,00,000',
          duration: '2-4 weeks',
          icon: Sofa,
          features: [
            'Designer furniture collection',
            'Premium materials',
            'Quality assurance',
            'Home delivery',
            'Assembly service',
            '2-year warranty'
          ]
        },
        {
          name: 'Furniture Restoration',
          description: 'Bring new life to your existing furniture',
          price: '₹10,000 - ₹75,000',
          duration: '2-6 weeks',
          icon: Shield,
          features: [
            'Damage assessment',
            'Restoration planning',
            'Quality materials',
            'Expert craftsmanship',
            'Color matching',
            '1-year warranty'
          ]
        }
      ]
    },
    {
      category: 'Specialized Services',
      services: [
        {
          name: 'Home Staging',
          description: 'Prepare your home for sale or rent',
          price: '₹75,000 - ₹2,50,000',
          duration: '1-3 weeks',
          icon: Star,
          features: [
            'Property assessment',
            'Staging strategy',
            'Furniture rental options',
            'Professional photography',
            'Quick turnaround',
            'Higher property value'
          ]
        },
        {
          name: 'Vastu Consultation',
          description: 'Traditional Vastu principles for harmonious living',
          price: '₹20,000 - ₹1,00,000',
          duration: '1-2 weeks',
          icon: Ruler,
          features: [
            'Vastu analysis',
            'Remedial suggestions',
            'Space optimization',
            'Color recommendations',
            'Furniture placement',
            'Follow-up consultation'
          ]
        },
        {
          name: 'Lighting Design',
          description: 'Comprehensive lighting solutions',
          price: '₹40,000 - ₹2,00,000',
          duration: '2-4 weeks',
          icon: Lightbulb,
          features: [
            'Lighting assessment',
            'Custom lighting plan',
            'Premium fixtures',
            'Smart lighting integration',
            'Energy efficiency',
            'Professional installation'
          ]
        }
      ]
    }
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'We discuss your vision, requirements, and budget to understand your unique needs.',
      icon: Users
    },
    {
      step: '02',
      title: 'Design Development',
      description: 'Our team creates detailed designs, 3D visualizations, and material selections.',
      icon: Palette
    },
    {
      step: '03',
      title: 'Project Planning',
      description: 'We develop a comprehensive timeline and coordinate all aspects of your project.',
      icon: Clock
    },
    {
      step: '04',
      title: 'Implementation',
      description: 'Expert craftspeople bring your design to life with precision and attention to detail.',
      icon: Hammer
    },
    {
      step: '05',
      title: 'Final Delivery',
      description: 'We ensure every detail is perfect before presenting your transformed space.',
      icon: Award
    }
  ]

  const testimonials = [
    {
      name: 'Rajesh Gupta',
      role: 'Homeowner, Mumbai',
      content: 'Elegant Home transformed our 3BHK into a masterpiece. The AI price calculator was incredibly accurate, and the final result exceeded our expectations.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHx8fGJsYWNrfDE3NTU3OTYwMDB8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      name: 'Priya Sharma',
      role: 'Interior Enthusiast, Delhi',
      content: 'The team\'s attention to detail and commitment to quality is unmatched. Our home now feels like a luxury resort.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjB3b21hbiUyMHByb2Zlc3Npb25hbHxlbnwwfHx8YmxhY2t8MTc1NTc5NjAzNHww&ixlib=rb-4.1.0&q=85'
    },
    {
      name: 'Amit Patel',
      role: 'Business Owner, Bangalore',
      content: 'Professional service from start to finish. The project was completed on time and within budget.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHx8fGJsYWNrfDE3NTU3OTYwNjR8MA&ixlib=rb-4.1.0&q=85'
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-accent-cream via-white to-light-gray overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container-elegant relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-accent-gold/10 text-accent-warm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Premium Interior Design Services</span>
            </div>
            <h1 className="hero-text mb-6">
              Transform Your Space with <span className="gradient-text">Expert Services</span>
            </h1>
            <p className="text-xl text-primary-charcoal leading-relaxed max-w-3xl mx-auto mb-8">
              From complete home makeovers to specialized design consultations, we offer comprehensive 
              interior design services tailored to your unique style and budget. Experience luxury living 
              with our expert team and cutting-edge design solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator" className="btn-luxury group">
                <Calculator className="w-5 h-5 mr-2" />
                Get Instant Quote
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                <Phone className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Link>
            </div>
          </motion.div>

          {/* Featured Services */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {heroServices.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="card-premium p-8 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-gold/20 transition-colors">
                  <service.icon className="w-8 h-8 text-accent-gold" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary-navy mb-3">{service.title}</h3>
                <p className="text-primary-charcoal mb-4">{service.description}</p>
                <div className="text-2xl font-bold font-accent text-accent-warm mb-4">{service.price}</div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-primary-charcoal">
                      <Check className="w-4 h-4 text-accent-sage mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/calculator" className="btn-secondary w-full">
                  Get Quote
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Services */}
      <section className="section-padding bg-white">
        <div className="container-elegant">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Complete Service Portfolio</h2>
            <p className="section-subtitle">
              Comprehensive solutions for every aspect of your interior design journey
            </p>
          </motion.div>

          {allServices.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              className="mb-16"
            >
              <h3 className="font-heading text-3xl font-bold text-primary-navy mb-8 text-center">
                {category.category}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {category.services.map((service, serviceIndex) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: serviceIndex % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: serviceIndex * 0.1 }}
                    className="card-elegant p-6 hover:shadow-luxury transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <service.icon className="w-6 h-6 text-accent-gold" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-xl text-primary-navy mb-2">{service.name}</h4>
                        <p className="text-primary-charcoal mb-3">{service.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration}
                          </div>
                          <div className="font-semibold text-accent-warm">
                            {service.price}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-primary-charcoal">
                          <Check className="w-4 h-4 text-accent-sage mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link href="/calculator" className="btn-primary flex-1 text-center">
                        Get Quote
                      </Link>
                      <Link href="/contact" className="btn-secondary flex-1 text-center">
                        Learn More
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gradient-to-br from-light-gray to-white">
        <div className="container-elegant">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Our Design Process</h2>
            <p className="section-subtitle">
              A systematic approach that ensures exceptional results for every project
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-accent-gold/20 transform -translate-y-1/2 hidden lg:block"></div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  variants={itemVariants}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-accent-gold rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl relative z-10">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-accent-gold" />
                  </div>
                  <h3 className="font-semibold text-primary-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-primary-charcoal">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-elegant">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">What Our Clients Say</h2>
            <p className="section-subtitle">
              Real experiences from homeowners who trusted us with their dream spaces
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                className="card-elegant p-6 text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent-gold fill-current" />
                  ))}
                </div>
                <p className="text-primary-charcoal mb-4 italic">"{testimonial.content}"</p>
                <h4 className="font-semibold text-primary-navy">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-navy to-primary-charcoal text-white">
        <div className="container-elegant">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Ready to Begin Your Design Journey?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Transform your space with India's premier interior design firm. Get started with our 
              AI-powered price calculator or schedule a consultation with our expert team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator" className="bg-accent-gold text-primary-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-gold/90 transition-colors inline-flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Get Instant Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-navy transition-all inline-flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
