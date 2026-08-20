import type {
  AudioMessage,
  MessageInterface,
  TextMessage,
  User,
} from '@/types/api/api'

export const createFileMessage = (file: File, user: User): MessageInterface => {
  const type = getFileType(file)

  // VoiceMessage reads `audioUrl` / `duration`, not the file fields.
  if (type === 'audio') {
    return createAudioMessage(file, 0, user)
  }

  return {
    id: Date.now(),
    senderUserId: user.id,
    senderFullname: `${user.firstname} ${user.surname}`,
    sentAt: new Date().toISOString(),
    isFromPupil: true,
    type: type,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    fileUrl: URL.createObjectURL(file),
  }
}

export const createAudioMessage = (
  blob: Blob,
  recordingTime: number,
  user: User,
): AudioMessage => {
  return {
    id: Date.now(),
    senderUserId: user.id,
    senderFullname: `${user.firstname} ${user.surname}`,
    sentAt: new Date().toISOString(),
    isFromPupil: true,
    type: 'audio',
    duration: recordingTime,
    audioUrl: URL.createObjectURL(blob),
  }
}

export const createTextMessage = (text: string, user: User): TextMessage => {
  return {
    id: Date.now(),
    senderUserId: user.id,
    senderFullname: `${user.firstname} ${user.surname}`,
    sentAt: new Date().toISOString(),
    isFromPupil: true,
    type: 'text',
    text,
  }
}

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
const VIDEO_EXT = ['mp4', 'webm']
const AUDIO_EXT = ['mp3', 'wav']

export const getFileType = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (!ext) return 'file'

  if (IMAGE_EXT.includes(ext)) return 'image'
  if (VIDEO_EXT.includes(ext)) return 'video'
  if (AUDIO_EXT.includes(ext)) return 'audio'

  return 'file'
}

const FALLBACK_FILE_NAME = 'Файл'

export const deriveFileNameFromUrl = (url: string): string => {
  try {
    const withoutQuery = url.split('?')[0]
    const lastSegment = withoutQuery.split('/').filter(Boolean).pop()
    return lastSegment ? decodeURIComponent(lastSegment) : FALLBACK_FILE_NAME
  } catch {
    return FALLBACK_FILE_NAME
  }
}

export const normalizeChatMessage = (
  message: MessageInterface,
): MessageInterface => {
  if (
    message.type === 'image' ||
    message.type === 'video' ||
    message.type === 'file'
  ) {
    const raw = message as unknown as { text: string; fileName?: string }
    const fileUrl = raw.text

    if (message.type === 'file') {
      return {
        ...message,
        fileUrl,
        fileName: raw.fileName || deriveFileNameFromUrl(fileUrl),
      }
    }

    return { ...message, fileUrl }
  }
  if (message.type === 'audio') {
    const raw = message as unknown as { text: string; duration?: number }
    return {
      ...message,
      audioUrl: raw.text,
      duration:
        typeof raw.duration === 'number' && Number.isFinite(raw.duration)
          ? raw.duration
          : 0,
    }
  }
  return message
}

export interface DateMarker {
  type: 'date-marker'
  date: string
  id: string
}

export type MessageWithDates = MessageInterface | DateMarker

export const insertDateMarkers = (
  messages: MessageInterface[],
): MessageWithDates[] => {
  const result: MessageWithDates[] = []
  let lastDate: string | null = null

  messages.forEach((message) => {
    const messageDate = new Date(message.sentAt).toDateString()

    if (messageDate !== lastDate) {
      result.push({
        type: 'date-marker',
        date: message.sentAt,
        id: `date-${message.sentAt}-${message.id}`,
      })
      lastDate = messageDate
    }

    result.push(message)
  })

  return result
}
