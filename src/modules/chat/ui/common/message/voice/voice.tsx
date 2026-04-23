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
    console.log('🧪 VoiceMessage useEffect triggered for:', audioUrl)
    if (!waveformRef.current) {
      console.warn('⚠️ waveformRef.current is null!')
      return
    }

    const progressColor = '#0a0a0a'
    const waveColor = '#b4b4b4'

    console.log('🏗️ Creating WaveSurfer instance...')
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor,
      width: 150,
      progressColor,
      barWidth: 3,
      barGap: 1.5,
      height: 24,
      barAlign: 'bottom',
      barRadius: 999,
      // Temporarily removing url from create to load it manually after listeners are attached
      // url: audioUrl,
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

    let peaksLoaded = false

    const handleReady = (durationVal: number) => {
      console.log('🎵 WaveSurfer ready event! Reported duration:', durationVal)

      const finalDuration =
        Number.isFinite(durationVal) && durationVal > 0 ? durationVal : duration

      console.log('⏱️ Final duration used:', finalDuration)

      if (finalDuration !== audioDuration) {
        setAudioDuration(finalDuration)
      }
      setHasError(false)

      if (peaksLoaded) {
        console.log('✅ Peaks already loaded, skipping re-load')
        return
      }
      peaksLoaded = true

      console.log('🔍 Checking for decoded data...')
      const decoded = wav.getDecodedData()
      if (!decoded) {
        console.warn('⚠️ Could not decode audio data for waveform peaks')
        return
      }

      console.log('📊 Computing waveform peaks from AudioBuffer...')
      const peaks = computePeaks(decoded)
      console.log('📥 Loading peaks into WaveSurfer. URL:', audioUrl)
      wav.load(audioUrl, [peaks], finalDuration)
    }

    wav.on('timeupdate', handleTimeUpdate)
    wav.on('play', handlePlay)
    wav.on('pause', handlePause)
    wav.on('finish', handleFinish)
    wav.on('error', (err) => {
      console.error('❌ WaveSurfer error event:', err)
      setHasError(true)
      setIsPlaying(false)
    })
    wav.on('ready', handleReady)
    wav.on('loading', (pct) => console.log(`⏳ Loading audio: ${pct}%`))
    wav.on('decode', (dur) => console.log(`🔓 Audio decoded. Duration: ${dur}`))

    console.log('🛰️ Manually calling wav.load(audioUrl)...')
    wav.load(audioUrl).catch((err) => {
      console.error('❌ wav.load failed catch:', err)
    })

    return () => {
      console.log('🧹 Cleaning up WaveSurfer instance')
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
