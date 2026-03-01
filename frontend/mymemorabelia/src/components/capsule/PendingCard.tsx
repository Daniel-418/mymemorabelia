interface PendingCardProps {
  title: string
  daysRemaining: number
}

export default function PendingCard({ title, daysRemaining }: PendingCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-amber-50 border border-amber-200/50 p-5 shadow-sm">
      {/* Blurred title preview */}
      <div className="blur-sm select-none mb-6">
        <div className="h-4 w-3/4 bg-amber-200/50 rounded mb-2" />
        <div className="h-3 w-full bg-amber-200/30 rounded mb-1" />
        <div className="h-3 w-2/3 bg-amber-200/30 rounded" />
      </div>

      {/* Lock icon */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-amber-800">
          Unlocks in: <span className="font-bold">{daysRemaining} Days</span>
        </p>
      </div>
    </div>
  )
}
