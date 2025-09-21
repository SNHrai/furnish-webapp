'use client'

import { useEffect } from 'react'
import { useAuthInit } from '@/lib/stores/auth-store'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { initializeAuth } = useAuthInit()

  useEffect(() => {
    // Initialize auth state on app startup
    initializeAuth()
  }, [initializeAuth])

  return <>{children}</>
}