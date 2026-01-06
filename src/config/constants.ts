/**
 * アプリケーション全体で使用する定数
 *
 * このファイルで定義された定数は、コンポーネントとテストの両方から参照され、
 * Single Source of Truth として機能します。
 */

import type { Difficulty, ShapeType } from '@/src/types/shapes'

// ============================================
// ゲーム設定
// ============================================

/**
 * 総ステージ数
 */
export const TOTAL_STAGES = 5

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

// ============================================
// 図形サイズ設定
// ============================================

/**
 * 4歳児向けのドラッグ可能な正方形のサイズ（px）
 *
 * @remarks
 * タッチターゲットとして十分な大きさを確保しています。
 * 最小推奨サイズ: 44x44px
 */
export const SQUARE_SIZE = 100

/**
 * 長方形のサイズ（px）
 */
export const RECTANGLE_SIZE = { width: 140, height: 70 }

/**
 * 平行四辺形のサイズ（px）
 */
export const PARALLELOGRAM_SIZE = { width: 140, height: 80, skew: 20 }

/**
 * 正三角形のサイズ（px）
 */
export const EQUILATERAL_TRIANGLE_SIZE = { base: 100, height: 87 }

/**
 * 二等辺三角形のサイズ（px）
 */
export const ISOSCELES_TRIANGLE_SIZE = { base: 80, height: 100 }

/**
 * ターゲット枠のサイズ（px）
 *
 * @remarks
 * ドラッグ可能な正方形より少し大きめに設定し、
 * 視覚的なフィードバックを提供します。
 */
export const TARGET_SIZE = 120

// ============================================
// 難易度設定
// ============================================

/**
 * 難易度別の設定
 */
export const DIFFICULTY_CONFIG: Record<Difficulty, {
  /** 図形数 */
  shapeCount: number
  /** 罫線表示 */
  showGridLines: boolean
  /** 回転機能 */
  enableRotation: boolean
  /** 使用可能な図形タイプ */
  availableShapes: ShapeType[]
  /** 日本語名 */
  label: string
}> = {
  easy: {
    shapeCount: 3,
    showGridLines: true,
    enableRotation: false,
    availableShapes: ['square', 'rectangle', 'equilateralTriangle'],
    label: 'かんたん',
  },
  normal: {
    shapeCount: 4,
    showGridLines: false,
    enableRotation: false,
    availableShapes: ['square', 'rectangle', 'parallelogram', 'equilateralTriangle'],
    label: 'ふつう',
  },
  hard: {
    shapeCount: 5,
    showGridLines: false,
    enableRotation: true,
    availableShapes: ['square', 'rectangle', 'parallelogram', 'equilateralTriangle', 'isoscelesTriangle'],
    label: 'むずかしい',
  },
}

// ============================================
// 色設定
// ============================================

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

// ============================================
// アニメーション設定
// ============================================

/**
 * スナップアニメーションの設定
 */
export const SNAP_ANIMATION = {
  stiffness: 400,
  damping: 25,
}

/**
 * 回転アニメーションの設定
 */
export const ROTATION_ANIMATION = {
  duration: 0.2,
  ease: 'easeOut',
}
