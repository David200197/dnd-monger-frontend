'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trash2 } from 'lucide-react'

const DICE_TYPES = [
  { type: 'd4', sides: 4, color: 'from-red-500 to-red-700' },
  { type: 'd6', sides: 6, color: 'from-orange-500 to-orange-700' },
  { type: 'd8', sides: 8, color: 'from-yellow-500 to-yellow-700' },
  { type: 'd10', sides: 10, color: 'from-green-500 to-green-700' },
  { type: 'd12', sides: 12, color: 'from-blue-500 to-blue-700' },
  { type: 'd20', sides: 20, color: 'from-purple-500 to-purple-700' },
  { type: 'd100', sides: 100, color: 'from-pink-500 to-pink-700' }
]

export default function DiceRoller({ onRoll }) {
  const { t } = useTranslation()
  const { diceHistory, clearDiceHistory } = useGameStore()
  const [selectedDice, setSelectedDice] = useState('d20')
  const [count, setCount] = useState(1)
  const [modifier, setModifier] = useState(0)
  const [isRolling, setIsRolling] = useState(false)

  const handleRoll = async () => {
    setIsRolling(true)
    await onRoll(selectedDice, count, modifier)
    setTimeout(() => setIsRolling(false), 500)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-white">{t('dice.title')}</h3>

      {/* Dice type selector */}
      <div className="grid grid-cols-4 gap-2">
        {DICE_TYPES.map(dice => (
          <motion.button
            key={dice.type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDice(dice.type)}
            className={`p-2 rounded-lg text-center transition-all ${
              selectedDice === dice.type
                ? `bg-gradient-to-br ${dice.color} text-white shadow-lg`
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span className="text-sm font-bold">{dice.type.toUpperCase()}</span>
          </motion.button>
        ))}
      </div>

      {/* Count and modifier */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Count</label>
          <Input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            min={1}
            max={10}
            className="bg-slate-700 border-slate-600 text-white text-center"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{t('dice.modifier')}</label>
          <Input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            className="bg-slate-700 border-slate-600 text-white text-center"
          />
        </div>
      </div>

      {/* Roll button */}
      <motion.div
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleRoll}
          disabled={isRolling}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
        >
          <motion.span
            animate={isRolling ? { rotate: 360 } : {}}
            transition={{ duration: 0.5 }}
            className="mr-2"
          >
            <Dice6 className="w-6 h-6" />
          </motion.span>
          {t('dice.roll')} {count}{selectedDice}{modifier > 0 ? `+${modifier}` : modifier < 0 ? modifier : ''}
        </Button>
      </motion.div>

      {/* History */}
      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-400">{t('dice.history')}</h4>
          {diceHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDiceHistory}
              className="text-gray-500 hover:text-gray-300 h-6 px-2"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              {t('dice.clearHistory')}
            </Button>
          )}
        </div>
        <ScrollArea className="h-40">
          <AnimatePresence>
            {diceHistory.map((roll, index) => (
              <motion.div
                key={roll.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-700/50 rounded-lg p-2 mb-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{roll.username}</span>
                  <span className="text-xs text-gray-500">
                    {roll.count}{roll.diceType}{roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier < 0 ? roll.modifier : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-wrap">
                    {roll.rolls?.map((r, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          r === parseInt(roll.diceType.replace('d', ''))
                            ? 'bg-green-500/30 text-green-300'
                            : r === 1
                            ? 'bg-red-500/30 text-red-300'
                            : 'bg-slate-600 text-gray-300'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-white ml-auto">
                    = {roll.total}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {diceHistory.length === 0 && (
            <p className="text-gray-500 text-center text-sm py-4">No rolls yet</p>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}