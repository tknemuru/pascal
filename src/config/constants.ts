/**
 * アプリケーション全体で使用する定数
 * 
 * このファイルで定義された定数は、コンポーネントとテストの両方から参照され、
 * Single Source of Truth として機能します。
 */

/**
 * スナップ判定の閾値（px）
 * 
 * ドラッグ可能な図形がターゲット位置からこの距離以内にドロップされた場合、
 * ターゲットの中心に自動的にスナップします。
 * 
 * @remarks
 * 4歳児のタッチ操作を考慮し、やや大きめの値を設定しています。
 */
export const DEFAULT_SNAP_THRESHOLD = 50

/**
 * 4歳児向けのドラッグ可能な正方形のサイズ（px）
 * 
 * @remarks
 * タッチターゲットとして十分な大きさを確保しています。
 * 最小推奨サイズ: 44x44px
 */
export const SQUARE_SIZE = 120

/**
 * ターゲット枠のサイズ（px）
 * 
 * @remarks
 * ドラッグ可能な正方形より少し大きめに設定し、
 * 視覚的なフィードバックを提供します。
 */
export const TARGET_SIZE = 140

/**
 * 図形のカラーパレット
 * 
 * @remarks
 * 4歳児が楽しめる明るく元気な色を選定。
 * 彩度高めのパステルカラーで、はっきりと認識しやすい色合い。
 * HEXコードで定義することでTailwindの動的クラス名問題を回避。
 */
export const SHAPE_COLORS = [
  '#ec4899',  // ピンク (pink-500)
  '#f43f5e',  // ローズ (rose-500)
  '#facc15',  // 黄色 (yellow-400)
  '#f59e0b',  // オレンジ (amber-500)
  '#84cc16',  // ライムグリーン (lime-500)
  '#06b6d4',  // シアン (cyan-500)
  '#0ea5e9',  // スカイブルー (sky-500)
  '#a855f7',  // 紫 (purple-500)
] as const

export type ShapeColor = typeof SHAPE_COLORS[number]
