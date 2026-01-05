'use client'

import DraggableSquare from '@/components/DraggableSquare'

export default function Home() {
  return (
    <main className="w-screen h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center overflow-hidden">
      <DraggableSquare />
    </main>
  )
}
