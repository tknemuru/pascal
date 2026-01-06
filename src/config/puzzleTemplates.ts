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
 * 図形は隙間なく隣接配置（重なり禁止）
 *      /\
 *     /  \
 *    ------
 *    |    |
 *    ------
 *      ||
 */
const houseTemplate: PuzzleLayoutTemplate = {
  name: 'house',
  shapes: [
    // 屋根（正三角形、height=87px）
    // 正三角形の重心: 底辺から高さの1/3 → 中心から底辺まで 29px
    { type: 'equilateralTriangle', relativeX: 0, relativeY: -79.5, rotation: 0 },
    // 本体（正方形、100×100px）
    // 屋根の底辺(-79.5 + 29 = -50.5) から 本体の上辺(-50.5)まで接触
    // 正方形の中心から上辺まで 50px → 中心Y = -50.5 + 50 = -0.5
    { type: 'square', relativeX: 0, relativeY: -0.5, rotation: 0 },
    // ドア（長方形・縦向き、回転90度で70×140px）
    // 本体の下辺(-0.5 + 50 = 49.5) から ドアの上辺(49.5)まで接触
    // 長方形（回転90度）の中心から上辺まで 70px → 中心Y = 49.5 + 70 = 119.5
    { type: 'rectangle', relativeX: 0, relativeY: 119.5, rotation: 90 },
  ],
}

/**
 * ロケットのテンプレート
 *
 * 二等辺三角形を先端に、長方形を本体、左右に正三角形の翼
 * 図形は隙間なく隣接配置（重なり禁止）
 *      /\
 *     |  |
 *    /|  |\
 *   / |  | \
 */
const rocketTemplate: PuzzleLayoutTemplate = {
  name: 'rocket',
  shapes: [
    // 先端（二等辺三角形、base=80px, height=100px）
    // 二等辺三角形の重心: 底辺から高さの1/3 → 中心から底辺まで 33.3px
    { type: 'isoscelesTriangle', relativeX: 0, relativeY: -103.3, rotation: 0 },
    // 本体（長方形、回転90度で70×140px）
    // 先端の底辺(-103.3 + 33.3 = -70) から 本体の上辺(-70)まで接触
    // 長方形（回転90度）の中心から上辺まで 70px → 中心Y = -70 + 70 = 0
    { type: 'rectangle', relativeX: 0, relativeY: 0, rotation: 90 },
    // 左翼（正三角形、回転270度で左向き）
    // 本体の左辺(x = -35) に接触、本体の下部(y = 70付近)に配置
    // 回転270度の正三角形: 中心から右辺（接触面）まで 29px
    // x: -35 - 29 = -64
    { type: 'equilateralTriangle', relativeX: -64, relativeY: 50, rotation: 270 },
    // 右翼（正三角形、回転90度で右向き）
    // 本体の右辺(x = 35) に接触
    // 回転90度の正三角形: 中心から左辺（接触面）まで 29px
    // x: 35 + 29 = 64
    { type: 'equilateralTriangle', relativeX: 64, relativeY: 50, rotation: 90 },
  ],
}

/**
 * 亀のテンプレート
 *
 * 正方形を甲羅に、三角形を頭・足・尻尾に配置
 * 図形は隙間なく隣接配置（重なり禁止）
 *        △
 *     △ ■ △
 *        △
 */
const turtleTemplate: PuzzleLayoutTemplate = {
  name: 'turtle',
  shapes: [
    // 甲羅（正方形、100×100px）
    { type: 'square', relativeX: 0, relativeY: 0, rotation: 0 },
    // 頭（正三角形、回転0度で上向き）
    // 正方形の上辺(y = -50) に接触
    // 正三角形の中心から底辺まで 29px → 中心Y = -50 - 29 = -79
    { type: 'equilateralTriangle', relativeX: 0, relativeY: -79, rotation: 0 },
    // 左足（正三角形、回転270度で左向き）
    // 正方形の左辺(x = -50) に接触
    // 回転270度の正三角形: 中心から右辺（接触面）まで 29px
    // 中心X = -50 - 29 = -79
    { type: 'equilateralTriangle', relativeX: -79, relativeY: 0, rotation: 270 },
    // 右足（正三角形、回転90度で右向き）
    // 正方形の右辺(x = 50) に接触
    // 回転90度の正三角形: 中心から左辺（接触面）まで 29px
    // 中心X = 50 + 29 = 79
    { type: 'equilateralTriangle', relativeX: 79, relativeY: 0, rotation: 90 },
    // 尻尾（二等辺三角形、回転180度で下向き）
    // 正方形の下辺(y = 50) に接触
    // 回転180度の二等辺三角形: 中心から頂点（接触面）まで 67px
    // 中心Y = 50 + 67 = 117
    { type: 'isoscelesTriangle', relativeX: 0, relativeY: 117, rotation: 180 },
  ],
}

/**
 * 魚のテンプレート
 *
 * 平行四辺形を本体に、三角形を尾、正方形を目に配置
 * 図形は隙間なく隣接配置（重なり禁止）
 *    □ ◇◇◇△
 */
const fishTemplate: PuzzleLayoutTemplate = {
  name: 'fish',
  shapes: [
    // 本体（平行四辺形、width=140px, height=80px, skew=20px）
    { type: 'parallelogram', relativeX: 0, relativeY: 0, rotation: 0 },
    // 尾（正三角形、回転90度で右向き）
    // 平行四辺形の右辺(x = 70) に接触
    // 回転90度の正三角形: 中心から左辺（接触面）まで 29px
    // 中心X = 70 + 29 = 99
    { type: 'equilateralTriangle', relativeX: 99, relativeY: 0, rotation: 90 },
    // 目（正方形、100×100px）
    // 平行四辺形の左辺(x = -70 + skew) に接触
    // 正方形の中心から右辺まで 50px
    // 中心X = -70 - 50 = -120
    // 平行四辺形と高さを揃えるため y = 0
    { type: 'square', relativeX: -120, relativeY: 0, rotation: 0 },
  ],
}

/**
 * 木のテンプレート
 *
 * 三角形を葉（上1つ、下2つ）に、長方形を幹に配置
 * 図形は隙間なく隣接配置（重なり禁止）
 *      △
 *     △ △
 *      ||
 */
const treeTemplate: PuzzleLayoutTemplate = {
  name: 'tree',
  shapes: [
    // 上段の葉（正三角形）
    // 正三角形: 中心から頂点まで 58px、中心から底辺まで 29px
    { type: 'equilateralTriangle', relativeX: 0, relativeY: -58, rotation: 0 },
    // 下段左の葉（正三角形）
    // 上段の三角形の底辺(-58 + 29 = -29) から 下段の頂点(-29)まで接触
    // 下段の正三角形: 中心から頂点まで 58px → 中心Y = -29 + 58 = 29
    // 正三角形のbase=100px なので、横に並べる場合 x = -50
    { type: 'equilateralTriangle', relativeX: -50, relativeY: 29, rotation: 0 },
    // 下段右の葉（正三角形）
    // 下段左の葉と同じ高さ、右に配置
    { type: 'equilateralTriangle', relativeX: 50, relativeY: 29, rotation: 0 },
    // 幹（長方形、回転90度で70×140px）
    // 下段の葉の底辺(y = 29 + 29 = 58) から 幹の上辺まで接触
    // 長方形（回転90度）の中心から上辺まで 70px → 中心Y = 58 + 70 = 128
    { type: 'rectangle', relativeX: 0, relativeY: 128, rotation: 90 },
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
