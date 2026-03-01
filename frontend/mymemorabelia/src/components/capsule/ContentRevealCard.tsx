import type { CapsuleItemLocal } from '../../types/capsule'
import MediaTypeIcon from '../ui/MediaTypeIcon'

interface ContentRevealCardProps {
  item: CapsuleItemLocal
  isRevealed: boolean
}

const kindLabels: Record<string, string> = {
  text: 'Text Memory',
  image: 'Photo',
  video: 'Video',
  audio: 'Audio Recording',
  gif: 'GIF',
  music_link: 'Spotify Track',
}

function ContentPreview({ item }: { item: CapsuleItemLocal }) {
  switch (item.kind) {
    case 'text':
      return (
        <p className="text-sm text-secondary leading-relaxed">
          {item.text}
        </p>
      )
    case 'image':
    case 'gif':
      return (
        <div className="w-full h-48 rounded-lg bg-rose-100 flex items-center justify-center">
          <span className="text-4xl text-rose-400">{'\u{1F5BC}'}</span>
        </div>
      )
    case 'video':
      return (
        <div className="w-full h-48 rounded-lg bg-purple-100 flex items-center justify-center relative">
          <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-md">
            <span className="text-purple-500 text-xl ml-1">{'\u25B6'}</span>
          </div>
        </div>
      )
    case 'audio':
      return (
        <div className="flex items-center gap-3 bg-cream rounded-lg px-4 py-3">
          <button className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <span className="text-orange-500 ml-0.5">{'\u25B6'}</span>
          </button>
          <div className="flex-1">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-orange-400 rounded-full" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-secondary">1:24</span>
              <span className="text-[10px] text-secondary">3:45</span>
            </div>
          </div>
        </div>
      )
    case 'music_link':
      return (
        <div className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
            {'\u266A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary truncate">Spotify Track</p>
            <p className="text-xs text-secondary truncate">{item.url}</p>
          </div>
        </div>
      )
    default:
      return null
  }
}

export default function ContentRevealCard({ item, isRevealed }: ContentRevealCardProps) {
  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isRevealed
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-teal-dark text-white text-[10px] font-bold flex items-center justify-center">
            {item.position}
          </span>
          <MediaTypeIcon kind={item.kind} />
          <span className="text-sm font-medium text-primary">{kindLabels[item.kind]}</span>
        </div>

        {/* Content */}
        <ContentPreview item={item} />
      </div>
    </div>
  )
}
