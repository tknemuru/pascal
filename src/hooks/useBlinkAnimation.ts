import { useState, useEffect } from 'react'

/**
 * まばたきアニメーションを管理するカスタムフック
 * 
 * 2-5秒のランダムな間隔でまばたきをトリガーします。
 * まばたきの継続時間は150msで、自然な動きを演出します。
 * 
 * @returns isBlinking - まばたき状態（trueの時に目が閉じる）
 * 
 * @example
 * ```tsx
 * const { isBlinking } = useBlinkAnimation()
 * <AnimeEyes isBlinking={isBlinking} />
 * ```
 */
export function useBlinkAnimation() {
  const [isBlinking, setIsBlinking] = useState(false)
  
  useEffect(() => {
    const scheduleNextBlink = () => {
      // 2-5秒のランダムな間隔を設定
      const delay = 2000 + Math.random() * 3000
      
      setTimeout(() => {
        // まばたき開始
        setIsBlinking(true)
        
        // 150ms後にまばたき終了
        setTimeout(() => {
          setIsBlinking(false)
          // 次のまばたきをスケジュール
          scheduleNextBlink()
        }, 150)
      }, delay)
    }
    
    // 最初のまばたきをスケジュール
    scheduleNextBlink()
    
    // クリーンアップは不要（タイマーが自己完結）
  }, [])
  
  return { isBlinking }
}
