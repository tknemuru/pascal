import { useCallback, useRef } from 'react'

/**
 * スナップ時の効果音を再生するカスタムフック
 * 
 * Web Audio APIを使用して、メカニカルなスイッチ音（「カチャッ」）を
 * 動的に合成します。音源ファイルは使用しません。
 * 
 * @returns playSnapSound - スナップ音を再生する関数
 * 
 * @example
 * ```tsx
 * const { playSnapSound } = useSnapSound()
 * 
 * // スナップ成功時に再生
 * if (isSnapped) {
 *   playSnapSound()
 * }
 * ```
 */
export function useSnapSound() {
  // AudioContextは一度だけ作成し、再利用
  const audioContextRef = useRef<AudioContext | null>(null)

  /**
   * スナップ音を再生する関数
   * 
   * Triangle波のオシレーターと急激なピッチダウンを組み合わせて、
   * メカニカルなスイッチ音を表現します。
   */
  const playSnapSound = useCallback(() => {
    try {
      // AudioContextの初期化（初回のみ）
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime

      // オシレーター（音の発生源）を作成
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // Triangle波で温かみのある音色に
      oscillator.type = 'triangle'

      // ピッチの変化で「カチャッ」という打撃感を表現
      // 高い音から急激に下がる
      oscillator.frequency.setValueAtTime(800, currentTime) // 開始: 800Hz
      oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 0.03) // 0.03秒で200Hzに急降下

      // 音量の変化（エンベロープ）
      gainNode.gain.setValueAtTime(0.3, currentTime) // 開始音量
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.08) // 0.08秒でフェードアウト

      // ノードを接続: オシレーター → ゲイン → スピーカー
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // 音の再生
      oscillator.start(currentTime)
      oscillator.stop(currentTime + 0.1) // 0.1秒後に停止

      // 第2レイヤー: より高い周波数で「カチッ」という音を追加
      const clickOscillator = audioContext.createOscillator()
      const clickGain = audioContext.createGain()

      clickOscillator.type = 'square' // Square波で鋭い音
      clickOscillator.frequency.setValueAtTime(1200, currentTime)
      clickOscillator.frequency.exponentialRampToValueAtTime(100, currentTime + 0.01)

      // 非常に短く、小さめの音量で
      clickGain.gain.setValueAtTime(0.15, currentTime)
      clickGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.02)

      clickOscillator.connect(clickGain)
      clickGain.connect(audioContext.destination)

      clickOscillator.start(currentTime)
      clickOscillator.stop(currentTime + 0.03)
    } catch (error) {
      // Web Audio APIがサポートされていない場合やエラー時は静かに失敗
      console.warn('Failed to play snap sound:', error)
    }
  }, [])

  return { playSnapSound }
}
