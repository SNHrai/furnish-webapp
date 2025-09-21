import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  content: string
  message_type: 'user' | 'assistant'
  timestamp: Date
  user_id?: string
  session_id?: string
}

interface SocketResponse {
  type: 'message' | 'error' | 'typing' | 'stop_typing'
  data: any
}

export const useChatSocket = (roomId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  
  const { token, user, isAuthenticated } = useAuthStore()
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001'}/ws/chat/${roomId}`

  const connect = () => {
    if (!isAuthenticated || !token) {
      console.log('Cannot connect: user not authenticated')
      return
    }

    try {
      const ws = new WebSocket(`${wsUrl}?token=${token}`)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setIsReconnecting(false)
        reconnectAttemptsRef.current = 0
        
        // Send initial user info
        ws.send(JSON.stringify({
          type: 'user_join',
          data: {
            user_id: user?.id,
            room_id: roomId
          }
        }))
      }

      ws.onmessage = (event) => {
        try {
          const response: SocketResponse = JSON.parse(event.data)
          
          switch (response.type) {
            case 'message':
              // Emit message event for components to listen
              window.dispatchEvent(new CustomEvent('chat_message', {
                detail: response.data
              }))
              break
              
            case 'typing':
              setTypingUsers(prev => {
                if (!prev.includes(response.data.user_id)) {
                  return [...prev, response.data.user_id]
                }
                return prev
              })
              break
              
            case 'stop_typing':
              setTypingUsers(prev => prev.filter(id => id !== response.data.user_id))
              break
              
            case 'error':
              console.error('WebSocket error:', response.data)
              toast.error(response.data.message || 'Chat error occurred')
              break
              
            default:
              console.log('Unknown message type:', response.type)
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setSocket(null)
        
        // Auto-reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          scheduleReconnect()
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          toast.error('Unable to connect to chat. Please refresh the page.')
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }

      setSocket(ws)
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      toast.error('Failed to connect to chat')
    }
  }

  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    setIsReconnecting(true)
    reconnectAttemptsRef.current += 1
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000) // Exponential backoff, max 30s
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
      connect()
    }, delay)
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (socket) {
      socket.close(1000, 'User disconnected')
    }
  }

  const sendMessage = async (content: string): Promise<void> => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected')
    }

    if (!content.trim()) {
      throw new Error('Message content cannot be empty')
    }

    try {
      // Send typing indicator
      socket.send(JSON.stringify({
        type: 'typing',
        data: {
          user_id: user?.id,
          room_id: roomId
        }
      }))

      // Send the actual message
      const message = {
        type: 'message',
        data: {
          content: content.trim(),
          user_id: user?.id,
          room_id: roomId,
          timestamp: new Date().toISOString()
        }
      }

      socket.send(JSON.stringify(message))

      // Stop typing indicator after a short delay
      setTimeout(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'stop_typing',
            data: {
              user_id: user?.id,
              room_id: roomId
            }
          }))
        }
      }, 500)
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const sendTyping = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'typing',
        data: {
          user_id: user?.id,
          room_id: roomId
        }
      }))
    }
  }

  const sendStopTyping = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'stop_typing',
        data: {
          user_id: user?.id,
          room_id: roomId
        }
      }))
    }
  }

  const reconnect = () => {
    disconnect()
    reconnectAttemptsRef.current = 0
    connect()
  }

  // Connect when authenticated and component mounts
  useEffect(() => {
    if (isAuthenticated && token) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [isAuthenticated, token, roomId])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      disconnect()
    }
  }, [])

  return {
    socket,
    isConnected,
    isReconnecting,
    typingUsers,
    sendMessage,
    sendTyping,
    sendStopTyping,
    reconnect,
    disconnect
  }
}
