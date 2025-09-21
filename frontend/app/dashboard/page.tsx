'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Calculator, 
  MessageCircle, 
  BookOpen, 
  Settings, 
  LogOut,
  Home,
  CreditCard,
  Bell,
  BarChart3,
  Sparkles,
  ArrowRight,
  PlusCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuthStore, useUser, useAuthInit } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user, isAuthenticated } = useUser()
  const { logout } = useAuthStore()
  const { initializeAuth } = useAuthInit()
  const router = useRouter()

  useEffect(() => {
    initializeAuth()
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const dashboardStats = [
    { label: 'Projects', value: '3', icon: Home, color: 'bg-blue-100 text-blue-600' },
    { label: 'Quotations', value: '7', icon: Calculator, color: 'bg-green-100 text-green-600' },
    { label: 'Messages', value: '12', icon: MessageCircle, color: 'bg-purple-100 text-purple-600' },
    { label: 'Saved Items', value: '25', icon: BookOpen, color: 'bg-orange-100 text-orange-600' },
  ]

  const quickActions = [
    {
      title: 'Get Price Quote',
      description: 'Calculate costs for your next project',
      icon: Calculator,
      href: '/calculator',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Start Chat',
      description: 'Talk to our AI design assistant',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Browse Services',
      description: 'Explore our design services',
      icon: Sparkles,
      href: '/services',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      title: 'View Portfolio',
      description: 'Get inspired by our work',
      icon: BookOpen,
      href: '/#portfolio',
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      title: 'Living Room Quote Generated',
      description: 'Modern luxury style, ₹4,50,000 estimate',
      time: '2 hours ago',
      icon: Calculator
    },
    {
      id: 2,
      title: 'Chat with Design Assistant',
      description: 'Discussed color schemes for bedroom',
      time: '1 day ago',
      icon: MessageCircle
    },
    {
      id: 3,
      title: 'Portfolio Item Saved',
      description: 'Contemporary kitchen design',
      time: '3 days ago',
      icon: BookOpen
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Header />

      <section className="section-padding">
        <div className="container-elegant">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-blue-900 font-heading mb-2">
                  Welcome back, {user.full_name}!
                </h1>
                <p className="text-xl text-gray-600">
                  Ready to continue your interior design journey?
                </p>
              </div>
              <div className="mt-6 lg:mt-0">
                <button
                  onClick={handleLogout}
                  className="btn-secondary inline-flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-blue-900 font-heading mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className={`block p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${action.color}`}
                  >
                    <div className="mb-4">
                      <action.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm opacity-75">{action.description}</p>
                    <div className="flex items-center mt-4 text-sm font-medium">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-blue-900 font-heading">Recent Activity</h3>
                  <Link href="/activity" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-900 font-heading">Profile</h3>
                  <Link href="/profile" className="text-orange-600 hover:text-orange-700">
                    <Settings className="w-5 h-5" />
                  </Link>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">
                      {user.full_name.split(' ').map(name => name[0]).join('')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{user.full_name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                  <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {user.role === 'admin' ? '👑 Admin' : user.role === 'designer' ? '🎨 Designer' : '🏠 Customer'}
                  </div>
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-blue-900 font-heading mb-4">Navigation</h3>
                <div className="space-y-2">
                  <Link href="/profile" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <User className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">Profile Settings</span>
                  </Link>
                  <Link href="/quotations" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calculator className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">My Quotations</span>
                  </Link>
                  <Link href="/bookings" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BookOpen className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">My Bookings</span>
                  </Link>
                  {(user.role === 'admin' || user.role === 'designer') && (
                    <Link href="/admin" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-gray-700">Admin Panel</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
