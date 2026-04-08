import type { JSX } from 'react'

import s from './text.module.scss'

interface TextMessageProps {
  text: string | JSX.Element
  isFromPupil: boolean | undefined
  senderFullname: string
}

export const TextMessage = ({
  text,
  isFromPupil,
  senderFullname,
}: TextMessageProps) => {
  return (
    <>
      {!isFromPupil && <div className={s.senderName}>{senderFullname}</div>}
      <div className={s.messageText}>{text}</div>
    </>
  )
}
