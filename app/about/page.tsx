'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  Star, 
  Users, 
  Award, 
  Heart, 
  Target, 
  Eye, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Home,
  Palette,
  Lightbulb
} from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Home, value: '5,000+', label: 'Projects Completed', description: 'Luxury homes transformed across India' },
    { icon: Star, value: '4.9/5', label: 'Client Satisfaction', description: 'Average rating from our clients' },
    { icon: Users, value: '50+', label: 'Design Experts', description: 'Professional interior designers' },
    { icon: Award, value: '15+', label: 'Awards Won', description: 'Industry recognition and accolades' }
  ]

  const values = [
    {
      icon: Eye,
      title: 'Visionary Design',
      description: 'We envision spaces that transcend ordinary living, creating environments that inspire and elevate daily life through innovative design solutions.'
    },
    {
      icon: Heart,
      title: 'Passionate Craftsmanship',
      description: 'Every project is infused with our passion for excellence, attention to detail, and commitment to bringing your unique vision to life.'
    },
    {
      icon: Target,
      title: 'Client-Centric Approach',
      description: 'Your dreams and lifestyle are at the center of everything we do. We listen, understand, and deliver beyond expectations.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation & Technology',
      description: 'We blend traditional craftsmanship with cutting-edge technology, including AI-powered design tools for precision and efficiency.'
    }
  ]

  const team = [
    {
      name: 'Arjun Sharma',
      role: 'Founder & Lead Designer',
      experience: '15+ Years',
      specialization: 'Luxury Residential Design',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHx8fGJsYWNrfDE3NTU3OTYwMDB8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      name: 'Priya Patel',
      role: 'Senior Interior Designer',
      experience: '12+ Years',
      specialization: 'Modern & Contemporary',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjB3b21hbiUyMHByb2Zlc3Npb25hbHxlbnwwfHx8YmxhY2t8MTc1NTc5NjAzNHww&ixlib=rb-4.1.0&q=85'
    },
    {
      name: 'Rohit Mehta',
      role: 'Project Manager',
      experience: '10+ Years',
      specialization: 'Project Execution',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHx8fGJsYWNrfDE3NTU3OTYwNjR8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      name: 'Sneha Reddy',
      role: 'Design Consultant',
      experience: '8+ Years',
      specialization: 'Color & Styling',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b02d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjB3b21hbiUyMHByb2Zlc3Npb25hbHxlbnwwfHx8YmxhY2t8MTc1NTc5NjA5NXww&ixlib=rb-4.1.0&q=85'
    }
  ]

  const milestones = [
    { year: '2010', title: 'Founded', description: 'Elegant Home established with a vision to transform living spaces' },
    { year: '2015', title: 'Expansion', description: 'Expanded to serve clients across major Indian metropolitan cities' },
    { year: '2018', title: 'Innovation', description: 'Introduced AI-powered design tools for precision planning' },
    { year: '2020', title: 'Digital First', description: 'Launched comprehensive digital platform during pandemic' },
    { year: '2023', title: '5K Projects', description: 'Completed over 5,000 luxury interior design projects' },
    { year: '2025', title: 'Future Ready', description: 'Leading the industry with cutting-edge technology and design' }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-accent-gold/10 text-accent-warm px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>About Elegant Home</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="hero-text mb-6">
                Crafting <span className="gradient-text">Luxury Spaces</span> Since 2010
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl text-primary-charcoal mb-8 leading-relaxed">
                We are India's premier luxury interior design firm, dedicated to transforming homes into personalized sanctuaries. With over 5,000 completed projects and a team of passionate design experts, we bring dreams to life through innovative design solutions and unparalleled craftsmanship.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link href="/services" className="btn-luxury group">
                  Explore Our Services
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/calculator" className="btn-secondary">
                  Get Free Quote
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-luxury">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMHRlYW18ZW58MHx8fGJsYWNrfDE3NTU3OTYxNDF8MA&ixlib=rb-4.1.0&q=85"
                  alt="Elegant Home Design Team"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-elegant">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-gold/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-accent-gold" />
                </div>
                <div className="text-3xl font-bold font-accent text-primary-navy mb-2">{stat.value}</div>
                <div className="font-semibold text-primary-charcoal mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gradient-to-br from-light-gray to-white">
        <div className="container-elegant">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Our Mission & Vision</h2>
            <p className="section-subtitle">
              Guided by our core values and unwavering commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="card-elegant p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-warm/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent-warm" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary-navy">Our Mission</h3>
              </div>
              <p className="text-primary-charcoal leading-relaxed">
                To create exceptional living spaces that reflect our clients' unique personalities and enhance their quality of life. We strive to deliver innovative design solutions that combine luxury, functionality, and sustainability while exceeding expectations in every project we undertake.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="card-elegant p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-accent-gold" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary-navy">Our Vision</h3>
              </div>
              <p className="text-primary-charcoal leading-relaxed">
                To be India's most trusted and innovative interior design firm, setting new standards in luxury home transformation. We envision a future where every home we touch becomes a masterpiece that stands the test of time and brings joy to its inhabitants for generations.
              </p>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="flex items-start space-x-4 p-6 rounded-xl hover:bg-white hover:shadow-elegant-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-accent-sage" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-navy mb-2">{value.title}</h4>
                  <p className="text-primary-charcoal text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-elegant">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Meet Our Expert Team</h2>
            <p className="section-subtitle">
              Passionate designers and craftspeople dedicated to bringing your vision to life
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="card-elegant text-center group"
              >
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-primary-navy mb-1">{member.name}</h3>
                <p className="text-accent-warm font-medium mb-1">{member.role}</p>
                <p className="text-sm text-primary-charcoal mb-2">{member.experience}</p>
                <p className="text-xs text-gray-600">{member.specialization}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gradient-to-br from-primary-navy to-primary-charcoal text-white">
        <div className="container-elegant">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From humble beginnings to industry leadership - a timeline of growth and innovation
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-accent-gold"></div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  variants={itemVariants}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                      <div className="text-accent-gold font-bold text-2xl mb-2">{milestone.year}</div>
                      <h3 className="font-semibold text-xl mb-2">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-4 h-4 bg-accent-gold rounded-full border-4 border-white"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-elegant">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="section-heading mb-4">Ready to Transform Your Space?</h2>
            <p className="section-subtitle mb-8">
              Join thousands of satisfied clients who have trusted us with their dream homes
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator" className="btn-luxury group">
                <Palette className="w-5 h-5 mr-2" />
                Start Your Design Journey
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="btn-secondary">
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
