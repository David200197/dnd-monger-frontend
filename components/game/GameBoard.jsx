'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useAuthStore } from '@/lib/stores/authStore'
import { useGameStore } from '@/lib/stores/gameStore'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { 
  ArrowLeft, MessageSquare, Dice6, History, Monitor, Settings,
  Plus, Minus, RotateCcw, Eye, EyeOff, Square, Circle, Trash2,
  Send, ZoomIn, ZoomOut, Menu, Users, X, MousePointer
} from 'lucide-react'

import BoardGrid from './BoardGrid'
import ChatPanel from './ChatPanel'
import DiceRoller from './DiceRoller'
import ActionLog from './ActionLog'
import DMShareScreen from './DMShareScreen'

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#ffffff'
]

export default function GameBoard({ onLeave }) {
  const { t } = useTranslation()
  const { user, token } = useAuthStore()
  const { 
    currentGame, setCurrentGame, tokens, setTokens, addToken, updateToken, removeToken,
    obstacles, setObstacles, addObstacle, removeObstacle,
    fog, setFog, toggleFogCell,
    messages, setMessages, addMessage,
    actions, setActions, addAction,
    shareScreen, setShareScreen,
    addDiceRoll
  } = useGameStore()

  const [activeTab, setActiveTab] = useState('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [selectedTool, setSelectedTool] = useState('select') // select, token, obstacle, fog
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  const [tokenName, setTokenName] = useState('')
  const [showToolPanel, setShowToolPanel] = useState(false)
  const [dmPointer, setDmPointer] = useState(null)
  
  const boardRef = useRef(null)
  const syncIntervalRef = useRef(null)

  const isDM = currentGame?.dmId === user?.id
  const gridSize = currentGame?.gridSize || 20

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  // Sync game state periodically
  const syncGame = useCallback(async () => {
    if (!currentGame?.id || !token) return
    
    try {
      const res = await api.games.sync(currentGame.id, token)
      if (res.game) {
        setCurrentGame(res.game)
        setTokens(res.game.tokens || [])
        setObstacles(res.game.obstacles || [])
        setFog(res.game.fog || [])
        setShareScreen(res.game.shareScreen)
      }
      if (res.messages) {
        setMessages(res.messages)
      }
      if (res.actions) {
        setActions(res.actions)
      }
    } catch (error) {
      console.error('Sync error:', error)
    }
  }, [currentGame?.id, token])

  useEffect(() => {
    syncGame()
    syncIntervalRef.current = setInterval(syncGame, 2000) // Sync every 2 seconds
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [syncGame])

  // Handle token drag
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
    setIsDragging(true)
  }

  const handleDragEnd = async (event) => {
    setIsDragging(false)
    setActiveId(null)
    
    const { active, over } = event
    if (!over) return

    const tokenId = active.id
    const [newX, newY] = over.id.split('-').map(Number)
    
    // Update token position locally
    updateToken(tokenId, { x: newX, y: newY })
    
    // Get updated tokens
    const updatedTokens = tokens.map(t => 
      t.id === tokenId ? { ...t, x: newX, y: newY } : t
    )
    
    // Save to server
    try {
      await api.games.updateTokens(currentGame.id, updatedTokens, token)
      await api.actions.log(currentGame.id, {
        type: 'tokenMoved',
        data: { tokenId, x: newX, y: newY }
      }, token)
    } catch (error) {
      toast.error(t('app.error'))
    }
  }

  // Handle grid cell click
  const handleCellClick = async (x, y) => {
    if (selectedTool === 'token' && isDM) {
      const newToken = {
        id: uuidv4(),
        name: tokenName || `Token ${tokens.length + 1}`,
        color: selectedColor,
        x,
        y,
        size: 1
      }
      addToken(newToken)
      const updatedTokens = [...tokens, newToken]
      await api.games.updateTokens(currentGame.id, updatedTokens, token)
      await api.actions.log(currentGame.id, {
        type: 'tokenAdded',
        data: { tokenName: newToken.name }
      }, token)
      setTokenName('')
    } else if (selectedTool === 'obstacle' && isDM) {
      const newObstacle = {
        id: uuidv4(),
        x,
        y,
        type: 'solid',
        color: selectedColor
      }
      addObstacle(newObstacle)
      const updatedObstacles = [...obstacles, newObstacle]
      await api.games.updateObstacles(currentGame.id, updatedObstacles, token)
    } else if (selectedTool === 'fog' && isDM) {
      const key = `${x},${y}`
      const newFog = fog.includes(key) 
        ? fog.filter(f => f !== key)
        : [...fog, key]
      setFog(newFog)
      await api.games.updateFog(currentGame.id, newFog, token)
    }
  }

  // Handle remove token
  const handleRemoveToken = async (tokenId) => {
    removeToken(tokenId)
    const updatedTokens = tokens.filter(t => t.id !== tokenId)
    await api.games.updateTokens(currentGame.id, updatedTokens, token)
  }

  // Handle remove obstacle
  const handleRemoveObstacle = async (obstacleId) => {
    removeObstacle(obstacleId)
    const updatedObstacles = obstacles.filter(o => o.id !== obstacleId)
    await api.games.updateObstacles(currentGame.id, updatedObstacles, token)
  }

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3))
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4))
  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Leave game
  const handleLeaveGame = async () => {
    try {
      await api.games.leave(currentGame.id, token)
      onLeave()
    } catch (error) {
      onLeave()
    }
  }

  // Roll dice
  const handleDiceRoll = async (diceType, count, modifier) => {
    try {
      const res = await api.dice.roll(currentGame.id, diceType, count, modifier, token)
      if (res.roll) {
        addDiceRoll(res.roll)
        addAction({
          id: uuidv4(),
          type: 'diceRolled',
          username: user.username,
          data: res.roll,
          createdAt: new Date()
        })
      }
    } catch (error) {
      toast.error(t('app.error'))
    }
  }

  // Send message
  const handleSendMessage = async (content) => {
    try {
      const res = await api.messages.send(currentGame.id, content, token)
      if (res.message) {
        addMessage(res.message)
      }
    } catch (error) {
      toast.error(t('app.error'))
    }
  }

  // Update share screen
  const handleUpdateShareScreen = async (data) => {
    setShareScreen(data)
    await api.games.updateShareScreen(currentGame.id, data, token)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeaveGame}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <span className="text-white font-semibold">{currentGame?.name}</span>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            {currentGame?.players?.length || 0}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-300 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetView}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* DM Tools */}
          {isDM && (
            <Popover open={showToolPanel} onOpenChange={setShowToolPanel}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-600">
                  <Settings className="w-4 h-4 mr-2" />
                  DM Tools
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 bg-slate-800 border-slate-700" align="end">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">{t('board.tokens')}</label>
                    <div className="flex gap-2">
                      <Input
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        placeholder={t('board.tokenName')}
                        className="bg-slate-700 border-slate-600 text-sm"
                      />
                      <Button
                        size="sm"
                        variant={selectedTool === 'token' ? 'default' : 'outline'}
                        onClick={() => setSelectedTool(selectedTool === 'token' ? 'select' : 'token')}
                        className={selectedTool === 'token' ? 'bg-purple-600' : 'border-slate-600'}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">{t('board.tokenColor')}</label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${selectedColor === color ? 'scale-125 border-white' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedTool === 'obstacle' ? 'default' : 'outline'}
                      onClick={() => setSelectedTool(selectedTool === 'obstacle' ? 'select' : 'obstacle')}
                      className={`flex-1 ${selectedTool === 'obstacle' ? 'bg-orange-600' : 'border-slate-600'}`}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      {t('board.obstacles')}
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedTool === 'fog' ? 'default' : 'outline'}
                      onClick={() => setSelectedTool(selectedTool === 'fog' ? 'select' : 'fog')}
                      className={`flex-1 ${selectedTool === 'fog' ? 'bg-gray-600' : 'border-slate-600'}`}
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      {t('board.fogOfWar')}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        setFog([])
                        await api.games.updateFog(currentGame.id, [], token)
                      }}
                      className="flex-1 border-slate-600"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t('board.revealAll')}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile sidebar toggle */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-slate-900 border-slate-700 p-0">
              <SidePanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                messages={messages}
                onSendMessage={handleSendMessage}
                onDiceRoll={handleDiceRoll}
                actions={actions}
                isDM={isDM}
                shareScreen={shareScreen}
                onUpdateShareScreen={handleUpdateShareScreen}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Board Area */}
        <div className="flex-1 relative overflow-hidden bg-slate-900">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <BoardGrid
              ref={boardRef}
              gridSize={gridSize}
              tokens={tokens}
              obstacles={obstacles}
              fog={isDM ? [] : fog} // DM sees no fog
              zoom={zoom}
              pan={pan}
              onPan={setPan}
              onCellClick={handleCellClick}
              onRemoveToken={handleRemoveToken}
              onRemoveObstacle={handleRemoveObstacle}
              isDM={isDM}
              selectedTool={selectedTool}
              dmPointer={dmPointer}
              shareScreen={shareScreen}
            />
            <DragOverlay>
              {activeId ? (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  style={{ backgroundColor: tokens.find(t => t.id === activeId)?.color || '#3b82f6' }}
                >
                  {tokens.find(t => t.id === activeId)?.name?.[0] || '?'}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* DM Share Screen Overlay */}
          {shareScreen?.imageUrl && !isDM && (
            <DMShareScreen
              shareScreen={shareScreen}
              isViewer={true}
            />
          )}
        </div>

        {/* Side Panel - Desktop */}
        <div className="hidden lg:block w-80 border-l border-slate-700 bg-slate-800/50">
          <SidePanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            messages={messages}
            onSendMessage={handleSendMessage}
            onDiceRoll={handleDiceRoll}
            actions={actions}
            isDM={isDM}
            shareScreen={shareScreen}
            onUpdateShareScreen={handleUpdateShareScreen}
          />
        </div>
      </div>
    </div>
  )
}

