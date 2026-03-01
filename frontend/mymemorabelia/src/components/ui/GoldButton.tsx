interface GoldButtonProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: 'text-sm px-4 py-1.5',
  md: 'text-base px-8 py-2.5',
  lg: 'text-lg px-10 py-3',
}

export default function GoldButton({ children, size = 'md', className = '', onClick }: GoldButtonProps) {
  return (
    <button className={`btn-gold ${sizeClasses[size]} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
