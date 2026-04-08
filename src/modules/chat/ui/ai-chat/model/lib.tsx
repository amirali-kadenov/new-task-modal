import type { ReactNode } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { Translation } from '@/types/api/task'

import { DateMessage } from '../../common/message/date/date-message'
import { Message } from '../../common/message/message'
import { YoutubeVideo } from '../../common/youtube/youtube-video'

import type { AiChatMessageType } from './types'

export const translateContent = (
  text: Translation,
  deps: TaskModalDependencies,
  locatedCountry: string | null,
) => {
  const { Country, Language } = deps.enums
  const language = deps.global.getLanguage()
  const isSchool =
    deps.global.isLocationQalanSchool() || locatedCountry === Country.Russia

  if (!text) return ''
  if (language === Language.English) return text.eng
  if (language === Language.Russian) return isSchool ? text.school : text.rus
  if (language === Language.Uzbek) return text.uzb

  return text.kaz
}

export const getMessageNodes = (messages: AiChatMessageType[]): ReactNode[] => {
  return messages.map((message) => {
    switch (message.type) {
      case 'my-video':
        return <YoutubeVideo key={message.id} url={message.url} />

      case 'current-date':
        return <DateMessage key={message.id} />

      default:
        return <Message key={message.id} message={message} />
    }
  })
}
