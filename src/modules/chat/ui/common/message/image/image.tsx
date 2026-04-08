import clsx from 'clsx'

import s from './image.module.scss'

interface Props {
  imageUrl: string
  sentAt: string
  isFromPupil?: boolean
}

const ImageMessage = ({ imageUrl, sentAt, isFromPupil }: Props) => {
  const time = new Date(sentAt).toLocaleTimeString().slice(0, 5)
  console.log({ imageUrl })
  return (
    <div className={clsx(s.container, isFromPupil ? s.fromPupil : s.fromOther)}>
      <img src={imageUrl} alt="" className={s.image} />
      <div className={s.timeOverlay}>
        <span className={s.time}>{time}</span>
      </div>
    </div>
  )
}

export default ImageMessage
