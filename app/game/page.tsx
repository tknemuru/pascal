'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { GeometricBackground } from '@/components/GeometricBackground'
import { TargetArea } from '@/components/TargetArea'
import { StageProgress } from '@/components/StageProgress'
import { DraggableShape } from '@/components/shapes/DraggableShape'
import { StageClearEffect } from '@/components/effects/StageClearEffect'
import { GameClearEffect } from '@/components/effects/GameClearEffect'
import { useGame } from '@/src/store/gameStore'
import { generatePuzzle } from '@/src/utils/puzzleGenerator'
import { DIFFICULTY_CONFIG, TOTAL_STAGES } from '@/src/config/constants'
import type { TargetSlot } from '@/src/types/shapes'

export default function GamePage() {
  const router = useRouter()
  const {
    state,
    setPuzzle,
    placeShape,
    stageClear,
    nextStage,
    resetGame,
    isAllShapesPlaced,
  } = useGame()

  const [targets, setTargets] = useState<TargetSlot[]>([])
  const [placedShapeIds, setPlacedShapeIds] = useState<Set<string>>(new Set())

  const config = DIFFICULTY_CONFIG[state.difficulty]

  // パズルを生成
  useEffect(() => {
    if (state.phase === 'playing' && !state.puzzle) {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      const puzzle = generatePuzzle({
        difficulty: state.difficulty,
        screenWidth,
        screenHeight,
      })

      setPuzzle(puzzle)
      setTargets(puzzle.targets)
      setPlacedShapeIds(new Set())
    }
  }, [state.phase, state.puzzle, state.difficulty, setPuzzle])

  // ゲーム画面でない場合はメニューにリダイレクト
  useEffect(() => {
    if (state.phase === 'menu') {
      router.push('/')
    }
  }, [state.phase, router])

  // 図形が配置されたときの処理
  const handleShapePlaced = useCallback(
    (shapeId: string, targetId: string) => {
      setPlacedShapeIds((prev) => new Set([...Array.from(prev), shapeId]))

      // ターゲットを更新
      setTargets((prev) =>
        prev.map((t) => (t.id === targetId ? { ...t, placedShapeId: shapeId } : t))
      )

      placeShape(shapeId)

      // 全ての図形が配置されたかチェック
      setTimeout(() => {
        if (state.puzzle && placedShapeIds.size + 1 === state.puzzle.shapes.length) {
          stageClear()
        }
      }, 300)
    },
    [placeShape, stageClear, state.puzzle, placedShapeIds.size]
  )

  // 次のステージへ
  const handleNextStage = useCallback(() => {
    if (state.currentStage >= TOTAL_STAGES) {
      // ゲームクリア
      nextStage()
    } else {
      nextStage()
    }
  }, [state.currentStage, nextStage])

  // メニューに戻る
  const handleBackToMenu = useCallback(() => {
    resetGame()
    router.push('/')
  }, [resetGame, router])

  // ローディング中
  if (!state.puzzle) {
    return (
      <>
        <GeometricBackground />
        <div className="w-screen h-screen flex items-center justify-center">
          <motion.div
            className="text-2xl text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            パズルをつくっているよ...
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <GeometricBackground />

      <main className="relative w-screen h-screen overflow-hidden">
        {/* ヘッダー */}
        <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4">
          {/* 戻るボタン */}
          <motion.button
            className="w-12 h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBackToMenu}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </motion.button>

          {/* ステージ進捗 */}
          <StageProgress currentStage={state.currentStage} />

          {/* 難易度表示 */}
          <div className="px-4 py-2 bg-white/80 rounded-full text-gray-700 font-bold">
            {config.label}
          </div>
        </div>

        {/* ターゲットエリア */}
        <TargetArea targets={targets} showGridLines={config.showGridLines} />

        {/* ドラッグ可能な図形 */}
        {state.puzzle.shapes.map((slot) => (
          <DraggableShape
            key={slot.shape.id}
            shape={slot.shape}
            initialX={slot.initialX - slot.shape.width / 2}
            initialY={slot.initialY - slot.shape.height / 2}
            targets={targets}
            enableRotation={config.enableRotation}
            onPlaced={handleShapePlaced}
            isPlaced={placedShapeIds.has(slot.shape.id)}
          />
        ))}

        {/* ステージクリア演出 */}
        <AnimatePresence>
          {state.phase === 'stageClear' && (
            <StageClearEffect onNext={handleNextStage} />
          )}
        </AnimatePresence>

        {/* ゲームクリア演出 */}
        <AnimatePresence>
          {state.phase === 'gameClear' && (
            <GameClearEffect onBackToMenu={handleBackToMenu} />
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
