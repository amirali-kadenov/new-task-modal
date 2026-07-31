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
  } as MessageInterface
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
