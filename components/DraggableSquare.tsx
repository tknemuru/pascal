'use client'

import { motion, useMotionValue, animate, PanInfo } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { calculateSnapPosition } from '@/src/utils/snapPhysics'
import {
  SQUARE_SIZE,
  TARGET_SIZE,
  DEFAULT_SNAP_THRESHOLD,
} from '@/src/config/constants'
import { useSnapSound } from '@/src/hooks/useSnapSound'
import { AnimeEyes } from './AnimeEyes'
import { useBlinkAnimation } from '@/src/hooks/useBlinkAnimation'
import { useRandomColor } from '@/src/hooks/useRandomColor'

export default function DraggableSquare() {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [squareSize] = useState(SQUARE_SIZE)
  const targetSize = TARGET_SIZE
  const snapThreshold = DEFAULT_SNAP_THRESHOLD

  // スナップ音の再生フック
  const { playSnapSound } = useSnapSound()
  
  // まばたきアニメーションフック
  const { isBlinking } = useBlinkAnimation()
  
  // ランダムな色を選択
  const shapeColor = useRandomColor()

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
      shapeType: 'square',
      targetShapeType: 'square',
    })
    
    // スナップすべき場合はアニメーションと効果音を実行
    if (snapResult.shouldSnap) {
      // スナップ音を再生
      playSnapSound()
      
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-white rounded-none bg-gray-800"
        style={{
          width: targetSize,
          height: targetSize,
          zIndex: 0,
        }}
      />

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
          className="w-full h-full rounded-none shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: shapeColor,
            touchAction: 'none',
          }}
        >
          <AnimeEyes isBlinking={isBlinking} />
        </div>
      </motion.div>
    </div>
  )
}
