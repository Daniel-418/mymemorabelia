import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import PageWrapper from '../components/layout/PageWrapper'
import GoldButton from '../components/ui/GoldButton'
import CapsuleBox from '../components/form/CapsuleBox'
import TextEditorOverlay from '../components/form/TextEditorOverlay'
import FileUploadOverlay from '../components/form/FileUploadOverlay'
import SpotifyLinkOverlay from '../components/form/SpotifyLinkOverlay'
import type { MediaKind, CapsuleItemLocal } from '../types/capsule'

export default function CreateCapsuleForm() {
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<CapsuleItemLocal[]>([])
  const [activeOverlay, setActiveOverlay] = useState<MediaKind | null>(null)

  const addItem = (kind: MediaKind, data: { text?: string; fileName?: string; url?: string }) => {
    const newItem: CapsuleItemLocal = {
      id: crypto.randomUUID(),
      kind,
      position: items.length + 1,
      ...data,
    }
    setItems((prev) => [...prev, newItem])
    setActiveOverlay(null)
  }

  const removeItem = (id: string) => {
    setItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, i) => ({ ...item, position: i + 1 }))
    )
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <h1 className="font-heading text-3xl text-primary mb-8">Create New Memory</h1>

        <div className="max-w-2xl mx-auto">
          {/* Main white card */}
          <div className="bg-surface rounded-xl shadow-sm p-8">
            {/* Borderless title input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
              className="w-full text-4xl font-heading text-primary placeholder:text-secondary/30 border-none outline-none bg-transparent mb-6"
            />

            {/* Capsule box */}
            <CapsuleBox
              items={items}
              onAddItem={(kind) => setActiveOverlay(kind)}
              onRemoveItem={removeItem}
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-center gap-6 pt-6">
            <button className="text-sm text-secondary hover:text-primary transition-colors">
              Cancel
            </button>
            <GoldButton>Bury</GoldButton>
          </div>
        </div>

        {/* Overlays */}
        <TextEditorOverlay
          isOpen={activeOverlay === 'text'}
          onDone={(text) => addItem('text', { text })}
          onCancel={() => setActiveOverlay(null)}
        />
        <FileUploadOverlay
          isOpen={activeOverlay === 'image'}
          kind="image"
          onDone={(fileName) => addItem('image', { fileName })}
          onCancel={() => setActiveOverlay(null)}
        />
        <FileUploadOverlay
          isOpen={activeOverlay === 'video'}
          kind="video"
          onDone={(fileName) => addItem('video', { fileName })}
          onCancel={() => setActiveOverlay(null)}
        />
        <FileUploadOverlay
          isOpen={activeOverlay === 'audio'}
          kind="audio"
          onDone={(fileName) => addItem('audio', { fileName })}
          onCancel={() => setActiveOverlay(null)}
        />
        <FileUploadOverlay
          isOpen={activeOverlay === 'gif'}
          kind="gif"
          onDone={(fileName) => addItem('gif', { fileName })}
          onCancel={() => setActiveOverlay(null)}
        />
        <SpotifyLinkOverlay
          isOpen={activeOverlay === 'music_link'}
          onDone={(url) => addItem('music_link', { url })}
          onCancel={() => setActiveOverlay(null)}
        />
      </PageWrapper>
    </>
  )
}
