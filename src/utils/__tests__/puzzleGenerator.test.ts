import { describe, it, expect } from 'vitest'
import { generatePuzzle, getShapeSize, checkShapeMatch } from '../puzzleGenerator'
import { DIFFICULTY_CONFIG } from '@/src/config/constants'
import type { Shape, TargetSlot } from '@/src/types/shapes'

describe('puzzleGenerator', () => {
  describe('generatePuzzle', () => {
    it('should generate puzzle with correct number of shapes for easy difficulty', () => {
      const puzzle = generatePuzzle({
        difficulty: 'easy',
        screenWidth: 800,
        screenHeight: 600,
      })

      expect(puzzle.shapes.length).toBe(DIFFICULTY_CONFIG.easy.shapeCount)
      expect(puzzle.targets.length).toBe(DIFFICULTY_CONFIG.easy.shapeCount)
    })

    it('should generate puzzle with correct number of shapes for normal difficulty', () => {
      const puzzle = generatePuzzle({
        difficulty: 'normal',
        screenWidth: 800,
        screenHeight: 600,
      })

      expect(puzzle.shapes.length).toBe(DIFFICULTY_CONFIG.normal.shapeCount)
      expect(puzzle.targets.length).toBe(DIFFICULTY_CONFIG.normal.shapeCount)
    })

    it('should generate puzzle with correct number of shapes for hard difficulty', () => {
      const puzzle = generatePuzzle({
        difficulty: 'hard',
        screenWidth: 800,
        screenHeight: 600,
      })

      expect(puzzle.shapes.length).toBe(DIFFICULTY_CONFIG.hard.shapeCount)
      expect(puzzle.targets.length).toBe(DIFFICULTY_CONFIG.hard.shapeCount)
    })

    it('should generate shapes with valid properties', () => {
      const puzzle = generatePuzzle({
        difficulty: 'easy',
        screenWidth: 800,
        screenHeight: 600,
      })

      puzzle.shapes.forEach((slot) => {
        expect(slot.shape.id).toBeTruthy()
        expect(slot.shape.type).toBeTruthy()
        expect(slot.shape.width).toBeGreaterThan(0)
        expect(slot.shape.height).toBeGreaterThan(0)
        expect(slot.shape.color).toMatch(/^#[0-9a-fA-F]{6}$/)
        expect([0, 90, 180, 270]).toContain(slot.shape.rotation)
      })
    })

    it('should generate targets with valid positions', () => {
      const puzzle = generatePuzzle({
        difficulty: 'easy',
        screenWidth: 800,
        screenHeight: 600,
      })

      puzzle.targets.forEach((target) => {
        expect(target.x).toBeGreaterThan(0)
        expect(target.x).toBeLessThan(800)
        expect(target.y).toBeGreaterThan(0)
        expect(target.y).toBeLessThan(600)
      })
    })

    it('should only use allowed shapes for each difficulty', () => {
      const difficulties = ['easy', 'normal', 'hard'] as const

      difficulties.forEach((difficulty) => {
        const puzzle = generatePuzzle({
          difficulty,
          screenWidth: 800,
          screenHeight: 600,
        })

        const allowedShapes = DIFFICULTY_CONFIG[difficulty].availableShapes

        puzzle.shapes.forEach((slot) => {
          expect(allowedShapes).toContain(slot.shape.type)
        })
      })
    })

    it('should set requiredRotation only for hard difficulty', () => {
      const easyPuzzle = generatePuzzle({
        difficulty: 'easy',
        screenWidth: 800,
        screenHeight: 600,
      })

      const normalPuzzle = generatePuzzle({
        difficulty: 'normal',
        screenWidth: 800,
        screenHeight: 600,
      })

      easyPuzzle.targets.forEach((target) => {
        expect(target.requiredRotation).toBeUndefined()
      })

      normalPuzzle.targets.forEach((target) => {
        expect(target.requiredRotation).toBeUndefined()
      })
    })
  })

  describe('getShapeSize', () => {
    it('should return correct size for square', () => {
      const size = getShapeSize('square')
      expect(size.width).toBe(size.height)
      expect(size.width).toBeGreaterThan(0)
    })

    it('should return correct size for rectangle', () => {
      const size = getShapeSize('rectangle')
      expect(size.width).toBeGreaterThan(size.height)
    })

    it('should return correct size for all shape types', () => {
      const shapeTypes = ['square', 'rectangle', 'parallelogram', 'equilateralTriangle', 'isoscelesTriangle'] as const

      shapeTypes.forEach((type) => {
        const size = getShapeSize(type)
        expect(size.width).toBeGreaterThan(0)
        expect(size.height).toBeGreaterThan(0)
      })
    })
  })

  describe('checkShapeMatch', () => {
    it('should return true when shape type matches and no rotation required', () => {
      const shape: Shape = {
        id: 'test-1',
        type: 'square',
        width: 100,
        height: 100,
        rotation: 0,
        color: '#ff0000',
      }

      const target: TargetSlot = {
        id: 'target-1',
        shapeType: 'square',
        x: 400,
        y: 300,
        width: 100,
        height: 100,
      }

      expect(checkShapeMatch(shape, target, 0)).toBe(true)
    })

    it('should return false when shape type does not match', () => {
      const shape: Shape = {
        id: 'test-1',
        type: 'square',
        width: 100,
        height: 100,
        rotation: 0,
        color: '#ff0000',
      }

      const target: TargetSlot = {
        id: 'target-1',
        shapeType: 'rectangle',
        x: 400,
        y: 300,
        width: 140,
        height: 70,
      }

      expect(checkShapeMatch(shape, target, 0)).toBe(false)
    })

    it('should return true when rotation matches required rotation', () => {
      const shape: Shape = {
        id: 'test-1',
        type: 'rectangle',
        width: 140,
        height: 70,
        rotation: 90,
        color: '#ff0000',
      }

      const target: TargetSlot = {
        id: 'target-1',
        shapeType: 'rectangle',
        x: 400,
        y: 300,
        width: 140,
        height: 70,
        requiredRotation: 90,
      }

      expect(checkShapeMatch(shape, target, 90)).toBe(true)
    })

    it('should return false when rotation does not match required rotation', () => {
      const shape: Shape = {
        id: 'test-1',
        type: 'rectangle',
        width: 140,
        height: 70,
        rotation: 0,
        color: '#ff0000',
      }

      const target: TargetSlot = {
        id: 'target-1',
        shapeType: 'rectangle',
        x: 400,
        y: 300,
        width: 140,
        height: 70,
        requiredRotation: 90,
      }

      expect(checkShapeMatch(shape, target, 0)).toBe(false)
    })
  })
})
