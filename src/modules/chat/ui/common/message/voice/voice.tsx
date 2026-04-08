import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

import PlayIcon from '@/assets/icons/chat/play.svg'
import PauseIcon from '@/assets/icons/chat/stop.svg'
import { Button, ButtonColor, ButtonLayout } from '@/ui/button/button'

import s from './voice.module.scss'

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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!waveformRef.current) return

    const progressColor = '#0a0a0a'
    const waveColor = '#b4b4b4'

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor,
      // width: MIN_PX_PER_SEC * duration,
      width: 150,
      progressColor,
      barWidth: 3,
      // minPxPerSec: MIN_PX_PER_SEC,
      barGap: 1.5,
      height: 24,
      barAlign: 'bottom',
      barRadius: 999,
      url: audioUrl,
      backend: 'WebAudio',
      normalize: true,
      cursorColor: 'transparent',
      cursorWidth: 0,
      barMinHeight: 4,
      hideScrollbar: true,
    })

    const wav = wavesurferRef.current

    const handleTimeUpdate = (time: number) => {
      setCurrentTime(time)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleFinish = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const handleError = (e: Error) => {
      console.error('WaveSurfer error:', e)
      setHasError(true)
      setIsPlaying(false)
    }

    let peaksLoaded = false

    const handleReady = (durationVal: number) => {
      if (Number.isFinite(durationVal) && durationVal > 0) {
        setAudioDuration(durationVal)
      }
      setHasError(false)

      if (peaksLoaded) return
      peaksLoaded = true

      const decoded = wav.getDecodedData()
      if (!decoded) return

      const peaks = computePeaks(decoded)
      wav.load(audioUrl, [peaks], durationVal)
    }

    wav.on('timeupdate', handleTimeUpdate)
    wav.on('play', handlePlay)
    wav.on('pause', handlePause)
    wav.on('finish', handleFinish)
    wav.on('error', handleError)
    wav.on('ready', handleReady)

    return () => {
      wav.destroy()
    }
  }, [audioUrl])

  const togglePlayPause = async () => {
    const ws = wavesurferRef.current
    if (!ws || hasError) return

    try {
      await ws.playPause()
    } catch (e) {
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

  if (hasError) {
    return (
      <div className={clsx(s.voiceMessage, s.error)}>
        <Button
          color={ButtonColor.White}
          layout={ButtonLayout.Icon}
          className={s.playButton}
        >
          <PlayIcon />
        </Button>
        <span className={s.errorText}>Audio unavailable</span>
      </div>
    )
  }

  return (
    <div className={s.voiceMessage} onClick={togglePlayPause}>
      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        className={s.playButton}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>

      <div ref={containerRef} className={s.waveformContainer}>
        <div ref={waveformRef} className={s.waveform} />
      </div>

      <span className={s.duration}>
        {formatTime(isPlaying ? currentTime : audioDuration)}
      </span>
    </div>
  )
}

/**
 * Computes normalized waveform peaks from a decoded AudioBuffer for display in WaveSurfer.
 *
 * Uses RMS (root mean square) per block instead of peak amplitude, which better reflects
 * perceived loudness — especially for voice messages where raw peaks can be spiky.
 * The result is normalized to 0–1 range and compressed with a power curve to make
 * quiet parts more visible without letting loud parts dominate.
 *
 * @param decoded - Decoded AudioBuffer from WaveSurfer's getDecodedData()
 * @param numBars - Number of bars to render (default: 80)
 * @returns Array of normalized peak values in range [0.08, 1]
 */
const computePeaks = (decoded: AudioBuffer, numBars = 80): number[] => {
  const channelData = decoded.getChannelData(0)
  const blockSize = Math.floor(channelData.length / numBars)
  const peaks: number[] = []

  for (let i = 0; i < numBars; i++) {
    const start = i * blockSize
    const end = Math.min(start + blockSize, channelData.length)
    let sum = 0
    for (let j = start; j < end; j++) {
      sum += channelData[j] * channelData[j]
    }
    peaks.push(Math.sqrt(sum / (end - start)))
  }

  const maxPeak = Math.max(...peaks)
  if (maxPeak > 0) {
    for (let i = 0; i < peaks.length; i++) {
      peaks[i] = Math.max(Math.pow(peaks[i] / maxPeak, 0.7), 0.08)
    }
  }

  return peaks
}
