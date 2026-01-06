'use client'

import type { ShapeType, Rotation } from '@/src/types/shapes'
import {
  SQUARE_SIZE,
  RECTANGLE_SIZE,
  PARALLELOGRAM_SIZE,
  EQUILATERAL_TRIANGLE_SIZE,
  ISOSCELES_TRIANGLE_SIZE,
} from '@/src/config/constants'
import { AnimeEyes } from '@/components/AnimeEyes'

interface ShapeRendererProps {
  type: ShapeType
  color: string
  rotation?: Rotation
  isBlinking?: boolean
  showEyes?: boolean
  isTarget?: boolean
  showBorder?: boolean
}

/**
 * 図形を描画するコンポーネント
 */
export function ShapeRenderer({
  type,
  color,
  rotation = 0,
  isBlinking = false,
  showEyes = true,
  isTarget = false,
  showBorder = true,
}: ShapeRendererProps) {
  const baseStyle = {
    transform: `rotate(${rotation}deg)`,
  }

  const eyesElement = showEyes && !isTarget ? (
    <div style={{ transform: `rotate(${-rotation}deg)` }}>
      <AnimeEyes isBlinking={isBlinking} />
    </div>
  ) : null

  switch (type) {
    case 'square':
      return (
        <div
          style={{
            ...baseStyle,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
            backgroundColor: isTarget && showBorder ? 'transparent' : color,
            border: isTarget && showBorder ? '3px dashed rgba(255,255,255,0.5)' : 'none',
            borderRadius: 4,
          }}
          className="flex items-center justify-center shadow-lg"
        >
          {eyesElement}
        </div>
      )

    case 'rectangle':
      return (
        <div
          style={{
            ...baseStyle,
            width: RECTANGLE_SIZE.width,
            height: RECTANGLE_SIZE.height,
            backgroundColor: isTarget && showBorder ? 'transparent' : color,
            border: isTarget && showBorder ? '3px dashed rgba(255,255,255,0.5)' : 'none',
            borderRadius: 4,
          }}
          className="flex items-center justify-center shadow-lg"
        >
          {eyesElement}
        </div>
      )

    case 'parallelogram':
      return (
        <div
          style={{
            ...baseStyle,
            width: PARALLELOGRAM_SIZE.width,
            height: PARALLELOGRAM_SIZE.height,
          }}
          className="flex items-center justify-center"
        >
          <svg
            width={PARALLELOGRAM_SIZE.width}
            height={PARALLELOGRAM_SIZE.height}
            viewBox={`0 0 ${PARALLELOGRAM_SIZE.width} ${PARALLELOGRAM_SIZE.height}`}
          >
            <polygon
              points={`${PARALLELOGRAM_SIZE.skew},0 ${PARALLELOGRAM_SIZE.width},0 ${PARALLELOGRAM_SIZE.width - PARALLELOGRAM_SIZE.skew},${PARALLELOGRAM_SIZE.height} 0,${PARALLELOGRAM_SIZE.height}`}
              fill={isTarget && showBorder ? 'transparent' : color}
              stroke={isTarget && showBorder ? 'rgba(255,255,255,0.5)' : 'none'}
              strokeWidth={isTarget && showBorder ? 3 : 0}
              strokeDasharray={isTarget && showBorder ? '8,4' : 'none'}
            />
          </svg>
          <div className="absolute">{eyesElement}</div>
        </div>
      )

    case 'equilateralTriangle':
      const eqBase = EQUILATERAL_TRIANGLE_SIZE.base
      const eqHeight = EQUILATERAL_TRIANGLE_SIZE.height
      return (
        <div
          style={{
            ...baseStyle,
            width: eqBase,
            height: eqHeight,
          }}
          className="flex items-center justify-center relative"
        >
          <svg width={eqBase} height={eqHeight} viewBox={`0 0 ${eqBase} ${eqHeight}`}>
            <polygon
              points={`${eqBase / 2},0 ${eqBase},${eqHeight} 0,${eqHeight}`}
              fill={isTarget && showBorder ? 'transparent' : color}
              stroke={isTarget && showBorder ? 'rgba(255,255,255,0.5)' : 'none'}
              strokeWidth={isTarget && showBorder ? 3 : 0}
              strokeDasharray={isTarget && showBorder ? '8,4' : 'none'}
            />
          </svg>
          <div className="absolute" style={{ top: '50%' }}>
            {eyesElement}
          </div>
        </div>
      )

    case 'isoscelesTriangle':
      const isoBase = ISOSCELES_TRIANGLE_SIZE.base
      const isoHeight = ISOSCELES_TRIANGLE_SIZE.height
      return (
        <div
          style={{
            ...baseStyle,
            width: isoBase,
            height: isoHeight,
          }}
          className="flex items-center justify-center relative"
        >
          <svg width={isoBase} height={isoHeight} viewBox={`0 0 ${isoBase} ${isoHeight}`}>
            <polygon
              points={`${isoBase / 2},0 ${isoBase},${isoHeight} 0,${isoHeight}`}
              fill={isTarget && showBorder ? 'transparent' : color}
              stroke={isTarget && showBorder ? 'rgba(255,255,255,0.5)' : 'none'}
              strokeWidth={isTarget && showBorder ? 3 : 0}
              strokeDasharray={isTarget && showBorder ? '8,4' : 'none'}
            />
          </svg>
          <div className="absolute" style={{ top: '55%' }}>
            {eyesElement}
          </div>
        </div>
      )

    default:
      return null
  }
}
