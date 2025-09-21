import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/bookings',
  '/quotations',
  '/admin',
  '/chat'
]

// Routes that should redirect to dashboard if user is already authenticated
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
]

// Admin-only routes
const adminRoutes = [
  '/admin'
]

// Designer routes
const designerRoutes = [
  '/designer'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from various sources
  const authToken = 
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.nextUrl.searchParams.get('token')

  let user = null
  let isAuthenticated = false

  // Verify token if present
  if (authToken) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      )
      
      const { payload } = await jwtVerify(authToken, secret)
      user = payload
      isAuthenticated = true
      
      // Add user info to request headers for server components
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.user_id as string)
      requestHeaders.set('x-user-email', payload.email as string)
      requestHeaders.set('x-user-role', payload.role as string || 'customer')
      requestHeaders.set('x-authenticated', 'true')

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

      return response
    } catch (error) {
      console.error('Token verification failed:', error)
      // Token is invalid, clear it
      const response = NextResponse.next()
      response.cookies.delete('auth_token')
      isAuthenticated = false
    }
  }

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check role-based access
    const userRole = user?.role as string || 'customer'
    
    // Admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    
    // Designer routes
    if (designerRoutes.some(route => pathname.startsWith(route))) {
      if (!['admin', 'designer'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Handle auth routes (redirect if already authenticated)
  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
