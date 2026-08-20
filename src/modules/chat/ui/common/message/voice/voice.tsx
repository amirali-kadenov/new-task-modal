import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

import PlayIcon from '@/assets/icons/chat/play.svg'
import PauseIcon from '@/assets/icons/chat/stop.svg'
import { Button, ButtonColor, ButtonLayout } from '@/ui/button/button'
import { Skeleton } from '@/ui/skeleton/skeleton'

import { createVoiceWaveformRenderer } from './lib/render-voice-waveform'
import s from './voice.module.scss'

const WAVEFORM = {
  width: 150,
  height: 24,
  barWidth: 3,
  barGap: 1.5,
  minBarHeight: 4,
  radius: 999,
} as const

interface VoiceMessageProps {
  audioUrl: string
  duration: number
}

export default function VoiceMessage({
  audioUrl,
  duration,
}: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(duration)
  const [hasError, setHasError] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (!waveformRef.current) return

    let cancelled = false
    setIsReady(false)

    const wav = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#b4b4b4',
      width: WAVEFORM.width,
      height: WAVEFORM.height,
      progressColor: '#0a0a0a',
      cursorColor: 'transparent',
      cursorWidth: 0,
      hideScrollbar: true,
      url: audioUrl,
      renderFunction: createVoiceWaveformRenderer(WAVEFORM),
    })

    wavesurferRef.current = wav

    const handleTimeUpdate = (time: number) => setCurrentTime(time)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleFinish = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleReady = (durationVal: number) => {
      if (cancelled) return

      const finalDuration =
        Number.isFinite(durationVal) && durationVal > 0 ? durationVal : duration

      setAudioDuration(finalDuration)
      setHasError(false)
      setIsReady(true)
    }

    wav.on('timeupdate', handleTimeUpdate)
    wav.on('play', handlePlay)
    wav.on('pause', handlePause)
    wav.on('finish', handleFinish)
    wav.on('error', (err) => {
      // destroy()/tab unmount aborts in-flight media loads — ignore those
      if (cancelled || isAbortError(err)) return
      console.error('WaveSurfer error:', err)
      setHasError(true)
      setIsPlaying(false)
    })
    wav.on('ready', handleReady)

    return () => {
      cancelled = true
      wavesurferRef.current = null
      wav.destroy()
    }
  }, [audioUrl, duration])

  const togglePlayPause = async () => {
    const ws = wavesurferRef.current
    if (!ws || hasError) return

    try {
      await ws.playPause()
    } catch (e) {
      if (isAbortError(e)) return
      console.error(e)
      setHasError(true)
      setIsPlaying(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isLoading = !isReady && !hasError

  return (
    <div
      className={clsx(s.voiceMessage, hasError && s.error)}
      onClick={hasError ? undefined : togglePlayPause}
      onKeyDown={
        hasError
          ? undefined
          : (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                void togglePlayPause()
              }
            }
      }
      role={hasError ? undefined : 'button'}
      tabIndex={hasError ? undefined : 0}
    >
      {/* Real content stays mounted at all times so WaveSurfer's container
          ref never goes stale — while loading it's hidden (not unmounted
          or painted over), and the skeleton floats on top. */}
      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        className={clsx(s.playButton, isLoading && s.hidden)}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>

      <div
        className={clsx(s.waveformContainer, isLoading && s.hidden)}
        style={hasError ? { display: 'none' } : undefined}
      >
        <div ref={waveformRef} className={s.waveform} />
      </div>

      {hasError ? (
        <span className={s.errorText}>Audio unavailable</span>
      ) : (
        <span className={clsx(s.duration, isLoading && s.hidden)}>
          {formatTime(currentTime > 0 ? currentTime : audioDuration)}
        </span>
      )}

      {isLoading && <VoiceSkeleton />}
    </div>
  )
}

const VoiceSkeleton = () => (
  <div className={s.skeletonRow}>
    <Skeleton className={s.playButtonSkeleton} />
    <Skeleton className={s.waveformFullSkeleton} />
  </div>
)

export const VoiceMessageSkeleton = () => (
  <div className={clsx(s.voiceMessage, s.standalone)}>
    <VoiceSkeleton />
  </div>
)

const isAbortError = (err: unknown) => {
  if (!err) return false
  if (typeof err === 'object' && 'name' in err && err.name === 'AbortError') {
    return true
  }
  if (err instanceof Error) {
    return err.message.toLowerCase().includes('abort')
  }
  if (typeof err === 'string') {
    return err.toLowerCase().includes('abort')
  }
  return false
}
