'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import ChatWindow from '@/components/ChatWindow'
import { useUser } from '@/lib/stores/auth-store'

export default function ChatPage() {
  const { user, isAuthenticated } = useUser()
  const [isChatOpen, setIsChatOpen] = useState(true)

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4"
        >
          <MessageCircle className="w-16 h-16 text-orange-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Chat with Our AI Assistant
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to access our AI-powered design assistant and get personalized help with your interior design projects.
          </p>
          <div className="space-y-4">
            <Link href="/login" className="btn-primary w-full">
              Sign In to Chat
            </Link>
            <Link href="/register" className="btn-secondary w-full">
              Create Account
            </Link>
          </div>
          <div className="mt-6">
            <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors inline-flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-blue-900">
                AI Design Assistant
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-600">
                  {user?.role === 'admin' ? '👑 Admin' : user?.role === 'designer' ? '🎨 Designer' : '🏠 Customer'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.full_name?.split(' ').map(name => name[0]).join('') || '?'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="pt-20 h-screen">
        <ChatWindow
          isOpen={isChatOpen}
          onToggle={handleToggleChat}
          onClose={handleCloseChat}
          sessionId={`user_${user?.id}_chat`}
        />
      </div>

      {/* Help Text */}
      {!isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <p className="text-gray-600 text-sm mb-4">
            Chat window closed. Click the chat button to open it again.
          </p>
          <button
            onClick={handleToggleChat}
            className="btn-primary inline-flex items-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Open Chat
          </button>
        </motion.div>
      )}
    </div>
  )
}
