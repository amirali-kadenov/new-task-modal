import { useEffect, useRef, useState } from 'react'

import { useAudioStore } from './audio-store'
import { getSpacesAmount } from './get-spaces-amount'

interface Args {
  audio: string | null | undefined
  text: string
}

export const usePlayAudio = ({ audio, text }: Args) => {
  const charCount = text.length
  const spacesAmount = getSpacesAmount(text)

  const setAudioProgress = useAudioStore((state) => state.setProgress)

  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = () => {
    setIsPlaying(true)
    void audioRef.current?.play()
  }

  const pauseAudio = () => {
    setIsPlaying(false)
    audioRef.current?.pause()
  }

  useEffect(() => {
    if (!audio) return

    const audioEl = new Audio(audio)
    audioRef.current = audioEl

    let rafId: number | null = null

    const updateProgress = () => {
      const durationPerChar = audioEl.duration / charCount
      const spacesDuration = spacesAmount * durationPerChar
      const duration = audioEl.duration - spacesDuration

      if (duration > 0) {
        const progress = audioEl.currentTime / duration
        setAudioProgress(progress)
      }

      if (!audioEl.paused) {
        rafId = requestAnimationFrame(updateProgress)
      }
    }

    const onPlay = () => {
      setIsPlaying(true)
      rafId = requestAnimationFrame(updateProgress)
    }

    const onPause = () => {
      setIsPlaying(false)
      if (rafId) cancelAnimationFrame(rafId)
    }

    const onEnded = () => {
      setIsPlaying(false)
      setAudioProgress(0)
      if (rafId) cancelAnimationFrame(rafId)
    }

    audioEl.addEventListener('play', onPlay)
    audioEl.addEventListener('pause', onPause)
    audioEl.addEventListener('ended', onEnded)

    return () => {
      audioEl.removeEventListener('play', onPlay)
      audioEl.removeEventListener('pause', onPause)
      audioEl.removeEventListener('ended', onEnded)

      if (rafId) cancelAnimationFrame(rafId)

      audioEl.pause()
      audioEl.currentTime = 0
      audioRef.current = null
    }
  }, [audio, setAudioProgress, spacesAmount, charCount])

  return {
    isPlaying,
    playAudio,
    pauseAudio,
  }
}
