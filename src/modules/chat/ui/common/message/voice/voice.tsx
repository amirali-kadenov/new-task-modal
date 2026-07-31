import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

import PlayIcon from '@/assets/icons/chat/play.svg'
import PauseIcon from '@/assets/icons/chat/stop.svg'
import { Button, ButtonColor, ButtonLayout } from '@/ui/button/button'

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

  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (!waveformRef.current) return

    let cancelled = false

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

  return (
    <div
      className={clsx(s.voiceMessage, hasError && s.error)}
      onClick={hasError ? undefined : togglePlayPause}
    >
      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        className={s.playButton}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>

      {/* Keep waveform mounted so WaveSurfer's container ref stays valid */}
      <div
        className={s.waveformContainer}
        style={hasError ? { display: 'none' } : undefined}
      >
        <div ref={waveformRef} className={s.waveform} />
      </div>

      {hasError ? (
        <span className={s.errorText}>Audio unavailable</span>
      ) : (
        <span className={s.duration}>
          {formatTime(isPlaying ? currentTime : audioDuration)}
        </span>
      )}
    </div>
  )
}

const isAbortError = (err: unknown) => {
  if (!err) return false
  if (typeof err === 'object' && 'name' in err && err.name === 'AbortError') {
    return true
  }
  return String(err).toLowerCase().includes('abort')
}
