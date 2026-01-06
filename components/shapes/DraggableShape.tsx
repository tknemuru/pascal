'use client'

import { motion, useMotionValue, animate, PanInfo } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import type { Shape, Rotation, TargetSlot } from '@/src/types/shapes'
import { ShapeRenderer } from './ShapeRenderer'
import { useBlinkAnimation } from '@/src/hooks/useBlinkAnimation'
import { useSnapSound } from '@/src/hooks/useSnapSound'
import { DEFAULT_SNAP_THRESHOLD, SNAP_ANIMATION, ROTATION_ANIMATION } from '@/src/config/constants'
import { checkShapeMatch } from '@/src/utils/puzzleGenerator'

interface DraggableShapeProps {
  shape: Shape
  initialX: number
  initialY: number
  targets: TargetSlot[]
  enableRotation: boolean
  onPlaced: (shapeId: string, targetId: string) => void
  isPlaced: boolean
}

/**
 * ドラッグ可能な図形コンポーネント
 */
export function DraggableShape({
  shape,
  initialX,
  initialY,
  targets,
  enableRotation,
  onPlaced,
  isPlaced,
}: DraggableShapeProps) {
  const { isBlinking } = useBlinkAnimation()
  const { playSnapSound } = useSnapSound()

  // 現在の回転角度
  const [currentRotation, setCurrentRotation] = useState<Rotation>(0)

  // framer-motionのMotionValueで位置を管理
  const x = useMotionValue(initialX)
  const y = useMotionValue(initialY)

  // 初期位置を設定
  useEffect(() => {
    x.set(initialX)
    y.set(initialY)
  }, [initialX, initialY, x, y])

  // 回転処理
  const handleRotate = useCallback(() => {
    if (!enableRotation || isPlaced) return

    setCurrentRotation((prev) => {
      const rotations: Rotation[] = [0, 90, 180, 270]
      const currentIndex = rotations.indexOf(prev)
      return rotations[(currentIndex + 1) % 4]
    })
  }, [enableRotation, isPlaced])

  // ダブルタップで回転
  const handleDoubleTap = useCallback(() => {
    handleRotate()
  }, [handleRotate])

  // ドラッグ終了時の処理
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (isPlaced) return

      const dropX = info.point.x
      const dropY = info.point.y

      // 各ターゲットとの距離をチェック
      for (const target of targets) {
        if (target.placedShapeId) continue // 既に配置済みのターゲットはスキップ

        const distance = Math.sqrt(
          Math.pow(dropX - target.x, 2) + Math.pow(dropY - target.y, 2)
        )

        if (distance <= DEFAULT_SNAP_THRESHOLD) {
          // マッチ判定
          if (checkShapeMatch(shape, target, currentRotation)) {
            // スナップ音を再生
            playSnapSound()

            // ターゲット位置にスナップ
            animate(x, target.x - shape.width / 2, {
              type: 'spring',
              ...SNAP_ANIMATION,
            })
            animate(y, target.y - shape.height / 2, {
              type: 'spring',
              ...SNAP_ANIMATION,
            })

            // 配置完了を通知
            onPlaced(shape.id, target.id)
            return
          }
        }
      }
    },
    [shape, targets, currentRotation, playSnapSound, x, y, onPlaced, isPlaced]
  )

  if (isPlaced) {
    // 配置済みの場合は静的に表示
    return (
      <motion.div
        data-shape={shape.id}
        style={{
          position: 'absolute',
          x,
          y,
          zIndex: 5,
        }}
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
      >
        <ShapeRenderer
          type={shape.type}
          color={shape.color}
          rotation={currentRotation}
          isBlinking={isBlinking}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      data-shape={shape.id}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleTap}
      style={{
        position: 'absolute',
        x,
        y,
        zIndex: 10,
        cursor: 'grab',
        touchAction: 'none',
      }}
      whileTap={{ scale: 1.1, cursor: 'grabbing' }}
      whileDrag={{
        scale: 1.15,
        cursor: 'grabbing',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      }}
      animate={{
        rotate: currentRotation,
      }}
      transition={{
        rotate: ROTATION_ANIMATION,
      }}
    >
      <ShapeRenderer
        type={shape.type}
        color={shape.color}
        rotation={0}
        isBlinking={isBlinking}
      />
      {enableRotation && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleRotate()
          }}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 text-sm font-bold"
          style={{ touchAction: 'manipulation' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}
