export type MediaKind = 'text' | 'image' | 'video' | 'audio' | 'gif' | 'music_link'

export interface CapsuleItemLocal {
  id: string
  kind: MediaKind
  position: number
  text?: string
  url?: string
  fileName?: string
}

export const PLACEHOLDER_ITEMS: CapsuleItemLocal[] = [
  {
    id: '1',
    kind: 'text',
    position: 1,
    text: 'Remember when we danced under the stars that night? The music was playing softly and everything felt perfect. I never want to forget the way the moonlight caught your smile.',
  },
  {
    id: '2',
    kind: 'image',
    position: 2,
    fileName: 'wedding_photo_01.jpg',
  },
  {
    id: '3',
    kind: 'video',
    position: 3,
    fileName: 'first_dance.mp4',
  },
  {
    id: '4',
    kind: 'image',
    position: 4,
    fileName: 'sunset_portrait.jpg',
  },
  {
    id: '5',
    kind: 'audio',
    position: 5,
    fileName: 'vows_recording.m4a',
  },
  {
    id: '6',
    kind: 'music_link',
    position: 6,
    url: 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
  },
]
