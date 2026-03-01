import { useState } from 'react'
import GoldButton from '../ui/GoldButton'

interface TextEditorOverlayProps {
  isOpen: boolean
  onDone: (text: string) => void
  onCancel: () => void
}

export default function TextEditorOverlay({ isOpen, onDone, onCancel }: TextEditorOverlayProps) {
  const [text, setText] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-xl mx-4">
        {/* Top scroll roll */}
        <div className="h-4 rounded-t-full bg-gradient-to-b from-amber-700/40 to-amber-600/20" />

        {/* Parchment panel */}
        <div className="bg-gradient-to-b from-amber-50 via-amber-100/80 to-amber-50 px-8 py-6 shadow-xl">
          <h2 className="font-heading text-2xl text-amber-900 text-center mb-4">
            Write Your Memory
          </h2>

          {/* Formatting toolbar */}
          <div className="flex gap-1 mb-3">
            <button className="w-8 h-8 rounded bg-amber-200/60 text-amber-900 font-bold text-sm hover:bg-amber-200 transition-colors">
              B
            </button>
            <button className="w-8 h-8 rounded bg-amber-200/60 text-amber-900 italic text-sm hover:bg-amber-200 transition-colors">
              I
            </button>
            <button className="w-8 h-8 rounded bg-amber-200/60 text-amber-900 underline text-sm hover:bg-amber-200 transition-colors">
              U
            </button>
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pour your thoughts here..."
            rows={8}
            className="w-full bg-transparent border border-amber-300/50 rounded-lg px-4 py-3 text-amber-900 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none font-body leading-relaxed"
          />

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={onCancel}
              className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
            >
              Cancel
            </button>
            <GoldButton size="sm" onClick={() => onDone(text)}>Done</GoldButton>
          </div>
        </div>

        {/* Bottom scroll roll */}
        <div className="h-4 rounded-b-full bg-gradient-to-t from-amber-700/40 to-amber-600/20" />
      </div>
    </div>
  )
}
