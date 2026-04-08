import { useEffect, useRef, useState } from 'react'

import MicrophoneIcon from '@/assets/icons/chat/microphone.svg'
import StopIcon from '@/assets/icons/chat/stop.svg'
import CloseIcon from '@/assets/icons/close.svg'
import {
  Button,
  ButtonColor,
  ButtonLayout,
  ButtonSize,
} from '@/ui/button/button'

import s from './audio.module.scss'
import { MediaRecorderWrapper } from './media-recorder-wrapper'

interface Props {
  onAddVoice: (blob: Blob, durationTime: number) => void
  disabled?: boolean
}

export const AudioInput = ({ onAddVoice, disabled }: Props) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recorderRef = useRef<MediaRecorderWrapper | null>(null)
  const timerRef = useRef<number | undefined | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      recorderRef.current = new MediaRecorderWrapper()
      await recorderRef.current.start()

      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = async () => {
    if (recorderRef.current && isRecording) {
      const { blob, duration } = await recorderRef.current.stop()

      onAddVoice(blob, duration)

      setIsRecording(false)
      setRecordingTime(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      recorderRef.current = null
    }
  }

  const cancelRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.cancel()
      setIsRecording(false)
      setRecordingTime(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      recorderRef.current = null
    }
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isRecording) {
    return (
      <div className={s.recordingControls}>
        <button
          className={s.cancelButton}
          onClick={cancelRecording}
          aria-label="Cancel recording"
          type="button"
        >
          <CloseIcon />
        </button>
        <div className={s.recordingInfo}>
          <div className={s.recordingDot} />
          <span className={s.recordingTime}>
            {formatRecordingTime(recordingTime)}
          </span>
        </div>
        <button
          className={s.sendButton}
          onClick={stopRecording}
          aria-label="Stop recording"
          type="button"
        >
          <StopIcon />
        </button>
      </div>
    )
  }

  return (
    <Button
      onClick={startRecording}
      disabled={disabled}
      color={ButtonColor.White}
      layout={ButtonLayout.Icon}
      size={ButtonSize.SizeIcon}
    >
      <MicrophoneIcon />
    </Button>
  )
}
