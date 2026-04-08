import { MessageSkeleton } from '../message/message-skeleton'

import s from './chat-layout.module.scss'

export const ChatLayoutSkeleton = () => {
  return (
    <div className={s.messages}>
      <MessageSkeleton isFromPupil />
      <MessageSkeleton isFromPupil />
      <MessageSkeleton />
      <MessageSkeleton />
    </div>
  )
}
