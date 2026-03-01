interface InputFieldProps {
  label?: string
  type?: string
  placeholder?: string
  className?: string
}

export default function InputField({ label, type = 'text', placeholder, className = '' }: InputFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-secondary mb-1.5">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-gold-start/30 focus:border-gold-start transition-colors font-body"
      />
    </div>
  )
}
