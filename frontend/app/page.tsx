'use client'

import AppLayout from '@/components/AppLayout'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import PortfolioSection from '@/components/sections/PortfolioSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import BeforeAfterSection from '@/components/sections/BeforeAfterSection'
import PriceCalculatorPreview from '@/components/sections/PriceCalculatorPreview'
import ContactSection from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <AppLayout>
        <HeroSection />
        <ServicesSection />
        <PriceCalculatorPreview />
        <PortfolioSection />
        <BeforeAfterSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </AppLayout>
    </div>
  )
}
