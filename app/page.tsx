'use client'

import { motion } from 'framer-motion'
import { GeometricBackground } from '@/components/GeometricBackground'
import { DifficultyButton } from '@/components/DifficultyButton'
import { useGame } from '@/src/store/gameStore'
import { DIFFICULTY_CONFIG } from '@/src/config/constants'
import type { Difficulty } from '@/src/types/shapes'
import { useRouter } from 'next/navigation'

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'linear-gradient(135deg, #84cc16, #22c55e)',
  normal: 'linear-gradient(135deg, #f59e0b, #f97316)',
  hard: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
}

export default function Home() {
  const { setDifficulty, startGame } = useGame()
  const router = useRouter()

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setDifficulty(difficulty)
    startGame()
    router.push('/game')
  }

  return (
    <>
      <GeometricBackground />
      <main className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center px-6">
        {/* タイトル */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-bold text-gray-800 mb-2"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            🧩 パズル
          </motion.h1>
          <p className="text-xl text-gray-600">
            ずけいをはめてあそぼう！
          </p>
        </motion.div>

        {/* 難易度選択ボタン */}
        <motion.div
          className="w-full max-w-sm space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {(['easy', 'normal', 'hard'] as Difficulty[]).map((difficulty, index) => (
            <motion.div
              key={difficulty}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <DifficultyButton
                difficulty={difficulty}
                label={DIFFICULTY_CONFIG[difficulty].label}
                color={DIFFICULTY_COLORS[difficulty]}
                onClick={() => handleSelectDifficulty(difficulty)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* フッター */}
        <motion.p
          className="absolute bottom-6 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          4さいからあそべるよ
        </motion.p>
      </main>
    </>
  )
}
