import type { AiChatMessageType } from './types'

export const GREETING_TEXT = (
  <>
    Привет!
    <br />
    <br />
    Трудности с задачей? Посмотри видео, если не поможет - пиши, разберемся
  </>
)

export const VIDEO_EXPLANATION_TEXT = (
  <>
    Держи пример, после просмотра добавиться <b>одна дополнительная задача</b>
  </>
)

export const INITIAL_MESSAGES: AiChatMessageType[] = [
  {
    id: Date.now() * 92423,
    type: 'current-date',
  },
  {
    id: Date.now() * 924,
    text: GREETING_TEXT,
    senderUserId: 0,
    senderFullname: 'AI-чат',
    sentAt: new Date().toISOString(),
    isFromPupil: false,
    type: 'text',
  },
]

export const MOCK_THEORY: AiChatMessageType = {
  id: Date.now(),
  type: 'my-video',
  url: 'https://youtube.com/embed/is-Pi0GxN78',
}
