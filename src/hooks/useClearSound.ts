import { useCallback, useRef } from 'react'

/**
 * クリア時の効果音を再生するカスタムフック
 *
 * Web Audio APIを使用して、ファンファーレ風の音を動的に合成します。
 */
export function useClearSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  /**
   * ステージクリア音を再生
   */
  const playStageClearSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime

      // 和音を3つ順番に鳴らす
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, currentTime + i * 0.1)

        gain.gain.setValueAtTime(0.3, currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + i * 0.1 + 0.4)

        osc.connect(gain)
        gain.connect(audioContext.destination)

        osc.start(currentTime + i * 0.1)
        osc.stop(currentTime + i * 0.1 + 0.5)
      })
    } catch (error) {
      console.warn('Failed to play stage clear sound:', error)
    }
  }, [])

  /**
   * ゲームクリア音を再生
   */
  const playGameClearSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime

      // より華やかなファンファーレ
      const melody = [
        { freq: 523.25, time: 0, duration: 0.15 },     // C5
        { freq: 659.25, time: 0.15, duration: 0.15 },  // E5
        { freq: 783.99, time: 0.3, duration: 0.15 },   // G5
        { freq: 1046.5, time: 0.45, duration: 0.4 },   // C6
        { freq: 783.99, time: 0.5, duration: 0.4 },    // G5 (harmony)
        { freq: 523.25, time: 0.55, duration: 0.4 },   // C5 (harmony)
      ]

      melody.forEach(({ freq, time, duration }) => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, currentTime + time)

        gain.gain.setValueAtTime(0.25, currentTime + time)
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + time + duration)

        osc.connect(gain)
        gain.connect(audioContext.destination)

        osc.start(currentTime + time)
        osc.stop(currentTime + time + duration + 0.1)
      })
    } catch (error) {
      console.warn('Failed to play game clear sound:', error)
    }
  }, [])

  return { playStageClearSound, playGameClearSound }
}
