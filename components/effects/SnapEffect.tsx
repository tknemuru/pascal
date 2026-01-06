'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  angle: number
  velocity: number
}

interface SnapEffectProps {
  x: number
  y: number
  trigger: boolean
  onComplete?: () => void
}

const PARTICLE_COLORS = ['#facc15', '#f472b6', '#60a5fa', '#34d399', '#f97316']

/**
 * スナップ成功時のパーティクルエフェクト
 */
export function SnapEffect({ x, y, trigger, onComplete }: SnapEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      // パーティクルを生成
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 0,
        y: 0,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        size: 6 + Math.random() * 6,
        angle: (i * 30 + Math.random() * 20) * (Math.PI / 180),
        velocity: 60 + Math.random() * 40,
      }))
      setParticles(newParticles)

      // エフェクト完了後にクリア
      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            position: 'fixed',
            left: x,
            top: y,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            left: x + Math.cos(particle.angle) * particle.velocity,
            top: y + Math.sin(particle.angle) * particle.velocity,
            opacity: 0,
            scale: 0.5,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        />
      ))}
    </AnimatePresence>
  )
}
