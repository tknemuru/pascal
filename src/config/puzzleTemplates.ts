/**
 * パズルテンプレート定義
 *
 * 「ふつう」「むずかしい」モード用の固定レイアウト（シルエット）を定義します。
 * 各テンプレートは図形が密集して一つのシルエットを形成する座標データです。
 */

import type { ShapeType, Rotation } from '@/src/types/shapes'

/**
 * テンプレート内の図形定義
 */
export interface TemplateShape {
  /** 図形タイプ */
  type: ShapeType
  /** 相対X座標（テンプレート中心からのオフセット） */
  relativeX: number
  /** 相対Y座標（テンプレート中心からのオフセット） */
  relativeY: number
  /** 回転角度（むずかしいモード用） */
  rotation?: Rotation
}

/**
 * パズルテンプレート
 */
export interface PuzzleLayoutTemplate {
  /** テンプレート名 */
  name: string
  /** テンプレートに含まれる図形 */
  shapes: TemplateShape[]
}

/**
 * 家のテンプレート
 *
 * 正三角形を屋根に、正方形を本体、長方形をドアとして配置
 *      /\
 *     /  \
 *    ------
 *    |    |
 *    | [] |
 *    ------
 */
const houseTemplate: PuzzleLayoutTemplate = {
  name: 'house',
  shapes: [
    // 屋根（正三角形）
    { type: 'equilateralTriangle', relativeX: 0, relativeY: -80, rotation: 0 },
    // 本体（正方形）
    { type: 'square', relativeX: 0, relativeY: 20, rotation: 0 },
    // ドア（長方形・縦向き）- 回転90度で縦長に
    { type: 'rectangle', relativeX: 0, relativeY: 50, rotation: 90 },
  ],
}

/**
 * ロケットのテンプレート
 *
 * 二等辺三角形を先端に、長方形を本体、左右に平行四辺形の翼
 *      /\
 *     |  |
 *    /|  |\
 *   / |  | \
 */
const rocketTemplate: PuzzleLayoutTemplate = {
  name: 'rocket',
  shapes: [
    // 先端（二等辺三角形）
    { type: 'isoscelesTriangle', relativeX: 0, relativeY: -100, rotation: 0 },
    // 本体（長方形）
    { type: 'rectangle', relativeX: 0, relativeY: 0, rotation: 90 },
    // 左翼（正三角形）- 回転させて左向き
    { type: 'equilateralTriangle', relativeX: -80, relativeY: 50, rotation: 270 },
    // 右翼（正三角形）- 回転させて右向き
    { type: 'equilateralTriangle', relativeX: 80, relativeY: 50, rotation: 90 },
  ],
}

/**
 * 亀のテンプレート
 *
 * 正方形を甲羅に、正三角形を頭と足に配置
 *        △
 *     △ ■ △
 *        △
 */
const turtleTemplate: PuzzleLayoutTemplate = {
  name: 'turtle',
  shapes: [
    // 甲羅（正方形）
    { type: 'square', relativeX: 0, relativeY: 0, rotation: 0 },
    // 頭（正三角形）- 上向き
    { type: 'equilateralTriangle', relativeX: 0, relativeY: -90, rotation: 0 },
    // 左足（正三角形）- 左向き
    { type: 'equilateralTriangle', relativeX: -90, relativeY: 0, rotation: 270 },
    // 右足（正三角形）- 右向き
    { type: 'equilateralTriangle', relativeX: 90, relativeY: 0, rotation: 90 },
    // 尻尾（二等辺三角形）- 下向き
    { type: 'isoscelesTriangle', relativeX: 0, relativeY: 90, rotation: 180 },
  ],
}

/**
 * 魚のテンプレート
 *
 * 平行四辺形を本体に、三角形を尾に配置
 *    ◇◇◇△
 */
const fishTemplate: PuzzleLayoutTemplate = {
  name: 'fish',
  shapes: [
    // 本体（平行四辺形）
    { type: 'parallelogram', relativeX: 0, relativeY: 0, rotation: 0 },
    // 尾（正三角形）
    { type: 'equilateralTriangle', relativeX: 100, relativeY: 0, rotation: 90 },
    // 目（正方形・小さく見せるため位置調整）
    { type: 'square', relativeX: -50, relativeY: -10, rotation: 0 },
  ],
}

/**
 * 木のテンプレート
 *
 * 三角形を葉に、長方形を幹に配置
 *      △
 *     △△△
 *      ||
 */
const treeTemplate: PuzzleLayoutTemplate = {
  name: 'tree',
  shapes: [
    // 上の葉（正三角形）
    { type: 'equilateralTriangle', relativeX: 0, relativeY: -80, rotation: 0 },
    // 下の葉（正三角形・左）
    { type: 'equilateralTriangle', relativeX: -50, relativeY: 0, rotation: 0 },
    // 下の葉（正三角形・右）
    { type: 'equilateralTriangle', relativeX: 50, relativeY: 0, rotation: 0 },
    // 幹（長方形）
    { type: 'rectangle', relativeX: 0, relativeY: 80, rotation: 90 },
  ],
}

/**
 * 利用可能なすべてのテンプレート
 */
export const PUZZLE_TEMPLATES: PuzzleLayoutTemplate[] = [
  houseTemplate,
  rocketTemplate,
  turtleTemplate,
  fishTemplate,
  treeTemplate,
]

/**
 * テンプレートをランダムに選択
 */
export function getRandomTemplate(): PuzzleLayoutTemplate {
  const index = Math.floor(Math.random() * PUZZLE_TEMPLATES.length)
  return PUZZLE_TEMPLATES[index]
}
