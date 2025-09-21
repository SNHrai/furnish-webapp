'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, Heart, ArrowRight, Sparkles } from 'lucide-react'

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('all')

  const portfolioItems = [
    {
      id: 1,
      title: 'Luxury Modern Living Room',
      category: 'living-room',
      tags: ['Modern', 'Luxury', 'Living Room'],
      image: 'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwwfHx8YmxhY2t8MTc1NTc3OTU3NHww&ixlib=rb-4.1.0&q=85',
      views: '2.5K',
      likes: '384',
      price: '$28,500',
      description: 'Sophisticated living space with custom leather furniture and ambient lighting.'
    },
    {
      id: 2,
      title: 'Elegant Master Bedroom',
      category: 'bedroom',
      tags: ['Contemporary', 'Bedroom', 'Minimalist'],
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU1Nzc5NjE2fDA&ixlib=rb-4.1.0&q=85',
      views: '1.8K',
      likes: '267',
      price: '$22,000',
      description: 'Serene bedroom retreat with dark accent wall and luxurious textiles.'
    },
    {
      id: 3,
      title: 'Gourmet Kitchen Design',
      category: 'kitchen',
      tags: ['Modern', 'Kitchen', 'Luxury'],
      image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU1Nzc5NjIyfDA&ixlib=rb-4.1.0&q=85',
      views: '3.2K',
      likes: '421',
      price: '$45,000',
      description: 'Chef-inspired kitchen with dark green cabinets and marble countertops.'
    },
    {
      id: 4,
      title: 'Contemporary Living Space',
      category: 'living-room',
      tags: ['Contemporary', 'Open Plan', 'Natural Light'],
      image: 'https://images.unsplash.com/photo-1613939622947-77342d556084?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDB8fHxibGFja3wxNzU1Nzc5NTgyfDA&ixlib=rb-4.1.0&q=85',
      views: '2.1K',
      likes: '312',
      price: '$35,500',
      description: 'Open concept design with sophisticated lighting and modern furnishings.'
    },
    {
      id: 5,
      title: 'Minimalist Bedroom Suite',
      category: 'bedroom',
      tags: ['Minimalist', 'Bedroom', 'Wooden Elements'],
      image: 'https://images.unsplash.com/photo-1633948393301-d43e3ec0e5cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU1Nzc5NjE2fDA&ixlib=rb-4.1.0&q=85',
      views: '1.5K',
      likes: '198',
      price: '$18,000',
      description: 'Clean, functional bedroom design with warm wood accents and integrated workspace.'
    },
    {
      id: 6,
      title: 'Luxury Kitchen Island',
      category: 'kitchen',
      tags: ['Luxury', 'Kitchen', 'Bar Seating'],
      image: 'https://images.unsplash.com/photo-1632583824020-937ae9564495?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxraXRjaGVuJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU1Nzc5NjIyfDA&ixlib=rb-4.1.0&q=85',
      views: '2.8K',
      likes: '356',
      price: '$52,000',
      description: 'Statement kitchen with oversized island and premium bar seating.'
    }
  ]

  const filters = [
    { id: 'all', name: 'All Projects', count: portfolioItems.length },
    { id: 'living-room', name: 'Living Rooms', count: portfolioItems.filter(item => item.category === 'living-room').length },
    { id: 'bedroom', name: 'Bedrooms', count: portfolioItems.filter(item => item.category === 'bedroom').length },
    { id: 'kitchen', name: 'Kitchens', count: portfolioItems.filter(item => item.category === 'kitchen').length }
  ]

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter)

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
    <section className="section-padding bg-white">
      <div className="container-elegant">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Our Portfolio</span>
          </div>
          <h2 className="section-heading">
            Luxury Designs That Inspire
          </h2>
          <p className="section-subtitle">
            Discover our collection of award-winning interior design projects. Each space tells a unique 
            story of luxury, functionality, and impeccable craftsmanship that reflects our clients' 
            distinctive lifestyles and aspirations.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg transform -translate-y-1'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:-translate-y-0.5'
              }`}
            >
              {filter.name}
              <span className="ml-2 text-xs opacity-75">
                ({filter.count})
              </span>
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="card-portfolio group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{item.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-bold text-orange-600">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-semibold text-blue-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <button className="text-orange-600 font-semibold flex items-center space-x-1 hover:text-orange-700 transition-colors">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{item.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{item.likes}</span>
                    </div>
                  </div>
                </div>
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
          <p className="text-gray-600 mb-6">
            Ready to create your own luxury space?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-luxury">
              Start Your Project
            </button>
            <button className="btn-secondary">
              View All Projects
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}