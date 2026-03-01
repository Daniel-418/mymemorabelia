import type { CapsuleItemLocal } from '../../types/capsule'
import MediaTypeIcon from '../ui/MediaTypeIcon'

interface CapsuleItemCardProps {
  item: CapsuleItemLocal
  onRemove: (id: string) => void
}

const kindLabels: Record<string, string> = {
  text: 'Text',
  image: 'Image',
  video: 'Video',
  audio: 'Audio',
  gif: 'GIF',
  music_link: 'Spotify',
}

function getLabel(item: CapsuleItemLocal): string {
  if (item.text) return item.text.slice(0, 30) + (item.text.length > 30 ? '...' : '')
  if (item.fileName) return item.fileName
  if (item.url) return item.url.slice(0, 30) + '...'
  return kindLabels[item.kind] || 'Item'
}

export default function CapsuleItemCard({ item, onRemove }: CapsuleItemCardProps) {
  return (
    <div className="group flex items-center gap-2 bg-cream rounded-lg px-3 py-2 border border-border/50">
      {/* Position badge */}
      <span className="w-5 h-5 rounded-full bg-teal-dark text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        {item.position}
      </span>

      {/* Media icon */}
      <MediaTypeIcon kind={item.kind} />

      {/* Label */}
      <span className="text-sm text-primary truncate flex-1">
        {getLabel(item)}
      </span>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs flex items-center justify-center hover:bg-red-200 transition-all shrink-0"
      >
        {'\u2715'}
      </button>
    </div>
  )
}
