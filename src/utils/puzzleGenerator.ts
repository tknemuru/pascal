/**
 * パズル生成システム
 *
 * 難易度に応じたパズルテンプレートをランダムに生成します。
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
// ターゲットエリア配置計算
// ============================================

interface LayoutConfig {
  centerX: number
  centerY: number
  targetAreaWidth: number
  targetAreaHeight: number
}

/**
 * グリッドベースでターゲット位置を計算
 */
function calculateTargetPositions(
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
  shapes: Shape[],
  screenWidth: number,
  screenHeight: number,
  targetAreaHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []

  // 下部に配置
  const bottomY = screenHeight - 100
  const spacing = screenWidth / (shapes.length + 1)

  for (let i = 0; i < shapes.length; i++) {
    positions.push({
      x: spacing * (i + 1),
      y: bottomY,
    })
  }

  return shuffle(positions)
}

// ============================================
// パズル生成
// ============================================

export interface GeneratePuzzleOptions {
  difficulty: Difficulty
  screenWidth: number
  screenHeight: number
}

/**
 * パズルテンプレートを生成
 */
export function generatePuzzle(options: GeneratePuzzleOptions): PuzzleTemplate {
  const { difficulty, screenWidth, screenHeight } = options
  const config = DIFFICULTY_CONFIG[difficulty]

  // 使用する図形タイプを選択
  const selectedTypes: ShapeType[] = []
  const availableTypes = [...config.availableShapes]

  for (let i = 0; i < config.shapeCount; i++) {
    const type = randomChoice(availableTypes)
    selectedTypes.push(type)
  }

  // 図形を生成
  const shapes: Shape[] = selectedTypes.map((type) => {
    // むずかしいモードでは回転が必要な場合がある
    const rotation: Rotation = config.enableRotation ? randomRotation() : 0
    return createShape(type, rotation)
  })

  // ターゲットエリアの設定
  const targetAreaWidth = Math.min(screenWidth * 0.8, 500)
  const targetAreaHeight = Math.min(screenHeight * 0.5, 400)
  const centerX = screenWidth / 2
  const centerY = screenHeight / 2 - 50

  // ターゲット位置を計算
  const targetPositions = calculateTargetPositions(shapes, {
    centerX,
    centerY,
    targetAreaWidth,
    targetAreaHeight,
  })

  // 初期位置を計算
  const initialPositions = calculateInitialPositions(
    shapes,
    screenWidth,
    screenHeight,
    targetAreaHeight
  )

  // ターゲットスロットを作成
  const targets: TargetSlot[] = shapes.map((shape, index) => ({
    id: `target-${shape.id}`,
    shapeType: shape.type,
    x: targetPositions[index].x,
    y: targetPositions[index].y,
    width: shape.width,
    height: shape.height,
    requiredRotation: config.enableRotation ? shape.rotation : undefined,
  }))

  // ドラッグ可能な図形スロットを作成
  const draggableShapes: DraggableShapeSlot[] = shapes.map((shape, index) => ({
    shape: {
      ...shape,
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
