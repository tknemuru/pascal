/**
 * 幾何学パターン背景コンポーネント
 * 
 * 4歳児が親しみやすく遊びたくなる背景デザイン。
 * 柔らかいグラデーションに幾何学図形（円・三角形）を散りばめます。
 */
export function GeometricBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <svg className="absolute w-full h-full opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        {/* 円 - グレー/ベージュ系（パーセンテージはcircleで使用可能） */}
        <circle cx="10%" cy="20%" r="50" fill="#9ca3af" />
        <circle cx="85%" cy="15%" r="70" fill="#6b7280" />
        <circle cx="25%" cy="75%" r="60" fill="#d1d5db" />
        <circle cx="70%" cy="80%" r="55" fill="#d6d3d1" />
        <circle cx="50%" cy="50%" r="40" fill="#a8a29e" />
        <circle cx="15%" cy="90%" r="45" fill="#e5e7eb" />
        
        {/* 三角形 - グレー/ベージュ系（絶対座標に変更） */}
        {/* 左上の三角形 */}
        <polygon points="100,50 50,150 150,150" fill="#9ca3af" />
        
        {/* 右中央の三角形 */}
        <polygon points="850,400 800,500 900,500" fill="#d1d5db" />
        
        {/* 左下の三角形 */}
        <polygon points="50,700 100,850 150,750" fill="#6b7280" />
        
        {/* 右下の三角形 */}
        <polygon points="900,850 850,950 950,900" fill="#a8a29e" />
        
        {/* 中央上の三角形 */}
        <polygon points="500,50 450,150 550,150" fill="#d6d3d1" />
        
        {/* 小さな装飾的な三角形たち */}
        <polygon points="300,300 280,350 320,350" fill="#e5e7eb" />
        <polygon points="650,250 630,300 670,300" fill="#9ca3af" />
        <polygon points="400,600 380,650 420,650" fill="#d1d5db" />
      </svg>
    </div>
  )
}
