import { useState } from 'react'

import youtubeIconUrl from '@/assets/icons/chat/youtube.png'

import s from './youtube-video.module.scss'

interface Props {
  url: string
}

export const YoutubeVideo = ({ url }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const getVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getVideoId(url)
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : ''

  if (isPlaying) {
    const embedUrl = videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
      : url
    return (
      <div className={s.videoContainer}>
        <iframe
          className={s.iframe}
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={s.fakePlayer}
      onClick={() => setIsPlaying(true)}
    >
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt="Video thumbnail" className={s.thumbnail} />
      ) : (
        <div className={s.fallbackBackground} />
      )}
      <img src={youtubeIconUrl} alt="" className={s.playIcon} />
    </button>
  )
}
