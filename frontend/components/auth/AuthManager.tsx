'use client'

import { useState } from 'react'
import LoginModal from '@/components/modals/LoginModal'
import RegisterModal from '@/components/modals/RegisterModal'
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal'

export type AuthModalType = 'login' | 'register' | 'forgot-password' | null

interface AuthManagerProps {
  activeModal: AuthModalType
  onCloseModal: () => void
}

/**
 * AuthManager Component
 * 
 * Orchestrates all authentication modals (Login, Register, Forgot Password)
 * Handles switching between modals and maintains state
 */
export default function AuthManager({ activeModal, onCloseModal }: AuthManagerProps) {
  const [currentModal, setCurrentModal] = useState<AuthModalType>(activeModal)

  // Update current modal when prop changes
  useState(() => {
    setCurrentModal(activeModal)
  })

  const handleCloseModal = () => {
    setCurrentModal(null)
    onCloseModal()
  }

  const switchToLogin = () => {
    setCurrentModal('login')
  }

  const switchToRegister = () => {
    setCurrentModal('register')
  }

  const switchToForgotPassword = () => {
    setCurrentModal('forgot-password')
  }

  return (
    <>
      {/* Login Modal */}
      <LoginModal
        isOpen={currentModal === 'login'}
        onClose={handleCloseModal}
        onSwitchToRegister={switchToRegister}
        onSwitchToForgotPassword={switchToForgotPassword}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={currentModal === 'register'}
        onClose={handleCloseModal}
        onSwitchToLogin={switchToLogin}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={currentModal === 'forgot-password'}
        onClose={handleCloseModal}
        onSwitchToLogin={switchToLogin}
      />
    </>
  )
}

// Custom hook for managing auth modals
export function useAuthManager() {
  const [activeModal, setActiveModal] = useState<AuthModalType>(null)

  const openLogin = () => setActiveModal('login')
  const openRegister = () => setActiveModal('register')
  const openForgotPassword = () => setActiveModal('forgot-password')
  const closeModal = () => setActiveModal(null)

  return {
    activeModal,
    openLogin,
    openRegister,
    openForgotPassword,
    closeModal,
  }
}