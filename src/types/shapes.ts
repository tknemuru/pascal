/**
 * 図形タイプの定義
 */
export type ShapeType =
  | 'square'              // 正方形
  | 'rectangle'           // 長方形
  | 'parallelogram'       // 平行四辺形
  | 'equilateralTriangle' // 正三角形
  | 'isoscelesTriangle'   // 二等辺三角形

/**
 * 難易度の定義
 */
export type Difficulty = 'easy' | 'normal' | 'hard'

/**
 * ゲームフェーズの定義
 */
export type GamePhase = 'menu' | 'playing' | 'stageClear' | 'gameClear'

/**
 * 回転角度（90度単位）
 */
export type Rotation = 0 | 90 | 180 | 270

/**
 * 図形の定義
 */
export interface Shape {
  /** 一意のID */
  id: string
  /** 図形タイプ */
  type: ShapeType
  /** 幅（px） */
  width: number
  /** 高さ（px） */
  height: number
  /** 回転角度 */
  rotation: Rotation
  /** 色（HEXコード） */
  color: string
}

/**
 * ドラッグ可能な図形の配置情報
 */
export interface DraggableShapeSlot {
  /** 図形データ */
  shape: Shape
  /** 初期位置X */
  initialX: number
  /** 初期位置Y */
  initialY: number
  /** 配置済みフラグ */
  isPlaced: boolean
}

/**
 * ターゲット枠の配置情報
 */
export interface TargetSlot {
  /** スロットID */
  id: string
  /** 受け入れる図形タイプ */
  shapeType: ShapeType
  /** 位置X */
  x: number
  /** 位置Y */
  y: number
  /** 幅 */
  width: number
  /** 高さ */
  height: number
  /** 必要な回転角度（むずかしいモード用） */
  requiredRotation?: Rotation
  /** 配置済みの図形ID */
  placedShapeId?: string
}

/**
 * パズルテンプレート
 */
export interface PuzzleTemplate {
  /** ドラッグ可能な図形のリスト */
  shapes: DraggableShapeSlot[]
  /** ターゲット枠のリスト */
  targets: TargetSlot[]
}

/**
 * ゲーム状態
 */
export interface GameState {
  /** 現在の難易度 */
  difficulty: Difficulty
  /** 現在のステージ（1-5） */
  currentStage: number
  /** ゲームフェーズ */
  phase: GamePhase
  /** 現在のパズルテンプレート */
  puzzle: PuzzleTemplate | null
  /** 配置済み図形のIDセット */
  placedShapeIds: Set<string>
}
