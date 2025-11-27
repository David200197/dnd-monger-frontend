'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/lib/stores/authStore'
import { useGameStore } from '@/lib/stores/gameStore'
import { api } from '@/lib/api'
import { toast } from 'sonner'

// Components
import AuthPage from '@/components/game/AuthPage'
import RoleSelector from '@/components/game/RoleSelector'
import Lobby from '@/components/game/Lobby'
import GameBoard from '@/components/game/GameBoard'
import LanguageSwitcher from '@/components/game/LanguageSwitcher'

export default function App() {
  const { t } = useTranslation()
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore()
  const { currentGame, setCurrentGame, resetGame } = useGameStore()
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('auth') // auth, role, lobby, game

  useEffect(() => {
    const initApp = async () => {
      if (token) {
        try {
          const res = await api.auth.me(token)
          if (res.user) {
            setAuth(res.user, token)
            if (res.user.role) {
              setView('lobby')
            } else {
              setView('role')
            }
          } else {
            logout()
            setView('auth')
          }
        } catch (error) {
          logout()
          setView('auth')
        }
      } else {
        setView('auth')
      }
      setLoading(false)
    }
    initApp()
  }, [])

  const handleAuthSuccess = (userData, authToken) => {
    setAuth(userData, authToken)
    if (userData.role) {
      setView('lobby')
    } else {
      setView('role')
    }
  }

  const handleRoleSelected = () => {
    setView('lobby')
  }

  const handleJoinGame = (game) => {
    setCurrentGame(game)
    setView('game')
  }

  const handleLeaveGame = () => {
    resetGame()
    setView('lobby')
  }

  const handleLogout = () => {
    logout()
    resetGame()
    setView('auth')
    toast.success(t('auth.logout'))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            MapMaster
          </motion.h1>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full border-2 border-purple-500"
                  />
                  <span className="text-white text-sm hidden sm:block">{user?.username}</span>
                  {user?.role && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 uppercase">
                      {user.role === 'dm' ? t('roles.dm') : t('roles.player')}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('auth.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          {view === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AuthPage onSuccess={handleAuthSuccess} />
            </motion.div>
          )}

          {view === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RoleSelector onRoleSelected={handleRoleSelected} />
            </motion.div>
          )}

          {view === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Lobby onJoinGame={handleJoinGame} />
            </motion.div>
          )}

          {view === 'game' && currentGame && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-64px)]"
            >
              <GameBoard onLeave={handleLeaveGame} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}