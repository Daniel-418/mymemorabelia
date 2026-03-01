import { Link } from 'react-router-dom'
import StatusBadge from '../ui/StatusBadge'
import MediaTypeIcon from '../ui/MediaTypeIcon'

interface CapsuleCardProps {
  title: string
  snippet: string
  mediaTypes: Array<'text' | 'image' | 'video' | 'audio' | 'gif' | 'music_link'>
  date: string
}

export default function CapsuleCard({ title, snippet, mediaTypes, date }: CapsuleCardProps) {
  return (
    <Link to="/capsules/1" className="block">
    <div className="bg-surface rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow">
      {/* Title */}
      <h3 className="font-heading text-lg text-primary mb-2">{title}</h3>

      {/* Text snippet */}
      <p className="text-sm text-secondary leading-relaxed line-clamp-2 mb-4">
        {snippet}
      </p>

      {/* Media type icons */}
      <div className="flex gap-2 mb-4">
        {mediaTypes.map((kind, i) => (
          <MediaTypeIcon key={i} kind={kind} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <StatusBadge status="sent" />
        <span className="text-xs text-secondary">{date}</span>
      </div>
    </div>
    </Link>
  )
}
