import s from './date-message.module.scss'

interface Props {
  date?: string | Date
}

export const DateMessage = ({ date = new Date() }: Props) => {
  const d = typeof date === 'string' ? new Date(date) : date

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime())
  yesterday.setDate(yesterday.getDate() - 1)

  const messageDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  let dateText = ''
  if (messageDate.getTime() === today.getTime()) {
    const time = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    dateText = `Сегодня, ${time}`
  } else if (messageDate.getTime() === yesterday.getTime()) {
    dateText = 'Вчера'
  } else {
    dateText = d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })
  }

  return <div className={s.date}>{dateText}</div>
}
