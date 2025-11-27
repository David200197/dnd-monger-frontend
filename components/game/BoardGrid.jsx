'use client'

import { forwardRef, useState, useRef, useEffect } from 'react'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const BoardGrid = forwardRef(function BoardGrid({
  gridSize,
  tokens,
  obstacles,
  fog,
  zoom,
  pan,
  onPan,
  onCellClick,
  onRemoveToken,
  onRemoveObstacle,
  isDM,
  selectedTool,
  dmPointer,
  shareScreen
}, ref) {
  const containerRef = useRef(null)
  const [isPanning, setIsPanning] = useState(false)
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const [selectedToken, setSelectedToken] = useState(null)

  const cellSize = 40 * zoom

  // Handle mouse pan
  const handleMouseDown = (e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle click or Alt+click
      setIsPanning(true)
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e) => {
    if (isPanning) {
      onPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isPanning, startPan])

  // Handle wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault()
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-grab"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    >
      <div
        ref={ref}
        className="relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          width: gridSize * cellSize,
          height: gridSize * cellSize
        }}
      >
        {/* Grid cells */}
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize
          const y = Math.floor(index / gridSize)
          const isFogged = fog.includes(`${x},${y}`)
          const obstacle = obstacles.find(o => o.x === x && o.y === y)

          return (
            <GridCell
              key={`${x}-${y}`}
              x={x}
              y={y}
              cellSize={cellSize}
              isFogged={isFogged}
              obstacle={obstacle}
              onClick={() => onCellClick(x, y)}
              selectedTool={selectedTool}
              isDM={isDM}
              onRemoveObstacle={onRemoveObstacle}
            />
          )
        })}

        {/* Tokens */}
        {tokens.map(token => (
          <Token
            key={token.id}
            token={token}
            cellSize={cellSize}
            isSelected={selectedToken === token.id}
            onSelect={() => setSelectedToken(token.id)}
            onRemove={() => onRemoveToken(token.id)}
            isDM={isDM}
            isFogged={!isDM && fog.includes(`${token.x},${token.y}`)}
          />
        ))}

        {/* DM Pointer */}
        {dmPointer && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute pointer-events-none z-50"
            style={{
              left: dmPointer.x * cellSize,
              top: dmPointer.y * cellSize,
              width: cellSize,
              height: cellSize
            }}
          >
            <div className="w-full h-full rounded-full border-4 border-red-500 animate-ping" />
          </motion.div>
        )}
      </div>
    </div>
  )
})

// Grid Cell Component
function GridCell({ x, y, cellSize, isFogged, obstacle, onClick, selectedTool, isDM, onRemoveObstacle }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${x}-${y}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={`absolute border border-slate-700/50 transition-colors ${
        isOver ? 'bg-purple-500/30' : ''
      } ${
        selectedTool !== 'select' ? 'cursor-crosshair hover:bg-purple-500/20' : ''
      }`}
      style={{
        left: x * cellSize,
        top: y * cellSize,
        width: cellSize,
        height: cellSize
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Obstacle */}
      {obstacle && (
        <div
          className="absolute inset-1 rounded group"
          style={{ backgroundColor: obstacle.color || '#6b7280' }}
        >
          {isDM && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemoveObstacle(obstacle.id)
              }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
      )}

      {/* Fog */}
      {isFogged && (
        <div className="absolute inset-0 bg-slate-900/95" />
      )}
    </div>
  )
}

// Token Component
function Token({ token, cellSize, isSelected, onSelect, onRemove, isDM, isFogged }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: token.id,
  })

  if (isFogged) return null

  const style = {
    left: token.x * cellSize + (cellSize - cellSize * 0.9) / 2,
    top: token.y * cellSize + (cellSize - cellSize * 0.9) / 2,
    width: cellSize * 0.9,
    height: cellSize * 0.9,
    backgroundColor: token.color,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 10
  }

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`absolute rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-grab active:cursor-grabbing group ${
        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
      }`}
      style={style}
      onClick={() => onSelect()}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-xs truncate px-1">{token.name?.[0] || '?'}</span>
      
      {/* Token name tooltip */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 px-2 py-0.5 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {token.name}
      </div>

      {/* Remove button for DM */}
      {isDM && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
    </motion.div>
  )
}

export default BoardGrid