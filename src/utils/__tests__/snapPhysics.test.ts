import { describe, it, expect } from 'vitest'
import { calculateSnapPosition, calculateSimpleSnapPosition } from '../snapPhysics'
import type { SnapCalculationInput } from '../snapPhysics'
import { DEFAULT_SNAP_THRESHOLD } from '@/src/config/constants'

// テスト全体で使用する基準閾値（実装と同じ値を使用）
const TEST_THRESHOLD = DEFAULT_SNAP_THRESHOLD

describe('calculateSnapPosition', () => {
  describe('Type Matching (型の一致チェック)', () => {
    it('同じ型の図形の場合、閾値以内でスナップする', () => {
      const input: SnapCalculationInput = {
        currentX: 530,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'square',
        targetShapeType: 'square',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
      expect(result.failureReason).toBeUndefined()
    })

    it('異なる型の図形の場合、閾値以内でもスナップしない', () => {
      // 仕様書: 長方形の枠の中に二等辺三角形が入ったとしても、typeが異なるため吸着してはならない
      const input: SnapCalculationInput = {
        currentX: 500,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'isoscelesTriangle',
        targetShapeType: 'rectangle',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.failureReason).toBe('type_mismatch')
    })

    it('正方形を長方形のターゲットに配置できない', () => {
      const input: SnapCalculationInput = {
        currentX: 500,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'square',
        targetShapeType: 'rectangle',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.failureReason).toBe('type_mismatch')
    })

    it('すべての図形タイプで型の一致が正しく機能する', () => {
      const shapeTypes = [
        'square',
        'rectangle',
        'parallelogram',
        'equilateralTriangle',
        'isoscelesTriangle',
      ] as const

      shapeTypes.forEach((shapeType) => {
        const input: SnapCalculationInput = {
          currentX: 500,
          currentY: 400,
          targetX: 500,
          targetY: 400,
          threshold: TEST_THRESHOLD,
          shapeType,
          targetShapeType: shapeType,
        }

        const result = calculateSnapPosition(input)

        expect(result.shouldSnap).toBe(true)
        expect(result.failureReason).toBeUndefined()
      })
    })
  })

  describe('Rotation Matching (回転角度の一致チェック)', () => {
    it('回転角度が一致する場合、スナップする', () => {
      const input: SnapCalculationInput = {
        currentX: 500,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'square',
        targetShapeType: 'square',
        currentRotation: 90,
        requiredRotation: 90,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.failureReason).toBeUndefined()
    })

    it('回転角度が一致しない場合、スナップしない', () => {
      const input: SnapCalculationInput = {
        currentX: 500,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'square',
        targetShapeType: 'square',
        currentRotation: 0,
        requiredRotation: 90,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.failureReason).toBe('rotation_mismatch')
    })

    it('requiredRotationが未定義の場合、回転角度のチェックをスキップする', () => {
      const input: SnapCalculationInput = {
        currentX: 500,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'square',
        targetShapeType: 'square',
        currentRotation: 90,
        requiredRotation: undefined,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
    })

    it('すべての回転角度（0, 90, 180, 270）で正しく判定する', () => {
      const rotations = [0, 90, 180, 270] as const

      rotations.forEach((rotation) => {
        const input: SnapCalculationInput = {
          currentX: 500,
          currentY: 400,
          targetX: 500,
          targetY: 400,
          threshold: TEST_THRESHOLD,
          shapeType: 'equilateralTriangle',
          targetShapeType: 'equilateralTriangle',
          currentRotation: rotation,
          requiredRotation: rotation,
        }

        const result = calculateSnapPosition(input)

        expect(result.shouldSnap).toBe(true)
      })
    })
  })

  describe('Distance Checking (距離判定)', () => {
    it('閾値以内（距離30px）の場合、ターゲットの中心にスナップする', () => {
      const input: SnapCalculationInput = {
        currentX: 530,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'square',
        targetShapeType: 'square',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })

    it('閾値より遠い（距離60px）場合、スナップしない', () => {
      const input: SnapCalculationInput = {
        currentX: 560,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'square',
        targetShapeType: 'square',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.failureReason).toBe('distance_exceeded')
      expect(result.snapX).toBe(60)
      expect(result.snapY).toBe(0)
    })

    it('閾値ぴったりの場合、スナップする（閾値を含む）', () => {
      const input: SnapCalculationInput = {
        currentX: 530,
        currentY: 440,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'rectangle',
        targetShapeType: 'rectangle',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })
  })

  describe('Combined Checks (複合チェック)', () => {
    it('型・回転・距離がすべて一致する場合のみスナップする', () => {
      const input: SnapCalculationInput = {
        currentX: 520,
        currentY: 410,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'isoscelesTriangle',
        targetShapeType: 'isoscelesTriangle',
        currentRotation: 180,
        requiredRotation: 180,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
    })

    it('型が一致しても距離が閾値を超えるとスナップしない', () => {
      const input: SnapCalculationInput = {
        currentX: 600,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'square',
        targetShapeType: 'square',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.failureReason).toBe('distance_exceeded')
    })

    it('距離が閾値以内でも型が異なるとスナップしない', () => {
      const input: SnapCalculationInput = {
        currentX: 510,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'parallelogram',
        targetShapeType: 'rectangle',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.failureReason).toBe('type_mismatch')
    })
  })

  describe('Realistic Scenarios (実用的なシナリオ)', () => {
    it('4歳児向けアプリの実際の画面サイズでの動作確認', () => {
      const input: SnapCalculationInput = {
        currentX: 530,
        currentY: 400,
        targetX: 512,
        targetY: 384,
        threshold: TEST_THRESHOLD,
        shapeType: 'equilateralTriangle',
        targetShapeType: 'equilateralTriangle',
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })

    it('むずかしいモード: 正しい図形と回転で配置成功', () => {
      const input: SnapCalculationInput = {
        currentX: 520,
        currentY: 390,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'isoscelesTriangle',
        targetShapeType: 'isoscelesTriangle',
        currentRotation: 270,
        requiredRotation: 270,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
    })

    it('むずかしいモード: 正しい図形でも回転が違うと配置失敗', () => {
      const input: SnapCalculationInput = {
        currentX: 500,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
        shapeType: 'isoscelesTriangle',
        targetShapeType: 'isoscelesTriangle',
        currentRotation: 0,
        requiredRotation: 90,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.failureReason).toBe('rotation_mismatch')
    })
  })
})

describe('calculateSimpleSnapPosition (後方互換性)', () => {
  it('座標のみで判定する簡易版が正しく動作する', () => {
    const result = calculateSimpleSnapPosition({
      currentX: 520,
      currentY: 400,
      targetX: 500,
      targetY: 400,
      threshold: TEST_THRESHOLD,
    })

    expect(result.shouldSnap).toBe(true)
    expect(result.snapX).toBe(0)
    expect(result.snapY).toBe(0)
  })

  it('閾値を超える場合はスナップしない', () => {
    const result = calculateSimpleSnapPosition({
      currentX: 600,
      currentY: 400,
      targetX: 500,
      targetY: 400,
      threshold: TEST_THRESHOLD,
    })

    expect(result.shouldSnap).toBe(false)
    expect(result.snapX).toBe(100)
    expect(result.snapY).toBe(0)
  })
})