// Side Panel Component
function SidePanel({ activeTab, setActiveTab, messages, onSendMessage, onDiceRoll, actions, isDM, shareScreen, onUpdateShareScreen }) {
  const { t } = useTranslation()

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 bg-slate-800 rounded-none border-b border-slate-700">
          <TabsTrigger value="chat" className="data-[state=active]:bg-slate-700">
            <MessageSquare className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="dice" className="data-[state=active]:bg-slate-700">
            <Dice6 className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="log" className="data-[state=active]:bg-slate-700">
            <History className="w-4 h-4" />
          </TabsTrigger>
          {isDM && (
            <TabsTrigger value="share" className="data-[state=active]:bg-slate-700">
              <Monitor className="w-4 h-4" />
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="chat" className="flex-1 m-0 data-[state=inactive]:hidden">
          <ChatPanel messages={messages} onSendMessage={onSendMessage} />
        </TabsContent>

        <TabsContent value="dice" className="flex-1 m-0 p-4 data-[state=inactive]:hidden">
          <DiceRoller onRoll={onDiceRoll} />
        </TabsContent>

        <TabsContent value="log" className="flex-1 m-0 data-[state=inactive]:hidden">
          <ActionLog actions={actions} />
        </TabsContent>

        {isDM && (
          <TabsContent value="share" className="flex-1 m-0 p-4 data-[state=inactive]:hidden">
            <DMShareScreen
              shareScreen={shareScreen}
              onUpdate={onUpdateShareScreen}
              isDM={true}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}