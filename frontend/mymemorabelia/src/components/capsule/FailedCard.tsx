interface FailedCardProps {
  errorMessage: string
}

export default function FailedCard({ errorMessage }: FailedCardProps) {
  return (
    <div className="rounded-xl bg-failed p-5 text-white shadow-sm">
      {/* Exclamation icon */}
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
      </div>

      {/* Error message */}
      <p className="text-sm text-center text-white/90 mb-4">{errorMessage}</p>

      {/* Retry button */}
      <div className="flex justify-center">
        <button className="px-4 py-1.5 bg-white text-failed text-sm font-medium rounded-lg hover:bg-white/90 transition-colors">
          Retry
        </button>
      </div>
    </div>
  )
}
