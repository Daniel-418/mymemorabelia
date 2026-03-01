import { useState } from 'react'
import type { CapsuleItemLocal } from '../../types/capsule'
import GoldButton from '../ui/GoldButton'
import ContentRevealCard from './ContentRevealCard'

interface CapsuleRevealProps {
  items: CapsuleItemLocal[]
}

export default function CapsuleReveal({ items }: CapsuleRevealProps) {
  const [revealedCount, setRevealedCount] = useState(0)

  const allRevealed = revealedCount >= items.length

  if (revealedCount === 0) {
    return (
      <div className="flex flex-col items-center py-12">
        {/* Capsule illustration — sealed */}
        <div
          onClick={() => setRevealedCount(1)}
          className="cursor-pointer group"
        >
          <div className="relative w-32 h-44 mx-auto mb-6">
            {/* Capsule body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 shadow-lg group-hover:shadow-xl transition-shadow">
              {/* Band */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-4 bg-gray-600/40" />
              {/* Highlight */}
              <div className="absolute top-4 left-4 w-4 h-10 rounded-full bg-white/30" />
            </div>
            {/* Lock icon */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-secondary text-center group-hover:text-primary transition-colors">
            Click to open
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Shrunken capsule */}
      <div className="flex justify-center mb-8">
        <div className="relative w-16 h-22">
          <div className="w-16 h-22 rounded-full bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 shadow-md">
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-600/40" />
            <div className="absolute top-2 left-2 w-2 h-5 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* Content cards */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <ContentRevealCard
            key={item.id}
            item={item}
            isRevealed={index < revealedCount}
          />
        ))}
      </div>

      {/* Reveal button or completion */}
      <div className="flex justify-center mt-8">
        {allRevealed ? (
          <p className="text-sm text-secondary italic">All memories revealed</p>
        ) : (
          <GoldButton onClick={() => setRevealedCount((c) => c + 1)}>
            Reveal Next ({revealedCount}/{items.length})
          </GoldButton>
        )}
      </div>
    </div>
  )
}
