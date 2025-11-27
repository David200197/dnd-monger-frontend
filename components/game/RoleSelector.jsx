'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/stores/authStore'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, User } from 'lucide-react'

export default function RoleSelector({ onRoleSelected }) {
  const { t } = useTranslation()
  const { token, setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleSelectRole = async (role) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      })
      const data = await res.json()
      
      if (data.error) {
        toast.error(data.error)
      } else {
        setAuth(data.user, data.token)
        toast.success(t('common.success'))
        onRoleSelected()
      }
    } catch (error) {
      toast.error(t('app.error'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">{t('roles.selectRole')}</h2>
          <p className="text-gray-400">Choose your destiny</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all cursor-pointer group"
              onClick={() => !loading && handleSelectRole('dm')}
            >
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4"
                >
                  <Crown className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-white text-2xl">{t('roles.dm')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('roles.dmDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-300 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Create and manage games
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Control fog of war
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Place obstacles and tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Share screen with players
                  </li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  disabled={loading}
                >
                  {loading ? t('common.loading') : `${t('common.confirm')} ${t('roles.dm')}`}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all cursor-pointer group"
              onClick={() => !loading && handleSelectRole('player')}
            >
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4"
                >
                  <User className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-white text-2xl">{t('roles.player')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('roles.playerDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-300 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Join existing games
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Control your character token
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Roll dice
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Chat with party
                  </li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  disabled={loading}
                >
                  {loading ? t('common.loading') : `${t('common.confirm')} ${t('roles.player')}`}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}