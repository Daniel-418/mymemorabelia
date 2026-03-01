interface AccordionSectionProps {
  title: string
  color: 'teal' | 'green' | 'purple' | 'red' | 'emerald'
  icon: string
  children: React.ReactNode
}

const colorMap: Record<string, { header: string; iconBg: string }> = {
  teal:    { header: 'bg-teal-dark',    iconBg: 'bg-white/20' },
  green:   { header: 'bg-green-700',    iconBg: 'bg-white/20' },
  purple:  { header: 'bg-purple-700',   iconBg: 'bg-white/20' },
  red:     { header: 'bg-red-600',      iconBg: 'bg-white/20' },
  emerald: { header: 'bg-emerald-700',  iconBg: 'bg-white/20' },
}

export default function AccordionSection({ title, color, icon, children }: AccordionSectionProps) {
  const colors = colorMap[color] ?? { header: 'bg-teal-dark', iconBg: 'bg-white/20' }

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      {/* Header bar */}
      <div className={`${colors.header} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full ${colors.iconBg} flex items-center justify-center text-xs`}>
            {icon}
          </span>
          <span className="text-white text-sm font-medium">{title}</span>
        </div>
        {/* Chevron (static open state) */}
        <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      {/* Content area */}
      <div className="bg-surface p-4">
        {children}
      </div>
    </div>
  )
}
