'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Image, MousePointer, Trash2 } from 'lucide-react'

export default function DMShareScreen({ shareScreen, onUpdate, isDM, isViewer }) {
  const { t } = useTranslation()
  const [imageUrl, setImageUrl] = useState('')
  const [pointerPos, setPointerPos] = useState(null)
  const imageRef = useRef(null)

  // If this is the viewer overlay
  if (isViewer && shareScreen?.imageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 z-40 flex items-center justify-center"
      >
        <div className="relative max-w-4xl max-h-full p-4">
          <img
            src={shareScreen.imageUrl}
            alt="DM Share"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
          {/* DM Pointer indicator */}
          {shareScreen.pointer && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${shareScreen.pointer.x}%`,
                top: `${shareScreen.pointer.y}%`
              }}
            >
              <div className="w-full h-full rounded-full bg-red-500/50 animate-ping" />
              <MousePointer className="absolute inset-0 m-auto w-5 h-5 text-red-500" />
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  // DM controls
  if (!isDM) return null

  const handleSetImage = () => {
    if (imageUrl.trim()) {
      onUpdate({ ...shareScreen, imageUrl: imageUrl.trim() })
      setImageUrl('')
    }
  }

  const handleClearImage = () => {
    onUpdate(null)
  }

  const handlePointerMove = (e) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPointerPos({ x, y })
    onUpdate({ ...shareScreen, pointer: { x, y } })
  }

  const handlePointerLeave = () => {
    setPointerPos(null)
    onUpdate({ ...shareScreen, pointer: null })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-white">{t('share.title')}</h3>
      <p className="text-sm text-gray-400">{t('share.description')}</p>

      {/* Image URL input */}
      <div className="flex gap-2">
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder={t('share.imageUrl')}
          className="bg-slate-700 border-slate-600 text-white"
        />
        <Button onClick={handleSetImage} className="bg-purple-600 hover:bg-purple-700">
          <Image className="w-4 h-4" />
        </Button>
      </div>

      {/* Current shared image */}
      {shareScreen?.imageUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{t('share.pointerActive')}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearImage}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {t('share.clearImage')}
            </Button>
          </div>
          <div
            ref={imageRef}
            className="relative rounded-lg overflow-hidden cursor-crosshair"
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
          >
            <img
              src={shareScreen.imageUrl}
              alt="Share preview"
              className="w-full h-auto max-h-48 object-contain bg-slate-900"
            />
            {pointerPos && (
              <div
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${pointerPos.x}%`, top: `${pointerPos.y}%` }}
              >
                <div className="w-full h-full rounded-full bg-red-500/50 animate-ping" />
                <MousePointer className="absolute inset-0 m-auto w-3 h-3 text-red-500" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center">
            Move your cursor over the image to show the pointer to players
          </p>
        </div>
      )}
    </div>
  )
}