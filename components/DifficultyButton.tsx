'use client'

import { motion } from 'framer-motion'
import type { Difficulty } from '@/src/types/shapes'

interface DifficultyButtonProps {
  difficulty: Difficulty
  label: string
  color: string
  onClick: () => void
}

/**
 * 難易度選択ボタンコンポーネント
 */
export function DifficultyButton({ difficulty, label, color, onClick }: DifficultyButtonProps) {
  const getEmoji = () => {
    switch (difficulty) {
      case 'easy':
        return '🌟'
      case 'normal':
        return '🌈'
      case 'hard':
        return '🚀'
    }
  }

  return (
    <motion.button
      className="w-full py-6 px-8 rounded-2xl text-white text-3xl font-bold shadow-xl"
      style={{
        background: color,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span className="mr-3">{getEmoji()}</span>
      {label}
    </motion.button>
  )
}
