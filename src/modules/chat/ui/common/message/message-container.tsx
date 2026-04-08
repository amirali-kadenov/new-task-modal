import clsx from 'clsx'

import s from './message.module.scss'

interface Props {
  children: React.ReactNode
  isFromPupil: boolean | undefined
}

export const MessageContainer = ({ children, isFromPupil }: Props) => {
  return (
    <div
      className={clsx(
        s.message,
        isFromPupil ? s.messageFromPupil : s.messageFromOther,
      )}
    >
      {children}
    </div>
  )
}
