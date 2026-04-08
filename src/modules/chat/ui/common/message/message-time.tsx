import s from './message.module.scss'

interface Props {
  sentAt: string
}

export const MessageTime = ({ sentAt }: Props) => {
  return (
    <div className={s.messageTime}>
      {new Date(sentAt).toLocaleTimeString().slice(0, 5)}
    </div>
  )
}
