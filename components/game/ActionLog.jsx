'use client'

import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Move, Plus, Minus, Dice6, Eye, Square, MessageSquare, LogIn, LogOut 
} from 'lucide-react'

const ACTION_ICONS = {
  tokenMoved: Move,
  tokenAdded: Plus,
  tokenRemoved: Minus,
  diceRolled: Dice6,
  fogUpdated: Eye,
  obstacleAdded: Square,
  obstacleRemoved: Minus,
  messagePosted: MessageSquare,
  gameJoined: LogIn,
  gameLeft: LogOut
}

const ACTION_COLORS = {
  tokenMoved: 'text-blue-400',
  tokenAdded: 'text-green-400',
  tokenRemoved: 'text-red-400',
  diceRolled: 'text-purple-400',
  fogUpdated: 'text-gray-400',
  obstacleAdded: 'text-orange-400',
  obstacleRemoved: 'text-red-400',
  messagePosted: 'text-cyan-400',
  gameJoined: 'text-green-400',
  gameLeft: 'text-red-400'
}

export default function ActionLog({ actions }) {
  const { t } = useTranslation()

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const getActionText = (action) => {
    const { type, data, username } = action

    switch (type) {
      case 'tokenMoved':
        return `${username} ${t('actions.tokenMoved')}`
      case 'tokenAdded':
        return `${username} ${t('actions.tokenAdded')} "${data?.tokenName || 'Unknown'}"`
      case 'tokenRemoved':
        return `${username} ${t('actions.tokenRemoved')}`
      case 'diceRolled':
        return `${username} ${t('actions.diceRolled')} ${data?.count || 1}${data?.diceType || 'd20'}${data?.modifier > 0 ? `+${data.modifier}` : data?.modifier < 0 ? data.modifier : ''} = ${data?.total || '?'}`
      case 'fogUpdated':
        return `${username} ${t('actions.fogUpdated')}`
      case 'obstacleAdded':
        return `${username} ${t('actions.obstacleAdded')}`
      case 'obstacleRemoved':
        return `${username} ${t('actions.obstacleRemoved')}`
      case 'messagePosted':
        return `${username} ${t('actions.messagePosted')}`
      case 'gameJoined':
        return `${username} ${t('actions.gameJoined')}`
      case 'gameLeft':
        return `${username} ${t('actions.gameLeft')}`
      default:
        return `${username} performed ${type}`
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-700">
        <h3 className="font-semibold text-white">{t('actions.title')}</h3>
      </div>

      <ScrollArea className="flex-1 p-3">
        {actions.length === 0 ? (
          <p className="text-gray-500 text-center text-sm py-8">{t('actions.noActions')}</p>
        ) : (
          <AnimatePresence initial={false}>
            {actions.map((action) => {
              const Icon = ACTION_ICONS[action.type] || MessageSquare
              const colorClass = ACTION_COLORS[action.type] || 'text-gray-400'

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 py-2 border-b border-slate-700/50 last:border-0"
                >
                  <div className={`mt-0.5 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 break-words">
                      {getActionText(action)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatTime(action.createdAt)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </ScrollArea>
    </div>
  )
}