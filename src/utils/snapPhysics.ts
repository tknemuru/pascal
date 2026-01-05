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
}

/**
 * スナップ位置を計算する純粋関数
 * 
 * 現在の座標とターゲット座標の距離を計算し、
 * 閾値以内であればスナップすべきと判定します。
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
 *   threshold: 50
 * })
 * // result: { shouldSnap: true, snapX: 0, snapY: 0 }
 * ```
 */
export function calculateSnapPosition(
  input: SnapCalculationInput
): SnapCalculationResult {
  const { currentX, currentY, targetX, targetY, threshold } = input

  // ターゲットとの距離を計算（ユークリッド距離）
  const distance = Math.sqrt(
    Math.pow(currentX - targetX, 2) + Math.pow(currentY - targetY, 2)
  )

  // 閾値以内かどうかをチェック
  const shouldSnap = distance <= threshold

  // スナップする場合はターゲット位置（相対座標で0,0）を返す
  // スナップしない場合は現在の位置を保持
  return {
    shouldSnap,
    snapX: shouldSnap ? 0 : currentX - targetX,
    snapY: shouldSnap ? 0 : currentY - targetY,
  }
}
