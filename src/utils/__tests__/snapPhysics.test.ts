import { describe, it, expect } from 'vitest'
import { calculateSnapPosition } from '../snapPhysics'
import type { SnapCalculationInput } from '../snapPhysics'
import { DEFAULT_SNAP_THRESHOLD } from '@/src/config/constants'

// テスト全体で使用する基準閾値（実装と同じ値を使用）
const TEST_THRESHOLD = DEFAULT_SNAP_THRESHOLD

describe('calculateSnapPosition', () => {
  describe('Basic Snap (基本的なスナップ)', () => {
    it('閾値以内（距離30px）の場合、ターゲットの中心にスナップする', () => {
      // ターゲット: (500, 400)
      // 現在: (530, 400) → 距離 30px
      const input: SnapCalculationInput = {
        currentX: 530,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })

    it('閾値以内で斜めの位置からもスナップする', () => {
      // ターゲット: (500, 400)
      // 現在: (520, 415) → 距離 √(20² + 15²) ≈ 25px
      const input: SnapCalculationInput = {
        currentX: 520,
        currentY: 415,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })
  })

  describe('No Snap (スナップしない)', () => {
    it('閾値より遠い（距離60px）場合、スナップせず元の相対座標を返す', () => {
      // ターゲット: (500, 400)
      // 現在: (560, 400) → 距離 60px
      const input: SnapCalculationInput = {
        currentX: 560,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.snapX).toBe(60) // currentX - targetX
      expect(result.snapY).toBe(0)  // currentY - targetY
    })

    it('閾値より遠い斜め位置でもスナップしない', () => {
      // ターゲット: (500, 400)
      // 現在: (550, 440) → 距離 √(50² + 40²) ≈ 64.03px
      const input: SnapCalculationInput = {
        currentX: 550,
        currentY: 440,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.snapX).toBe(50)  // 550 - 500
      expect(result.snapY).toBe(40)  // 440 - 400
    })
  })

  describe('Boundary Cases (境界値)', () => {
    it('閾値ぴったりの場合、スナップする（閾値を含む）', () => {
      // ターゲット: (500, 400)
      // 現在: (530, 440) → 距離 √(30² + 40²) = 50px (閾値と同じ)
      const input: SnapCalculationInput = {
        currentX: 530,
        currentY: 440,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })

    it('閾値をわずかに超える場合、スナップしない', () => {
      // ターゲット: (500, 400)
      // 現在: (530, 440.1) → 距離 ≈ 50.1px (閾値を0.1px超える)
      const input: SnapCalculationInput = {
        currentX: 530,
        currentY: 440.1,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.snapX).toBe(30)
      expect(result.snapY).toBeCloseTo(40.1, 5)
    })
  })

  describe('Zero Distance (距離ゼロ)', () => {
    it('ターゲットと完全に重なっている（距離0）場合も正しくスナップ判定される', () => {
      // ターゲット: (500, 400)
      // 現在: (500, 400) → 距離 0px
      const input: SnapCalculationInput = {
        currentX: 500,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })
  })

  describe('Edge Cases (エッジケース)', () => {
    it('負の座標でも正しく動作する', () => {
      // ターゲット: (-100, -50)
      // 現在: (-120, -50) → 距離 20px
      const input: SnapCalculationInput = {
        currentX: -120,
        currentY: -50,
        targetX: -100,
        targetY: -50,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })

    it('閾値が0の場合、完全一致のみスナップする', () => {
      // ターゲット: (500, 400)
      // 現在: (500, 400) → 距離 0px
      const input: SnapCalculationInput = {
        currentX: 500,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: 0,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })

    it('閾値が0で少しでもズレていればスナップしない', () => {
      // ターゲット: (500, 400)
      // 現在: (500.1, 400) → 距離 0.1px
      const input: SnapCalculationInput = {
        currentX: 500.1,
        currentY: 400,
        targetX: 500,
        targetY: 400,
        threshold: 0,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.snapX).toBeCloseTo(0.1, 5)
      expect(result.snapY).toBe(0)
    })

    it('大きな閾値（1000px）でも正しく動作する', () => {
      // ターゲット: (500, 400)
      // 現在: (1200, 800) → 距離 √(700² + 400²) ≈ 806.23px
      const input: SnapCalculationInput = {
        currentX: 1200,
        currentY: 800,
        targetX: 500,
        targetY: 400,
        threshold: 1000,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })
  })

  describe('Realistic Scenarios (実用的なシナリオ)', () => {
    it('4歳児向けアプリの実際の画面サイズでの動作確認', () => {
      // iPad画面の中央: (512, 384)
      // ドラッグ終了位置: (530, 400)
      // 距離: √(18² + 16²) ≈ 24.08px (閾値以内)
      const input: SnapCalculationInput = {
        currentX: 530,
        currentY: 400,
        targetX: 512,
        targetY: 384,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
      expect(result.snapX).toBe(0)
      expect(result.snapY).toBe(0)
    })

    it('タッチ操作で少しズレた場合（距離45px）もスナップする', () => {
      // 画面中央: (512, 384)
      // ドロップ位置: (550, 410)
      // 距離: √(38² + 26²) ≈ 46.04px
      const input: SnapCalculationInput = {
        currentX: 550,
        currentY: 410,
        targetX: 512,
        targetY: 384,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(true)
    })

    it('画面の端に投げた場合はスナップしない', () => {
      // 画面中央: (512, 384)
      // ドロップ位置: (700, 384)
      // 距離: 188px (閾値を大きく超える)
      const input: SnapCalculationInput = {
        currentX: 700,
        currentY: 384,
        targetX: 512,
        targetY: 384,
        threshold: TEST_THRESHOLD,
      }

      const result = calculateSnapPosition(input)

      expect(result.shouldSnap).toBe(false)
      expect(result.snapX).toBe(188)
      expect(result.snapY).toBe(0)
    })
  })
})
