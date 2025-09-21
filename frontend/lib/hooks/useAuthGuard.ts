import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useAuthGuard(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Get current path to redirect back after login
      const currentPath = window.location.pathname + window.location.search
      const returnUrl = encodeURIComponent(currentPath)
      router.push(`${redirectTo}?returnUrl=${returnUrl}`)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isAuthenticated, isLoading }
}

export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuthGuard(redirectTo)
  
  // Return whether the component should render
  // Only render if authenticated, or if still loading (to avoid flash)
  return isAuthenticated || isLoading
}