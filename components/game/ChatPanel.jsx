'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/lib/stores/authStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

export default function ChatPanel({ messages, onSendMessage }) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-700">
        <h3 className="font-semibold text-white">{t('chat.title')}</h3>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center text-sm py-8">{t('chat.noMessages')}</p>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.userId === user?.id ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.username}`}
                    alt={msg.username}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className={`max-w-[70%] ${msg.userId === user?.id ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${msg.userId === user?.id ? 'text-purple-400' : 'text-gray-400'}`}>
                        {msg.username}
                      </span>
                      <span className="text-xs text-gray-500">{formatTime(msg.createdAt)}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        msg.userId === user?.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-gray-200'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="bg-slate-700 border-slate-600 text-white"
          />
          <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}