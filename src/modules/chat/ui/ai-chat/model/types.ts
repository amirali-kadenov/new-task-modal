import type { MessageInterface } from '@/types/api/api'

export interface MyVideoMessageType {
  type: 'my-video'
  url: string
  id: number
}

type CurrentDateMessage = {
  id: number
  type: 'current-date'
}

export type AiChatMessageType =
  | MessageInterface
  | MyVideoMessageType
  | CurrentDateMessage
