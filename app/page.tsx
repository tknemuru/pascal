'use client'

import { GeometricBackground } from '@/components/GeometricBackground'
import DraggableSquare from '@/components/DraggableSquare'

export default function Home() {
  return (
    <>
      <GeometricBackground />
      <main className="relative w-screen h-screen overflow-hidden">
        <DraggableSquare />
      </main>
    </>
  )
}
