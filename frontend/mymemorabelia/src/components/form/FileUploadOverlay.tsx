import { useState } from 'react'
import type { MediaKind } from '../../types/capsule'
import GoldButton from '../ui/GoldButton'

interface FileUploadOverlayProps {
  isOpen: boolean
  kind: MediaKind
  onDone: (fileName: string) => void
  onCancel: () => void
}

const kindLabels: Partial<Record<MediaKind, string>> = {
  image: 'Upload Image',
  video: 'Upload Video',
  audio: 'Upload Audio',
  gif: 'Upload GIF',
}

const kindHints: Partial<Record<MediaKind, string>> = {
  image: 'JPG, PNG, WebP up to 50MB',
  video: 'MP4, MOV, WebM up to 50MB',
  audio: 'MP3, WAV, M4A up to 50MB',
  gif: 'GIF up to 50MB',
}

const placeholderFileNames: Partial<Record<MediaKind, string>> = {
  image: 'photo_memory.jpg',
  video: 'video_clip.mp4',
  audio: 'audio_note.m4a',
  gif: 'animation.gif',
}

export default function FileUploadOverlay({ isOpen, kind, onDone, onCancel }: FileUploadOverlayProps) {
  const [fileName, setFileName] = useState('')

  if (!isOpen) return null

  const handleDropZoneClick = () => {
    const name = placeholderFileNames[kind] || 'file.bin'
    setFileName(name)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-surface rounded-2xl shadow-xl p-8">
        <h2 className="font-heading text-2xl text-primary text-center mb-6">
          {kindLabels[kind] || 'Upload File'}
        </h2>

        {/* Drop zone */}
        <div
          onClick={handleDropZoneClick}
          className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-gold-start/40 transition-colors cursor-pointer mb-3"
        >
          <svg className="w-10 h-10 mx-auto text-secondary/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-secondary">
            Drag and drop or <span className="text-gold-start font-medium">click to browse</span>
          </p>
          <p className="text-xs text-secondary/60 mt-1">{kindHints[kind]}</p>
        </div>

        {/* Selected file */}
        {fileName && (
          <div className="flex items-center gap-2 bg-cream rounded-lg px-3 py-2 mb-4">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-primary truncate">{fileName}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={onCancel}
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <GoldButton size="sm" onClick={() => onDone(fileName || placeholderFileNames[kind] || 'file.bin')}>
            Done
          </GoldButton>
        </div>
      </div>
    </div>
  )
}
