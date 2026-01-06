'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useClearSound } from '@/src/hooks/useClearSound'

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

interface StageClearEffectProps {
  onNext: () => void
}

/**
 * ステージクリア演出コンポーネント
 */
export function StageClearEffect({ onNext }: StageClearEffectProps) {
  const [stars, setStars] = useState<Star[]>([])
  const { playStageClearSound } = useClearSound()

  useEffect(() => {
    // 効果音を再生
    playStageClearSound()

    // 星を生成
    const newStars: Star[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      size: 10 + Math.random() * 20,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1,
    }))
    setStars(newStars)
  }, [playStageClearSound])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 降ってくる星 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-yellow-400"
          initial={{
            left: `${star.x}%`,
            top: '-5%',
            rotate: 0,
          }}
          animate={{
            top: '110%',
            rotate: 360,
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: 'linear',
          }}
          style={{ fontSize: star.size }}
        >
          <svg viewBox="0 0 24 24" width={star.size} height={star.size} fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      ))}

      {/* メッセージ */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15,
          delay: 0.2,
        }}
      >
        <motion.h2
          className="text-5xl font-bold text-white mb-8"
          style={{
            textShadow: '0 0 20px rgba(250, 204, 21, 0.8), 0 4px 8px rgba(0,0,0,0.5)',
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          すごい！
        </motion.h2>

        <motion.button
          className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          つぎへすすむ
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
