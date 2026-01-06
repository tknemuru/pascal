/**
 * スナップ物理計算システム
 *
 * ドロップ判定に必要な条件:
 * 1. 型の一致（Type Check）: shape.type === target.shapeType
 * 2. 座標の距離が閾値以内
 * 3. 回転角度の一致（むずかしいモードのみ）
 */

import type { ShapeType, Rotation } from '@/src/types/shapes'

/**
 * スナップ計算の入力パラメータ
 */
export interface SnapCalculationInput {
  /** 現在のX座標（絶対座標） */
  currentX: number
  /** 現在のY座標（絶対座標） */
  currentY: number
  /** ターゲットのX座標（絶対座標） */
  targetX: number
  /** ターゲットのY座標（絶対座標） */
  targetY: number
  /** スナップ判定の閾値（px） */
  threshold: number
  /** ドラッグ中の図形タイプ */
  shapeType: ShapeType
  /** ターゲットが受け入れる図形タイプ */
  targetShapeType: ShapeType
  /** ドラッグ中の図形の回転角度（むずかしいモード用） */
  currentRotation?: Rotation
  /** ターゲットが必要とする回転角度（むずかしいモード用） */
  requiredRotation?: Rotation
}

/**
 * スナップ計算の結果
 */
export interface SnapCalculationResult {
  /** スナップすべきかどうか */
  shouldSnap: boolean
  /** スナップ後のX座標（ターゲットからの相対座標） */
  snapX: number
  /** スナップ後のY座標（ターゲットからの相対座標） */
  snapY: number
  /** スナップ失敗の理由（デバッグ用） */
  failureReason?: 'type_mismatch' | 'rotation_mismatch' | 'distance_exceeded'
}

/**
 * スナップ位置を計算する純粋関数
 *
 * 判定ロジック（Strict Matching）:
 * 1. 型の一致（Type Check）を必須とする
 * 2. 座標の距離が閾値以内であることを確認
 * 3. むずかしいモードでは回転角度も一致が必要
 *
 * 例: 長方形の枠の中に二等辺三角形が入ったとしても、
 * typeが異なるため吸着してはならない。
 *
 * @param input - スナップ計算の入力パラメータ
 * @returns スナップ計算の結果
 *
 * @example
 * ```typescript
 * const result = calculateSnapPosition({
 *   currentX: 512,
 *   currentY: 384,
 *   targetX: 500,
 *   targetY: 400,
 *   threshold: 50,
 *   shapeType: 'square',
 *   targetShapeType: 'square',
 * })
 * // result: { shouldSnap: true, snapX: 0, snapY: 0 }
 * ```
 */
export function calculateSnapPosition(
  input: SnapCalculationInput
): SnapCalculationResult {
  const {
    currentX,
    currentY,
    targetX,
    targetY,
    threshold,
    shapeType,
    targetShapeType,
    currentRotation,
    requiredRotation,
  } = input

  // ステップ1: 型の一致チェック（必須）
  if (shapeType !== targetShapeType) {
    return {
      shouldSnap: false,
      snapX: currentX - targetX,
      snapY: currentY - targetY,
      failureReason: 'type_mismatch',
    }
  }

  // ステップ2: 回転角度のチェック（むずかしいモードのみ）
  if (requiredRotation !== undefined && currentRotation !== requiredRotation) {
    return {
      shouldSnap: false,
      snapX: currentX - targetX,
      snapY: currentY - targetY,
      failureReason: 'rotation_mismatch',
    }
  }

  // ステップ3: ターゲットとの距離を計算（ユークリッド距離）
  const distance = Math.sqrt(
    Math.pow(currentX - targetX, 2) + Math.pow(currentY - targetY, 2)
  )

  // 閾値以内かどうかをチェック
  const shouldSnap = distance <= threshold

  if (!shouldSnap) {
    return {
      shouldSnap: false,
      snapX: currentX - targetX,
      snapY: currentY - targetY,
      failureReason: 'distance_exceeded',
    }
  }

  // スナップする場合はターゲット位置（相対座標で0,0）を返す
  return {
    shouldSnap: true,
    snapX: 0,
    snapY: 0,
  }
}

/**
 * シンプルなスナップ判定（座標のみ）
 *
 * 型チェックなしで座標の距離のみを判定する簡易版。
 * 後方互換性のために残しています。
 *
 * @deprecated 新規コードでは calculateSnapPosition を使用してください
 */
export function calculateSimpleSnapPosition(input: {
  currentX: number
  currentY: number
  targetX: number
  targetY: number
  threshold: number
}): { shouldSnap: boolean; snapX: number; snapY: number } {
  const { currentX, currentY, targetX, targetY, threshold } = input

  const distance = Math.sqrt(
    Math.pow(currentX - targetX, 2) + Math.pow(currentY - targetY, 2)
  )

  const shouldSnap = distance <= threshold

  return {
    shouldSnap,
    snapX: shouldSnap ? 0 : currentX - targetX,
    snapY: shouldSnap ? 0 : currentY - targetY,
  }
}
