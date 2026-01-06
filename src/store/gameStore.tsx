'use client'

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { Difficulty, GamePhase, PuzzleTemplate } from '@/src/types/shapes'
import { TOTAL_STAGES } from '@/src/config/constants'

// ============================================
// 状態の型定義
// ============================================

interface GameState {
  difficulty: Difficulty
  currentStage: number
  phase: GamePhase
  puzzle: PuzzleTemplate | null
  placedShapeIds: string[]
}

// ============================================
// アクションの型定義
// ============================================

type GameAction =
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'START_GAME' }
  | { type: 'SET_PUZZLE'; payload: PuzzleTemplate }
  | { type: 'PLACE_SHAPE'; payload: string }
  | { type: 'STAGE_CLEAR' }
  | { type: 'NEXT_STAGE' }
  | { type: 'GAME_CLEAR' }
  | { type: 'RESET_GAME' }

// ============================================
// 初期状態
// ============================================

const initialState: GameState = {
  difficulty: 'easy',
  currentStage: 1,
  phase: 'menu',
  puzzle: null,
  placedShapeIds: [],
}

// ============================================
// Reducer
// ============================================

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload,
      }

    case 'START_GAME':
      return {
        ...state,
        phase: 'playing',
        currentStage: 1,
        placedShapeIds: [],
      }

    case 'SET_PUZZLE':
      return {
        ...state,
        puzzle: action.payload,
        placedShapeIds: [],
      }

    case 'PLACE_SHAPE':
      return {
        ...state,
        placedShapeIds: [...state.placedShapeIds, action.payload],
      }

    case 'STAGE_CLEAR':
      return {
        ...state,
        phase: 'stageClear',
      }

    case 'NEXT_STAGE':
      if (state.currentStage >= TOTAL_STAGES) {
        return {
          ...state,
          phase: 'gameClear',
        }
      }
      return {
        ...state,
        phase: 'playing',
        currentStage: state.currentStage + 1,
        placedShapeIds: [],
        puzzle: null,
      }

    case 'GAME_CLEAR':
      return {
        ...state,
        phase: 'gameClear',
      }

    case 'RESET_GAME':
      return initialState

    default:
      return state
  }
}

// ============================================
// Context
// ============================================

interface GameContextType {
  state: GameState
  setDifficulty: (difficulty: Difficulty) => void
  startGame: () => void
  setPuzzle: (puzzle: PuzzleTemplate) => void
  placeShape: (shapeId: string) => void
  stageClear: () => void
  nextStage: () => void
  gameClear: () => void
  resetGame: () => void
  isAllShapesPlaced: () => boolean
}

const GameContext = createContext<GameContextType | null>(null)

// ============================================
// Provider
// ============================================

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty })
  }, [])

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' })
  }, [])

  const setPuzzle = useCallback((puzzle: PuzzleTemplate) => {
    dispatch({ type: 'SET_PUZZLE', payload: puzzle })
  }, [])

  const placeShape = useCallback((shapeId: string) => {
    dispatch({ type: 'PLACE_SHAPE', payload: shapeId })
  }, [])

  const stageClear = useCallback(() => {
    dispatch({ type: 'STAGE_CLEAR' })
  }, [])

  const nextStage = useCallback(() => {
    dispatch({ type: 'NEXT_STAGE' })
  }, [])

  const gameClear = useCallback(() => {
    dispatch({ type: 'GAME_CLEAR' })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [])

  const isAllShapesPlaced = useCallback(() => {
    if (!state.puzzle) return false
    return state.placedShapeIds.length === state.puzzle.shapes.length
  }, [state.puzzle, state.placedShapeIds])

  return (
    <GameContext.Provider
      value={{
        state,
        setDifficulty,
        startGame,
        setPuzzle,
        placeShape,
        stageClear,
        nextStage,
        gameClear,
        resetGame,
        isAllShapesPlaced,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
