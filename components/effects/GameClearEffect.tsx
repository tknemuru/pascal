'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useClearSound } from '@/src/hooks/useClearSound'

interface Confetti {
  id: number
  x: number
  color: string
  size: number
  delay: number
  duration: number
  rotateSpeed: number
}

const CONFETTI_COLORS = ['#ec4899', '#f43f5e', '#facc15', '#f59e0b', '#84cc16', '#06b6d4', '#0ea5e9', '#a855f7']

interface GameClearEffectProps {
  onBackToMenu: () => void
}

/**
 * ゲームクリア演出コンポーネント
 */
export function GameClearEffect({ onBackToMenu }: GameClearEffectProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const { playGameClearSound } = useClearSound()

  useEffect(() => {
    // 効果音を再生
    playGameClearSound()

    // 紙吹雪を生成
    const newConfetti: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 8 + Math.random() * 12,
      delay: Math.random() * 1,
      duration: 2 + Math.random() * 2,
      rotateSpeed: 360 + Math.random() * 720,
    }))
    setConfetti(newConfetti)
  }, [playGameClearSound])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景グラデーション */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(168, 85, 247, 0.9))',
        }}
      />

      {/* 紙吹雪 */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          initial={{
            left: `${piece.x}%`,
            top: '-5%',
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            top: '110%',
            rotate: piece.rotateSpeed,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
          style={{
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            borderRadius: 2,
          }}
        />
      ))}

      {/* メインコンテンツ */}
      <motion.div
        className="relative z-10 text-center px-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 10,
          delay: 0.3,
        }}
      >
        {/* 王冠アイコン */}
        <motion.div
          className="text-yellow-400 mb-4"
          animate={{
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <svg viewBox="0 0 24 24" width="80" height="80" fill="currentColor" className="mx-auto">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-white mb-2"
          style={{
            textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 4px 8px rgba(0,0,0,0.3)',
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          クリアおめでとう！
        </motion.h2>

        <motion.p
          className="text-2xl text-white/90 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          すべてのステージをクリアしたよ！
        </motion.p>

        <motion.button
          className="px-10 py-4 bg-white text-purple-600 text-2xl font-bold rounded-full shadow-xl"
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToMenu}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          はじめにもどる
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
