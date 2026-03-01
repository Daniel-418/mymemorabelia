import { useState } from 'react'
import GoldButton from '../ui/GoldButton'

interface SpotifyLinkOverlayProps {
  isOpen: boolean
  onDone: (url: string) => void
  onCancel: () => void
}

export default function SpotifyLinkOverlay({ isOpen, onDone, onCancel }: SpotifyLinkOverlayProps) {
  const [url, setUrl] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-surface rounded-2xl shadow-xl p-8">
        {/* Spotify icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl shadow-lg">
            {'\u266A'}
          </div>
        </div>

        <h2 className="font-heading text-2xl text-primary text-center mb-6">
          Attach Spotify Link
        </h2>

        {/* URL input */}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://open.spotify.com/track/..."
          className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 font-body"
        />
        <p className="text-xs text-secondary/60 mt-2">
          Paste a Spotify track, album, or playlist URL
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <GoldButton size="sm" onClick={() => onDone(url || 'https://open.spotify.com/track/example')}>
            Done
          </GoldButton>
        </div>
      </div>
    </div>
  )
}
