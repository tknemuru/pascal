import { useState } from 'react'
import { SHAPE_COLORS, type ShapeColor } from '@/src/config/constants'

/**
 * ランダムな図形の色を選択するカスタムフック
 * 
 * ページ読み込み時に、定義されたカラーパレットから
 * ランダムに1色を選択します。
 * 
 * @returns ShapeColor - 選択された色のTailwind CSSクラス名
 * 
 * @example
 * ```tsx
 * const shapeColor = useRandomColor()
 * <div className={`${shapeColor} w-20 h-20`}>...</div>
 * ```
 */
export function useRandomColor(): ShapeColor {
  const [color] = useState<ShapeColor>(() => {
    // 初回レンダリング時にランダムで色を選択
    const randomIndex = Math.floor(Math.random() * SHAPE_COLORS.length)
    return SHAPE_COLORS[randomIndex]
  })
  
  return color
}
