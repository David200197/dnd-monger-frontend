'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sword, Shield, Wand2 } from 'lucide-react'

export default function AuthPage({ onSuccess }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const loginSchema = z.object({
    username: z.string().min(1, t('auth.usernameRequired')),
    password: z.string().min(1, t('auth.passwordRequired'))
  })

  const registerSchema = z.object({
    username: z.string().min(1, t('auth.usernameRequired')),
    email: z.string().email(t('auth.emailInvalid')).optional().or(z.literal('')),
    password: z.string().min(6, t('auth.passwordMinLength')),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.passwordsNotMatch'),
    path: ['confirmPassword']
  })

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' }
  })

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
  })

  const handleLogin = async (data) => {
    setLoading(true)
    try {
      const res = await api.auth.login(data)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(t('auth.loginSuccess'))
        onSuccess(res.user, res.token)
      }
    } catch (error) {
      toast.error(t('auth.invalidCredentials'))
    }
    setLoading(false)
  }

  const handleRegister = async (data) => {
    setLoading(true)
    try {
      const res = await api.auth.register({
        username: data.username,
        email: data.email,
        password: data.password
      })
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(t('auth.registerSuccess'))
        onSuccess(res.user, res.token)
      }
    } catch (error) {
      toast.error(t('app.error'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sword className="w-12 h-12 text-purple-400" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Shield className="w-12 h-12 text-pink-400" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Wand2 className="w-12 h-12 text-blue-400" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{t('app.title')}</h2>
          <p className="text-gray-400">Your adventure awaits</p>
        </motion.div>

        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
                {t('auth.login')}
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-purple-600">
                {t('auth.register')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-white">{t('auth.login')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.haveAccount')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-gray-300">
                      {t('auth.username')}
                    </Label>
                    <Input
                      id="login-username"
                      {...loginForm.register('username')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder={t('auth.username')}
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-red-400 text-sm">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-300">
                      {t('auth.password')}
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      {...loginForm.register('password')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder={t('auth.password')}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-red-400 text-sm">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('auth.login')}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader>
                <CardTitle className="text-white">{t('auth.register')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.noAccount')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-gray-300">
                      {t('auth.username')}
                    </Label>
                    <Input
                      id="register-username"
                      {...registerForm.register('username')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder={t('auth.username')}
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-red-400 text-sm">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-300">
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      {...registerForm.register('email')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder={t('auth.email')}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-red-400 text-sm">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-300">
                      {t('auth.password')}
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      {...registerForm.register('password')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder={t('auth.password')}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-red-400 text-sm">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm" className="text-gray-300">
                      {t('auth.confirmPassword')}
                    </Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      {...registerForm.register('confirmPassword')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder={t('auth.confirmPassword')}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-sm">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('auth.createAccount')}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}