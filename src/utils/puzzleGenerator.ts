/**
 * パズル生成システム
 *
 * 難易度に応じたパズルテンプレートを生成します。
 * - かんたん: グリッド配置（ランダム生成）
 * - ふつう・むずかしい: テンプレートベースの密集配置
 */

import type {
  Difficulty,
  Shape,
  ShapeType,
  Rotation,
  PuzzleTemplate,
  DraggableShapeSlot,
  TargetSlot,
} from '@/src/types/shapes'
import {
  DIFFICULTY_CONFIG,
  SHAPE_COLORS,
  SQUARE_SIZE,
  RECTANGLE_SIZE,
  PARALLELOGRAM_SIZE,
  EQUILATERAL_TRIANGLE_SIZE,
  ISOSCELES_TRIANGLE_SIZE,
} from '@/src/config/constants'
import { getRandomTemplate, type TemplateShape } from '@/src/config/puzzleTemplates'

// ============================================
// ユーティリティ関数
// ============================================

/**
 * 一意のIDを生成
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * 配列からランダムに要素を選択
 */
function randomChoice<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 配列をシャッフル
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * ランダムな回転角度を生成
 */
function randomRotation(): Rotation {
  const rotations: Rotation[] = [0, 90, 180, 270]
  return randomChoice(rotations)
}

// ============================================
// 図形サイズ取得
// ============================================

/**
 * 図形タイプからサイズを取得
 */
export function getShapeSize(type: ShapeType): { width: number; height: number } {
  switch (type) {
    case 'square':
      return { width: SQUARE_SIZE, height: SQUARE_SIZE }
    case 'rectangle':
      return { width: RECTANGLE_SIZE.width, height: RECTANGLE_SIZE.height }
    case 'parallelogram':
      return { width: PARALLELOGRAM_SIZE.width, height: PARALLELOGRAM_SIZE.height }
    case 'equilateralTriangle':
      return { width: EQUILATERAL_TRIANGLE_SIZE.base, height: EQUILATERAL_TRIANGLE_SIZE.height }
    case 'isoscelesTriangle':
      return { width: ISOSCELES_TRIANGLE_SIZE.base, height: ISOSCELES_TRIANGLE_SIZE.height }
    default:
      return { width: SQUARE_SIZE, height: SQUARE_SIZE }
  }
}

// ============================================
// 図形生成
// ============================================

/**
 * 図形を生成
 */
function createShape(type: ShapeType, rotation: Rotation = 0): Shape {
  const size = getShapeSize(type)
  return {
    id: generateId(),
    type,
    width: size.width,
    height: size.height,
    rotation,
    color: randomChoice(SHAPE_COLORS),
  }
}

// ============================================
// グリッド配置（かんたんモード用）
// ============================================

interface LayoutConfig {
  centerX: number
  centerY: number
  targetAreaWidth: number
  targetAreaHeight: number
}

/**
 * グリッドベースでターゲット位置を計算（かんたんモード用）
 */
function calculateGridPositions(
  shapes: Shape[],
  layout: LayoutConfig
): { x: number; y: number }[] {
  const { centerX, centerY, targetAreaWidth, targetAreaHeight } = layout
  const positions: { x: number; y: number }[] = []

  // 簡易的なグリッドレイアウト
  const cols = Math.ceil(Math.sqrt(shapes.length))
  const rows = Math.ceil(shapes.length / cols)

  const cellWidth = targetAreaWidth / cols
  const cellHeight = targetAreaHeight / rows

  const startX = centerX - targetAreaWidth / 2
  const startY = centerY - targetAreaHeight / 2

  for (let i = 0; i < shapes.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)

    positions.push({
      x: startX + col * cellWidth + cellWidth / 2,
      y: startY + row * cellHeight + cellHeight / 2,
    })
  }

  return positions
}

/**
 * 初期位置を計算（ターゲットエリアの外側）
 */
function calculateInitialPositions(
  count: number,
  screenWidth: number,
  screenHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []

  // 下部に配置
  const bottomY = screenHeight - 100
  const spacing = screenWidth / (count + 1)

  for (let i = 0; i < count; i++) {
    positions.push({
      x: spacing * (i + 1),
      y: bottomY,
    })
  }

  return shuffle(positions)
}

// ============================================
// かんたんモード用パズル生成
// ============================================

/**
 * かんたんモード用のパズルを生成（グリッド配置）
 */
