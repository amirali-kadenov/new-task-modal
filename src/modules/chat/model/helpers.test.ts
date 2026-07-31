import { describe, expect, it, vi } from 'vitest'

import type { User } from '@/types/api/api'

import {
  createAudioMessage,
  createFileMessage,
  createTextMessage,
  insertDateMarkers,
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
