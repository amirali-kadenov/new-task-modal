import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import PlayIcon from '@/assets/icons/chat/play.svg'
import StopIcon from '@/assets/icons/chat/stop.svg'
import {
  Button,
  ButtonColor,
  ButtonLayout,
  ButtonSize,
} from '@/ui/button/button'

import s from './video.module.scss'

interface Props {
  videoUrl: string
  thumbnailUrl?: string
  sentAt: string
  isFromPupil?: boolean
}

const VideoMessage = ({
  videoUrl,
  thumbnailUrl,
  sentAt,
  isFromPupil,
}: Props) => {
  const time = new Date(sentAt).toLocaleTimeString().slice(0, 5)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoDuration, setVideoDuration] = useState<number>()
  const [remaining, setRemaining] = useState<number>()
  const [progress, setProgress] = useState(0)

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const handlePlay = async () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      await videoRef.current.play()
    }
    setIsPlaying((prev) => !prev)
  }

  const handleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted((prev) => !prev)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !videoDuration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = ratio * videoDuration
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      if (!videoDuration) return
      setRemaining(Math.max(0, videoDuration - video.currentTime))
      setProgress(video.currentTime / videoDuration)
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [videoDuration])

  return (
    <div className={clsx(s.container, isFromPupil ? s.fromPupil : s.fromOther)}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className={s.thumbnail}
        muted={isMuted}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            const d = videoRef.current.duration
            setVideoDuration(d)
            setRemaining(d)
          }
        }}
        controls
        onEnded={() => {
          setIsPlaying(false)
          setProgress(0)
          setRemaining(videoDuration)
        }}
      >
        <track kind="captions" />
      </video>

      {/* Play / Pause */}
      <Button
        className={clsx(s.playButton, isPlaying && s.playButtonHidden)}
        layout={ButtonLayout.Icon}
        size={ButtonSize.SizeIcon}
        color={ButtonColor.White}
        onClick={handlePlay}
      >
        {isPlaying ? <StopIcon /> : <PlayIcon />}
      </Button>

      {/* Duration + Mute */}
      {remaining !== undefined && (
        <div className={s.durationOverlay}>
          <span className={s.duration}>{formatDuration(remaining)}</span>
          <button
            className={s.muteButton}
            onClick={handleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 3.5V8.5H3.5L6.5 11.5V0.5L3.5 3.5H1Z"
                fill="currentColor"
              />
              {isMuted && (
                <path
                  d="M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
              {!isMuted && (
                <>
                  <path
                    d="M8.5 3.5C9.4 4.2 10 5 10 6C10 7 9.4 7.8 8.5 8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      )}

      <div className={s.timeOverlay}>
        <span className={s.time}>{time}</span>
      </div>

      {isPlaying && (
        <div className={s.progressTrack} onClick={handleSeek}>
          <div
            className={s.progressFill}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default VideoMessage