function generateEasyPuzzle(
  screenWidth: number,
  screenHeight: number
): PuzzleTemplate {
  const config = DIFFICULTY_CONFIG.easy

  // 使用する図形タイプをランダムに選択
  const selectedTypes: ShapeType[] = []
  const availableTypes = [...config.availableShapes]

  for (let i = 0; i < config.shapeCount; i++) {
    const type = randomChoice(availableTypes)
    selectedTypes.push(type)
  }

  // 図形を生成（回転なし）
  const shapes: Shape[] = selectedTypes.map((type) => createShape(type, 0))

  // ターゲットエリアの設定
  const targetAreaWidth = Math.min(screenWidth * 0.8, 500)
  const targetAreaHeight = Math.min(screenHeight * 0.5, 400)
  const centerX = screenWidth / 2
  const centerY = screenHeight / 2 - 50

  // グリッド位置を計算
  const targetPositions = calculateGridPositions(shapes, {
    centerX,
    centerY,
    targetAreaWidth,
    targetAreaHeight,
  })

  // 初期位置を計算
  const initialPositions = calculateInitialPositions(
    shapes.length,
    screenWidth,
    screenHeight
  )

  // ターゲットスロットを作成
  const targets: TargetSlot[] = shapes.map((shape, index) => ({
    id: `target-${shape.id}`,
    shapeType: shape.type,
    x: targetPositions[index].x,
    y: targetPositions[index].y,
    width: shape.width,
    height: shape.height,
    requiredRotation: undefined,
  }))

  // ドラッグ可能な図形スロットを作成（Deep Copy）
  const draggableShapes: DraggableShapeSlot[] = shapes.map((shape, index) => ({
    shape: {
      ...shape,
      id: generateId(), // 新しいIDを生成して完全に独立させる
    },
    initialX: initialPositions[index].x,
    initialY: initialPositions[index].y,
    isPlaced: false,
  }))

  return {
    shapes: draggableShapes,
    targets,
  }
}

// ============================================
// ふつう・むずかしいモード用パズル生成（テンプレートベース）
// ============================================

/**
 * テンプレートベースのパズルを生成（ふつう・むずかしいモード用）
 */
function generateTemplatePuzzle(
  difficulty: 'normal' | 'hard',
  screenWidth: number,
  screenHeight: number
): PuzzleTemplate {
  const config = DIFFICULTY_CONFIG[difficulty]

  // テンプレートをランダムに選択
  const template = getRandomTemplate()

  // テンプレートの中心座標を計算
  const centerX = screenWidth / 2
  const centerY = screenHeight / 2 - 50

  // テンプレートから図形を生成
  const shapes: Shape[] = template.shapes.map((templateShape: TemplateShape) => {
    // むずかしいモードでは回転を有効に
    const rotation: Rotation = config.enableRotation
      ? (templateShape.rotation ?? 0)
      : 0
    return createShape(templateShape.type, rotation)
  })

  // ターゲットスロットを作成（テンプレートの座標を使用）
  const targets: TargetSlot[] = template.shapes.map((templateShape: TemplateShape, index: number) => {
    const shape = shapes[index]
    const rotation: Rotation = config.enableRotation
      ? (templateShape.rotation ?? 0)
      : 0

    return {
      id: `target-${shape.id}`,
      shapeType: templateShape.type,
      x: centerX + templateShape.relativeX,
      y: centerY + templateShape.relativeY,
      width: shape.width,
      height: shape.height,
      requiredRotation: config.enableRotation ? rotation : undefined,
    }
  })

  // 初期位置を計算
  const initialPositions = calculateInitialPositions(
    shapes.length,
    screenWidth,
    screenHeight
  )

  // ドラッグ可能な図形スロットを作成（Deep Copy - 1対1対応を保証）
  const draggableShapes: DraggableShapeSlot[] = shapes.map((shape, index) => ({
    shape: {
      ...shape,
      id: generateId(), // 新しいIDを生成して完全に独立させる
      // 初期回転は0にリセット（むずかしいモードでユーザーが回転させる）
      rotation: 0,
    },
    initialX: initialPositions[index].x,
    initialY: initialPositions[index].y,
    isPlaced: false,
  }))

  return {
    shapes: draggableShapes,
    targets,
  }
}

// ============================================
// パズル生成（メインエントリポイント）
// ============================================

export interface GeneratePuzzleOptions {
  difficulty: Difficulty
  screenWidth: number
  screenHeight: number
}

/**
 * パズルテンプレートを生成
 *
 * 難易度に応じて生成方法を分岐:
 * - かんたん: グリッド配置（ランダム生成）
 * - ふつう・むずかしい: テンプレートベースの密集配置
 */
export function generatePuzzle(options: GeneratePuzzleOptions): PuzzleTemplate {
  const { difficulty, screenWidth, screenHeight } = options

  switch (difficulty) {
    case 'easy':
      // かんたんモード: グリッド配置
      return generateEasyPuzzle(screenWidth, screenHeight)

    case 'normal':
    case 'hard':
      // ふつう・むずかしいモード: テンプレートベース
      return generateTemplatePuzzle(difficulty, screenWidth, screenHeight)

    default:
      // フォールバック
      return generateEasyPuzzle(screenWidth, screenHeight)
  }
}

/**
 * 図形がターゲットにマッチするかチェック
 */
export function checkShapeMatch(
  shape: Shape,
  target: TargetSlot,
  currentRotation: Rotation
): boolean {
  // 図形タイプが一致するか
  if (shape.type !== target.shapeType) {
    return false
  }

  // 回転が必要な場合、回転角度もチェック
  if (target.requiredRotation !== undefined) {
    return currentRotation === target.requiredRotation
  }

  return true
}
