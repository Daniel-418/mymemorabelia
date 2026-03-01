interface GoldButtonProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const sizeClasses = {
  sm: 'text-sm px-4 py-1.5',
  md: 'text-base px-8 py-2.5',
  lg: 'text-lg px-10 py-3',
}

export default function GoldButton({ 
  children, 
  size = 'md', 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false
}: GoldButtonProps) {
  return (
    <button 
      className={`btn-gold ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
