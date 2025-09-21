import type { Metadata } from "next"
import "./globals.css"
import AuthProvider from './providers/AuthProvider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Elegant Home - Luxury Interior Design & Furniture",
  description: "Transform your space with our AI-powered interior design solutions. Professional luxury furniture and design services with instant price calculations.",
  keywords: "interior design, luxury furniture, home decor, AI price calculator, room design, furniture services",
  authors: [{ name: "Elegant Home Design Studio" }],
  creator: "Elegant Home",
  openGraph: {
    title: "Elegant Home - Luxury Interior Design & Furniture",
    description: "Transform your space with our AI-powered interior design solutions. Professional luxury furniture and design services with instant price calculations.",
    url: "https://eleganthome.com",
    siteName: "Elegant Home",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elegant Home - Luxury Interior Design",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elegant Home - Luxury Interior Design & Furniture",
    description: "Transform your space with our AI-powered interior design solutions.",
    creator: "@eleganthome",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  )
}