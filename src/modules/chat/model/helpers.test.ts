import { describe, expect, it, vi } from 'vitest'

import type { MessageInterface, User } from '@/types/api/api'

import {
  createAudioMessage,
  createFileMessage,
  createTextMessage,
  deriveFileNameFromUrl,
  insertDateMarkers,
  normalizeChatMessage,
} from './helpers'

const user: User = {
  id: 7,
  firstname: 'Айгуль',
  surname: 'Ментор',
}

vi.stubGlobal(
  'URL',
  class {
    static createObjectURL = vi.fn(() => 'blob:mock-url')
  },
)

describe('createFileMessage', () => {
  it.each([
    ['photo.jpg', 'image'],
    ['photo.jpeg', 'image'],
    ['photo.png', 'image'],
    ['clip.mp4', 'video'],
    ['clip.webm', 'video'],
    ['doc.pdf', 'file'],
    ['notes.txt', 'file'],
  ] as const)('maps %s → type %s', (name, type) => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')

    const message = createFileMessage(
      new File(['x'], name, { type: 'application/octet-stream' }),
      user,
    )

    expect(message.type).toBe(type)
    expect(message).toMatchObject({
      fileName: name,
      senderUserId: user.id,
      senderFullname: 'Айгуль Ментор',
      isFromPupil: true,
      fileUrl: 'blob:mock-url',
    })
  })

  it.each([['voice.mp3'], ['voice.wav']] as const)(
    'maps %s → audio message with audioUrl',
    (name) => {
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')

      const message = createFileMessage(
        new File(['x'], name, { type: 'application/octet-stream' }),
        user,
      )

      expect(message).toMatchObject({
        type: 'audio',
        duration: 0,
        audioUrl: 'blob:mock-url',
        senderFullname: 'Айгуль Ментор',
        isFromPupil: true,
      })
    },
  )
})

describe('createAudioMessage', () => {
  it('builds audio message from blob', () => {
    const message = createAudioMessage(new Blob(['a']), 12.5, user)

    expect(message).toMatchObject({
      type: 'audio',
      duration: 12.5,
      audioUrl: 'blob:mock-url',
      senderFullname: 'Айгуль Ментор',
      isFromPupil: true,
    })
  })
})

describe('createTextMessage', () => {
  it('builds text message', () => {
    expect(createTextMessage('привет', user)).toMatchObject({
      type: 'text',
      text: 'привет',
      senderUserId: 7,
      isFromPupil: true,
    })
  })
})

describe('deriveFileNameFromUrl', () => {
  it('strips the signed query string and preserves the extension', () => {
    expect(
      deriveFileNameFromUrl(
        'https://s3.example.com/upsilon-columba/file_2936355a-fa56-4bda-9525-f358a3c1aef5.mov?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=abc',
      ),
    ).toBe('file_2936355a-fa56-4bda-9525-f358a3c1aef5.mov')
  })

  it('returns the last path segment as-is when there is no extension', () => {
    expect(
      deriveFileNameFromUrl(
        'https://s3.example.com/upsilon-columba/voice_ff8f30c0-26a9-4c27-9da1-9cba691eef7b',
      ),
    ).toBe('voice_ff8f30c0-26a9-4c27-9da1-9cba691eef7b')
  })

  it('falls back to a placeholder when there is no usable path segment', () => {
    expect(deriveFileNameFromUrl('')).toBe('Файл')
    expect(deriveFileNameFromUrl('///')).toBe('Файл')
  })

  it('does not throw on non-URL input, returning it verbatim as the segment', () => {
    expect(deriveFileNameFromUrl('not-a-url')).toBe('not-a-url')
  })
})

describe('normalizeChatMessage', () => {
  const base = {
    id: 1,
    senderUserId: 7,
    senderFullname: 'Айгуль Ментор',
    sentAt: '2026-01-01T10:00:00.000Z',
  }

  it.each(['image', 'video'] as const)(
    'maps text → fileUrl for %s type',
    (type) => {
      const raw = {
        ...base,
        type,
        text: 'https://s3.example.com/image.jpg',
      } as unknown as MessageInterface

      expect(normalizeChatMessage(raw)).toMatchObject({
        type,
        fileUrl: 'https://s3.example.com/image.jpg',
      })
    },
  )

  it('maps text → fileUrl and derives fileName from the URL for file type', () => {
    const raw = {
      ...base,
      type: 'file',
      text: 'https://s3.example.com/file_abc-123.pdf?X-Amz-Signature=xyz',
    } as unknown as MessageInterface

    expect(normalizeChatMessage(raw)).toMatchObject({
      type: 'file',
      fileUrl: 'https://s3.example.com/file_abc-123.pdf?X-Amz-Signature=xyz',
      fileName: 'file_abc-123.pdf',
    })
  })

  it('keeps an existing fileName for file type instead of deriving one', () => {
    const raw = {
      ...base,
      type: 'file',
      text: 'https://s3.example.com/file_abc-123.pdf',
      fileName: 'preexisting.pdf',
    } as unknown as MessageInterface

    expect(normalizeChatMessage(raw)).toMatchObject({
      type: 'file',
      fileName: 'preexisting.pdf',
    })
  })

  it('maps text → audioUrl for audio type and defaults missing duration to 0', () => {
    const raw = {
      ...base,
      type: 'audio',
      text: 'https://s3.example.com/voice.mp3',
    } as unknown as MessageInterface

    expect(normalizeChatMessage(raw)).toMatchObject({
      type: 'audio',
      audioUrl: 'https://s3.example.com/voice.mp3',
      duration: 0,
    })
  })

  it('leaves text messages untouched', () => {
    const message: MessageInterface = {
      ...base,
      type: 'text',
      text: 'привет',
    }

    expect(normalizeChatMessage(message)).toEqual(message)
  })
})

describe('insertDateMarkers', () => {
  it('inserts a marker when the calendar day changes', () => {
    const day1 = createTextMessage('a', user)
    day1.sentAt = '2026-01-01T10:00:00.000Z'
    day1.id = 1

    const day2 = createTextMessage('b', user)
    day2.sentAt = '2026-01-02T10:00:00.000Z'
    day2.id = 2

    const result = insertDateMarkers([day1, day2])

    expect(result).toHaveLength(4)
    expect(result[0]).toMatchObject({ type: 'date-marker' })
    expect(result[1]).toBe(day1)
    expect(result[2]).toMatchObject({ type: 'date-marker' })
    expect(result[3]).toBe(day2)
  })
})
