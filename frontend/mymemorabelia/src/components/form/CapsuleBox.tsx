import type { CapsuleItemLocal, MediaKind } from '../../types/capsule'
import MediaTypeIcon from '../ui/MediaTypeIcon'
import CapsuleItemCard from './CapsuleItemCard'

interface CapsuleBoxProps {
  items: CapsuleItemLocal[]
  onAddItem: (kind: MediaKind) => void
  onRemoveItem: (id: string) => void
}

const attachmentButtons: { kind: MediaKind; label: string }[] = [
  { kind: 'text', label: 'Text' },
  { kind: 'image', label: 'Image' },
  { kind: 'video', label: 'Video' },
  { kind: 'audio', label: 'Audio' },
  { kind: 'gif', label: 'GIF' },
  { kind: 'music_link', label: 'Spotify' },
]

export default function CapsuleBox({ items, onAddItem, onRemoveItem }: CapsuleBoxProps) {
  return (
    <div className="mt-6">
      {/* Box area */}
      <div className="border-2 border-dashed border-border rounded-xl p-6 min-h-[160px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            {/* Gift box icon */}
            <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <p className="text-sm text-secondary">Your capsule is empty</p>
            <p className="text-xs text-secondary/60 mt-1">Add memories using the buttons below</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <CapsuleItemCard key={item.id} item={item} onRemove={onRemoveItem} />
            ))}
          </div>
        )}
      </div>

      {/* Attachment row */}
      <div className="flex flex-wrap gap-2 mt-4">
        {attachmentButtons.map(({ kind, label }) => (
          <button
            key={kind}
            onClick={() => onAddItem(kind)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface text-sm text-secondary hover:border-gold-start/40 hover:text-primary transition-colors"
          >
            <MediaTypeIcon kind={kind} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
