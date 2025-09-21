'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  LogIn, 
  UserPlus, 
  KeyRound,
  Globe,
  Server,
  Network
} from 'lucide-react'
import AuthManager, { useAuthManager } from '@/components/auth/AuthManager'
import { useUser, useAuthActions } from '@/lib/stores/auth-store'

export default function AuthTestPage() {
  const { user, isAuthenticated } = useUser()
  const { logout, checkAuth } = useAuthActions()
  const { activeModal, openLogin, openRegister, openForgotPassword, closeModal } = useAuthManager()
  
  const [corsTest, setCorsTest] = useState<{
    status: 'loading' | 'success' | 'error'
    message: string
  }>({ status: 'loading', message: 'Testing CORS...' })
  
  const [healthCheck, setHealthCheck] = useState<{
    status: 'loading' | 'success' | 'error'
    message: string
  }>({ status: 'loading', message: 'Checking service health...' })

  useEffect(() => {
    testCors()
    testHealthCheck()
    if (isAuthenticated) {
      checkAuth()
    }
  }, [])

  const testCors = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/auth/cors-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ test: 'cors-verification', timestamp: Date.now() }),
      })

      if (response.ok) {
        const data = await response.json()
        setCorsTest({
          status: 'success',
          message: `CORS working correctly! Origin: ${data.origin || 'localhost:3000'}`
        })
      } else {
        setCorsTest({
          status: 'error',
          message: `CORS test failed with status: ${response.status}`
        })
      }
    } catch (error: any) {
      setCorsTest({
        status: 'error',
        message: `CORS test failed: ${error.message}`
      })
    }
  }

  const testHealthCheck = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/auth/health', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setHealthCheck({
          status: 'success',
          message: `Auth service healthy: ${data.service} v${data.version}`
        })
      } else {
        setHealthCheck({
          status: 'error',
          message: `Health check failed with status: ${response.status}`
        })
      }
    } catch (error: any) {
      setHealthCheck({
        status: 'error',
        message: `Health check failed: ${error.message}`
      })
    }
  }

  const handleLogout = () => {
    logout()
  }

  const getStatusIcon = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return 'yellow'
      case 'success':
        return 'green'
      case 'error':
        return 'red'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Authentication System Test
        </h1>
        <p className="text-gray-600">
          Test the complete authentication flow with CORS support
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Service Status</span>
            </CardTitle>
            <CardDescription>Backend service connectivity and CORS configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Network className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Health Check</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthCheck.status)}
                <Badge variant={getStatusColor(healthCheck.status) as any}>
                  {healthCheck.status}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600">{healthCheck.message}</p>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">CORS Test</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(corsTest.status)}
                <Badge variant={getStatusColor(corsTest.status) as any}>
                  {corsTest.status}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600">{corsTest.message}</p>

            <Button 
              onClick={() => { testCors(); testHealthCheck(); }} 
              variant="outline" 
              className="w-full"
            >
              Retest Services
            </Button>
          </CardContent>
        </Card>

        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Authentication Status</span>
            </CardTitle>
            <CardDescription>Current user authentication state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAuthenticated && user ? (
              <>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700">
                    Successfully authenticated as {user.username}
                  </AlertDescription>
                </Alert>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Full Name:</strong> {user.full_name}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Not authenticated. Please sign in to test the authentication system.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Button onClick={openLogin} className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button onClick={openRegister} variant="outline" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Authentication Features */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Authentication Features</CardTitle>
          <CardDescription>
            Test all authentication components and flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button onClick={openLogin} variant="outline">
              <LogIn className="mr-2 h-4 w-4" />
              Test Login
            </Button>
            <Button onClick={openRegister} variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Test Registration
            </Button>
            <Button onClick={openForgotPassword} variant="outline">
              <KeyRound className="mr-2 h-4 w-4" />
              Test Forgot Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
          <CardDescription>How to verify the CORS fixes are working</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Ensure the Spring Boot auth service is running on port 8082</li>
            <li>Check that both Health Check and CORS Test show "success" status</li>
            <li>Test user registration with auto-login functionality</li>
            <li>Test login with existing credentials</li>
            <li>Test forgot password email sending</li>
            <li>Verify no CORS errors appear in browser DevTools</li>
            <li>Check that authentication state persists across page refreshes</li>
          </ol>
          
          {(corsTest.status === 'error' || healthCheck.status === 'error') && (
            <Alert className="mt-4" variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Service Issues Detected:</strong><br/>
                • Make sure the auth service is running: <code>mvn spring-boot:run</code><br/>
                • Check if MySQL database is running and accessible<br/>
                • Verify the service is accessible at <code>http://localhost:8082</code><br/>
                • Check browser console for additional error details
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Auth Manager */}
      <AuthManager activeModal={activeModal} onCloseModal={closeModal} />
    </div>
  )
}