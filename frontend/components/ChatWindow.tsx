'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  MessageCircle, 
  Bot, 
  User, 
  Maximize2, 
  Minimize2, 
  X,
  Calculator,
  BookOpen,
  Phone,
  Image as ImageIcon,
  Paperclip
} from 'lucide-react'
import { useUser, useAuthStore } from '@/lib/stores/auth-store'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Message {
  id: string
  content: string
  message_type: 'user' | 'assistant'
  timestamp: Date
  user_id?: string
  metadata?: {
    suggestions?: string[]
    actions?: Array<{
      type: string
      label: string
      href?: string
      data?: any
    }>
  }
}

interface ChatWindowProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  sessionId?: string
}

export default function ChatWindow({ isOpen, onToggle, onClose, sessionId }: ChatWindowProps) {
  const { user, isAuthenticated } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Temporarily use REST API instead of WebSocket
  const [isConnected, setIsConnected] = useState(true)
  const sendMessage = async (content: string) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'
    const token = useAuthStore.getState().token
    
    if (!token) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          message: content,
          session_id: sessionId,
          context: null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to send message')
      }

      const responseData = await response.json()
      
      // Add AI response to messages
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        content: responseData.message || 'I received your message.',
        message_type: 'assistant',
        timestamp: new Date(responseData.timestamp || new Date()),
        metadata: {
          suggestions: responseData.suggestions || undefined
        }
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    } catch (error) {
      console.error('Chat API error:', error)
      throw error
    }
  }

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!isAuthenticated || !sessionId) return
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'
      const token = useAuthStore.getState().token
      
      if (!token) return
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        })
        
        if (response.ok) {
          const history = await response.json()
          if (history.messages) {
            setMessages(history.messages)
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }
    
    loadChatHistory()
  }, [isAuthenticated, sessionId])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isAuthenticated) return

    const messageId = `msg_${Date.now()}`
    const userMessage: Message = {
      id: messageId,
      content: inputValue.trim(),
      message_type: 'user',
      timestamp: new Date(),
      user_id: user?.id
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      await sendMessage(inputValue.trim())
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message. Please try again.')
      setIsLoading(false)
      // Remove the user message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickAction = async (action: string) => {
    const actionMessages: Record<string, string> = {
      'Get Price Quote': 'I would like to get a price quote for my interior design project.',
      'Book Consultation': 'I would like to book a consultation with a designer.',
      'View Portfolio': 'Can you show me some portfolio examples?',
      'Upload Room Photo': 'I would like to upload a photo of my room for analysis.',
      'Speak to Designer': 'I would like to speak to a human designer.'
    }

    const message = actionMessages[action]
    if (message) {
      setInputValue(message)
      setTimeout(() => handleSendMessage(), 100)
    }
  }

  const MessageBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-2 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-orange-600 text-white' 
            : 'bg-blue-600 text-white'
        }`}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div className={`rounded-2xl px-4 py-2 max-w-full ${
            isUser 
              ? 'bg-orange-600 text-white rounded-tr-md' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-md'
          }`}>
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* Timestamp */}
          <span className="text-xs text-gray-500 mt-1 px-2">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>

          {/* Quick Actions */}
          {!isUser && message.metadata?.suggestions && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.metadata.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(suggestion)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  const quickActions = [
    { label: 'Get Price Quote', icon: Calculator },
    { label: 'Book Consultation', icon: Phone },
    { label: 'View Portfolio', icon: BookOpen },
    { label: 'Upload Room Photo', icon: ImageIcon },
  ]

  if (!isAuthenticated) {
    return (
      <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-80 h-96'} bg-white rounded-2xl shadow-xl border border-gray-200 flex items-center justify-center z-50`}>
        <div className="text-center p-6">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Please sign in to use the chat feature</p>
          <button className="btn-primary text-sm">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-colors z-50 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`fixed ${
              isExpanded 
                ? 'inset-4' 
                : 'bottom-6 right-6 w-96 h-[32rem]'
            } bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-orange-600 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Design Assistant</h3>
                  <p className="text-xs opacity-75">
                    {isConnected ? 'Online' : 'Connecting...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Welcome to your Design Assistant!
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    I'm here to help with your interior design questions, price estimates, and more.
                  </p>
                  
                  {/* Quick Start Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.label)}
                        className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors text-sm"
                      >
                        <action.icon className="w-4 h-4 mr-2 text-orange-600" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {messages.map((message) => (
                    <MessageBubble 
                      key={message.id} 
                      message={message} 
                      isUser={message.message_type === 'user'} 
                    />
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-2 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isLoading ? "AI is thinking..." : "Ask me about interior design..."}
                    disabled={isLoading || !isConnected}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none disabled:opacity-50"
                    maxLength={500}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || !isConnected}
                  className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              
              {/* Character Counter */}
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>
                  {!isConnected && (
                    <span className="text-red-500">Connection lost</span>
                  )}
                </span>
                <span>{inputValue.length}/500</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
