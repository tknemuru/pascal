'use client'

import type { TargetSlot } from '@/src/types/shapes'
import { ShapeRenderer } from './shapes/ShapeRenderer'

interface TargetAreaProps {
  targets: TargetSlot[]
  showGridLines: boolean
}

/**
 * パズルのターゲットエリアコンポーネント
 */
export function TargetArea({ targets, showGridLines }: TargetAreaProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* ターゲットエリアの背景 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] h-[50%] max-h-[400px] bg-gray-800/50 rounded-2xl border-4 border-white/30" style={{ marginTop: '-50px' }} />

      {/* 各ターゲットスロット */}
      {targets.map((target) => (
        <div
          key={target.id}
          data-target={target.id}
          className="absolute"
          style={{
            left: target.x - target.width / 2,
            top: target.y - target.height / 2,
          }}
        >
          {showGridLines ? (
            // かんたんモード: 図形の輪郭を表示
            <ShapeRenderer
              type={target.shapeType}
              color="rgba(255,255,255,0.3)"
              rotation={target.requiredRotation}
              showEyes={false}
              isTarget={true}
            />
          ) : (
            // ふつう・むずかしいモード: 配置可能エリアのみ表示
            <div
              style={{
                width: target.width,
                height: target.height,
                border: '2px dashed rgba(255,255,255,0.2)',
                borderRadius: 4,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
