'use client'

import { useState } from 'react'
import Header from './Header'
import ChatWindow from './ChatWindow'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen)
  }

  const handleChatClose = () => {
    setIsChatOpen(false)
  }

  return (
    <>
      <Header onChatToggle={handleChatToggle} />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Global Chat Widget */}
      <ChatWindow 
        isOpen={isChatOpen} 
        onToggle={handleChatToggle} 
        onClose={handleChatClose}
      />
    </>
  )
}
