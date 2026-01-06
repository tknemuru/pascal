'use client'

import { TOTAL_STAGES } from '@/src/config/constants'

interface StageProgressProps {
  currentStage: number
}

/**
 * ステージ進捗表示コンポーネント
 */
export function StageProgress({ currentStage }: StageProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {/* ステージ進捗テキスト（例: "1/5"） */}
      <span className="text-white font-bold mr-2">{currentStage}/{TOTAL_STAGES}</span>
      {Array.from({ length: TOTAL_STAGES }, (_, i) => {
        const stageNum = i + 1
        const isCompleted = stageNum < currentStage
        const isCurrent = stageNum === currentStage

        return (
          <div
            key={stageNum}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
              isCompleted
                ? 'bg-yellow-400 text-yellow-900'
                : isCurrent
                ? 'bg-pink-500 text-white scale-110'
                : 'bg-gray-600 text-gray-400'
            }`}
          >
            {isCompleted ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ) : (
              stageNum
            )}
          </div>
        )
      })}
    </div>
  )
}
