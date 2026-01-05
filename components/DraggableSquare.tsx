'use client'

import { motion, useMotionValue, animate, PanInfo } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { calculateSnapPosition } from '@/src/utils/snapPhysics'

export default function DraggableSquare() {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [squareSize] = useState(120) // 4歳児に適した大きさ
  const targetSize = 140 // ターゲット枠のサイズ（正方形より少し大きめ）
  const snapThreshold = 50 // スナップ判定の閾値（px）

  // framer-motionのMotionValueで位置を管理（再レンダリングなし）
  const x = useMotionValue(0)
  const y = useMotionValue(0)

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

  // ドラッグ終了時の処理
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // ドロップ時の画面上の絶対座標を取得
    const dropX = info.point.x
    const dropY = info.point.y
    
    // 画面中央の座標を計算（ターゲット位置）
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    
    // 純粋関数でスナップ判定を実行
    const snapResult = calculateSnapPosition({
      currentX: dropX,
      currentY: dropY,
      targetX: centerX,
      targetY: centerY,
      threshold: snapThreshold,
    })
    
    // スナップすべき場合はアニメーションを実行
    if (snapResult.shouldSnap) {
      // MotionValueを直接アニメーション（Spring物理演算）
      animate(x, snapResult.snapX, {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      })
      
      animate(y, snapResult.snapY, {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      })
    }
  }

  return (
    <div ref={constraintsRef} className="relative w-full h-full">
      {/* ターゲット枠（背面） */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-white rounded-2xl bg-black/30"
        style={{
          width: targetSize,
          height: targetSize,
          zIndex: 0,
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white/50 text-5xl select-none">□</span>
        </div>
      </div>

      {/* ドラッグ可能な正方形（前面） */}
      <motion.div
        drag
        dragConstraints={constraints}
        dragElastic={0}
        dragMomentum={false}
        dragTransition={{ 
          bounceStiffness: 600, 
          bounceDamping: 20,
          power: 0.3 
        }}
        onDragEnd={handleDragEnd}
        style={{
          x,
          y,
          width: squareSize,
          height: squareSize,
          zIndex: 10,
          left: '50%',
          top: '50%',
          translateX: '-50%',
          translateY: '-50%',
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
        className="absolute cursor-grab"
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
