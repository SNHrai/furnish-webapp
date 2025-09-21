import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Elegant Home',
    default: 'Authentication | Elegant Home',
  },
  description: 'Sign in to your Elegant Home account to access interior design services.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {children}
    </div>
  )
}