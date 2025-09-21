'use client'

import { useState } from 'react'
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useAuthActions } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
}

export default function ForgotPasswordModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin 
}: ForgotPasswordModalProps) {
  const { forgotPassword } = useAuthActions()
  
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    // Clear errors when user starts typing
    if (emailError) {
      setEmailError('')
    }
    if (apiError) {
      setApiError('')
    }
  }

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required')
      return false
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) return

    setIsLoading(true)
    setApiError('')
    setSuccessMessage('')

    try {
      const result = await forgotPassword(email)
      setSuccessMessage(result.message)
      setIsSubmitted(true)
      
    } catch (error: any) {
      console.error('Forgot password failed:', error)
      
      // Handle specific error types
      if (error.message.includes('Network error') || error.message.includes('CORS')) {
        setApiError('Connection failed. Please ensure the authentication service is running and CORS is properly configured.')
      } else if (error.message.includes('Server error')) {
        setApiError('Server error occurred. Please try again in a moment.')
      } else {
        setApiError(error.message || 'Failed to send reset password email. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setEmail('')
      setEmailError('')
      setApiError('')
      setSuccessMessage('')
      setIsSubmitted(false)
      onClose()
    }
  }

  const handleBackToLogin = () => {
    if (!isLoading) {
      setEmail('')
      setEmailError('')
      setApiError('')
      setSuccessMessage('')
      setIsSubmitted(false)
      if (onSwitchToLogin) {
        onSwitchToLogin()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isSubmitted ? 'Check Your Email' : 'Reset Password'}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {isSubmitted 
              ? 'We\'ve sent password reset instructions to your email address.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="space-y-4 mt-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-700">
                {successMessage}
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What to do next:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-700">
                    <li>Check your email inbox for our reset link</li>
                    <li>Click the link in the email to reset your password</li>
                    <li>Create a new secure password</li>
                    <li>Use your new password to sign in</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Didn't receive the email? Check your spam folder or</p>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setIsSubmitted(false)
                  setSuccessMessage('')
                }}
                disabled={isLoading}
              >
                try again with a different email
              </Button>
            </div>

            {onSwitchToLogin && (
              <div className="flex items-center justify-center space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Sign In</span>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {apiError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                  autoFocus
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Please note:</p>
                  <p>For security reasons, we'll send reset instructions to your email even if the account doesn't exist.</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </Button>

            {onSwitchToLogin && (
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                  className="p-0 h-auto text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back to Sign In</span>
                </Button>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}