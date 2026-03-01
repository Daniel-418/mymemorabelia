type Status = 'pending' | 'sent' | 'failed'

const statusStyles: Record<Status, { bg: string; dot: string; text: string; label: string }> = {
  pending: {
    bg: 'bg-amber-50',
    dot: 'bg-pending',
    text: 'text-amber-800',
    label: 'Pending',
  },
  sent: {
    bg: 'bg-emerald-50',
    dot: 'bg-success',
    text: 'text-emerald-800',
    label: 'Sent',
  },
  failed: {
    bg: 'bg-red-50',
    dot: 'bg-failed',
    text: 'text-red-800',
    label: 'Failed',
  },
}

export default function StatusBadge({ status }: { status: Status }) {
  const style = statusStyles[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  )
}
