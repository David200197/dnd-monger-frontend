'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/lib/stores/authStore'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Users, Crown, Play, RefreshCw } from 'lucide-react'

export default function Lobby({ onJoinGame }) {
  const { t } = useTranslation()
  const { user, token } = useAuthStore()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const createGameSchema = z.object({
    name: z.string().min(1, 'Game name is required'),
    description: z.string().optional(),
    maxPlayers: z.coerce.number().min(2).max(12).default(6)
  })

  const form = useForm({
    resolver: zodResolver(createGameSchema),
    defaultValues: { name: '', description: '', maxPlayers: 6 }
  })

  const fetchGames = async () => {
    setLoading(true)
    try {
      const res = await api.games.list(token)
      if (res.games) {
        setGames(res.games)
      }
    } catch (error) {
      toast.error(t('app.error'))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGames()
    const interval = setInterval(fetchGames, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleCreateGame = async (data) => {
    setCreating(true)
    try {
      const res = await api.games.create(data, token)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(t('lobby.gameCreated'))
        setDialogOpen(false)
        form.reset()
        fetchGames()
      }
    } catch (error) {
      toast.error(t('app.error'))
    }
    setCreating(false)
  }

  const handleJoinGame = async (gameId) => {
    try {
      const res = await api.games.join(gameId, token)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(t('lobby.gameJoined'))
        onJoinGame(res.game)
      }
    } catch (error) {
      toast.error(t('app.error'))
    }
  }

  const handleEnterGame = async (gameId) => {
    try {
      const res = await api.games.get(gameId, token)
      if (res.error) {
        toast.error(res.error)
      } else {
        onJoinGame(res.game)
      }
    } catch (error) {
      toast.error(t('app.error'))
    }
  }

  const myGames = games.filter(g => g.players?.some(p => p.id === user?.id))
  const availableGames = games.filter(g => !g.players?.some(p => p.id === user?.id))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white"
        >
          {t('lobby.title')}
        </motion.h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchGames}
            disabled={loading}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          {user?.role === 'dm' && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('lobby.createGame')}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">{t('lobby.createGame')}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Set up a new game session
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleCreateGame)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">{t('lobby.gameName')}</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder={t('lobby.gameName')}
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-400 text-sm">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">{t('lobby.description')}</Label>
                    <Textarea
                      id="description"
                      {...form.register('description')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder={t('lobby.description')}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers" className="text-gray-300">{t('lobby.maxPlayers')}</Label>
                    <Input
                      id="maxPlayers"
                      type="number"
                      {...form.register('maxPlayers')}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      min={2}
                      max={12}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-600 text-gray-300">
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={creating} className="bg-purple-600 hover:bg-purple-700">
                      {creating ? t('common.loading') : t('lobby.createGame')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* My Games */}
      {myGames.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">{t('lobby.myGames')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {myGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{game.name}</CardTitle>
                        {game.dmId === user?.id && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      {game.description && (
                        <CardDescription className="text-gray-400 line-clamp-2">
                          {game.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {game.players?.length || 0}/{game.maxPlayers} {t('lobby.players')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {t('lobby.createdBy')}: {game.dmUsername}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEnterGame(game.id)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {t('lobby.startGame')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Available Games */}
      <div>
        <h3 className="text-xl font-semibold text-blue-300 mb-4">{t('lobby.availableGames')}</h3>
        {loading && availableGames.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : availableGames.length === 0 ? (
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">{t('lobby.noGames')}</p>
              {user?.role === 'dm' && (
                <p className="text-gray-500 text-sm mt-2">Create a game to get started!</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {availableGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-blue-500/30 hover:border-blue-500/60 transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">{game.name}</CardTitle>
                      {game.description && (
                        <CardDescription className="text-gray-400 line-clamp-2">
                          {game.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {game.players?.length || 0}/{game.maxPlayers} {t('lobby.players')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {t('lobby.createdBy')}: {game.dmUsername}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleJoinGame(game.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        disabled={game.players?.length >= game.maxPlayers}
                      >
                        {game.players?.length >= game.maxPlayers ? 'Full' : t('lobby.joinGame')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}