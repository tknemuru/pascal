/**
 * アニメ風の目コンポーネント
 * 
 * 4歳児が親しみやすいキャラクター性を持たせるため、
 * 大きな目（◕ ◕）でまばたきアニメーションを実装。
 * 
 * @param isBlinking - まばたき状態（trueの時に目が閉じる）
 */
interface AnimeEyesProps {
  isBlinking: boolean
}

export function AnimeEyes({ isBlinking }: AnimeEyesProps) {
  return (
    <div className="flex gap-6 items-center justify-center">
      {/* 左目 */}
      <div 
        className={`relative w-4 h-4 bg-white rounded-full border-2 border-gray-800 
          transition-all duration-150 ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-900 rounded-full">
            {/* ハイライト（白い輝き）- かわいさの演出 */}
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      </div>
      
      {/* 右目 */}
      <div 
        className={`relative w-4 h-4 bg-white rounded-full border-2 border-gray-800 
          transition-all duration-150 ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-900 rounded-full">
            {/* ハイライト（白い輝き） */}
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
