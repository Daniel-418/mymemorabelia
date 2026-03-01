type MediaKind = 'text' | 'image' | 'video' | 'audio' | 'gif' | 'music_link'

const iconConfig: Record<MediaKind, { bg: string; icon: string }> = {
  text: {
    bg: 'bg-blue-100 text-blue-600',
    icon: 'T',
  },
  image: {
    bg: 'bg-rose-100 text-rose-600',
    icon: '\u{1F5BC}',
  },
  video: {
    bg: 'bg-purple-100 text-purple-600',
    icon: '\u25B6',
  },
  audio: {
    bg: 'bg-orange-100 text-orange-600',
    icon: '\u266B',
  },
  gif: {
    bg: 'bg-teal-100 text-teal-600',
    icon: 'GIF',
  },
  music_link: {
    bg: 'bg-green-100 text-green-600',
    icon: '\u266A',
  },
}

export default function MediaTypeIcon({ kind }: { kind: MediaKind }) {
  const config = iconConfig[kind]
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${config.bg}`}
      title={kind}
    >
      {config.icon}
    </span>
  )
}
