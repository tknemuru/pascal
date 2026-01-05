'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export default function DraggableSquare() {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [squareSize] = useState(120) // 4歳児に適した大きさ

  // 画面サイズに応じた制約を計算
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  })

  useEffect(() => {
    const updateConstraints = () => {
      if (typeof window !== 'undefined') {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        
        setConstraints({
          left: -(screenWidth / 2 - squareSize / 2),
          right: screenWidth / 2 - squareSize / 2,
          top: -(screenHeight / 2 - squareSize / 2),
          bottom: screenHeight / 2 - squareSize / 2,
        })
      }
    }

    updateConstraints()
    window.addEventListener('resize', updateConstraints)
    window.addEventListener('orientationchange', updateConstraints)

    return () => {
      window.removeEventListener('resize', updateConstraints)
      window.removeEventListener('orientationchange', updateConstraints)
    }
  }, [squareSize])

  return (
    <div ref={constraintsRef} className="relative w-full h-full">
      <motion.div
        drag
        dragConstraints={constraints}
        dragElastic={0}
        dragTransition={{ 
          bounceStiffness: 600, 
          bounceDamping: 20,
          power: 0.3 
        }}
        whileTap={{ 
          scale: 1.1,
          cursor: 'grabbing'
        }}
        whileDrag={{ 
          scale: 1.15,
          cursor: 'grabbing',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab"
        style={{
          width: squareSize,
          height: squareSize,
        }}
      >
        <div 
          className="w-full h-full bg-blue-500 rounded-2xl shadow-lg flex items-center justify-center"
          style={{
            touchAction: 'none',
          }}
        >
          <div className="text-white text-4xl font-bold select-none">■</div>
        </div>
      </motion.div>
    </div>
  )
}
