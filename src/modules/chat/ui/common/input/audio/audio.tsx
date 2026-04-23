import { useEffect, useRef, useState } from 'react'

import ArrowUpIcon from '@/assets/icons/chat/arrow-up.svg'
import MicrophoneIcon from '@/assets/icons/chat/microphone.svg'
import CloseIcon from '@/assets/icons/close.svg'
import {
  Button,
  ButtonColor,
  ButtonLayout,
  ButtonSize,
} from '@/ui/button/button'
import { InputAsSpan } from '@/ui/input/input'

import s from './audio.module.scss'
import { LiveWaveform } from './live-waveform'
import { MediaRecorderWrapper } from './media-recorder-wrapper'

interface Props {
  onAddVoice: (blob: Blob, durationTime: number) => void
  disabled?: boolean
  isRecording: boolean
  setIsRecording: (value: boolean) => void
}

export const AudioInput = ({
  onAddVoice,
  disabled,
  isRecording,
  setIsRecording,
}: Props) => {
  const [recordingTime, setRecordingTime] = useState(0)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
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
      const recorder = new MediaRecorderWrapper()
      recorderRef.current = recorder
      await recorder.start()

      const audioAnalyser = recorder.getAnalyser()
      setAnalyser(audioAnalyser as any as AnalyserNode | null)
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error: unknown) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const finishRecording = async () => {
    if (recorderRef.current && isRecording) {
      const { blob, duration } = await recorderRef.current.stop()

      onAddVoice(blob, duration)

      setIsRecording(false)
      setRecordingTime(0)
      setAnalyser(null)
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
      setAnalyser(null)
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
        <Button
          onClick={cancelRecording}
          layout={ButtonLayout.Icon}
          size={ButtonSize.SizeIcon}
          color={ButtonColor.Gray}
        >
          <CloseIcon />
        </Button>

        <InputAsSpan className={s.recordingInfo}>
          <LiveWaveform analyser={analyser} />
          <span className={s.recordingTime}>
            {formatRecordingTime(recordingTime)}
          </span>
        </InputAsSpan>

        <Button
          onClick={finishRecording}
          layout={ButtonLayout.Icon}
          size={ButtonSize.SizeIcon}
          color={ButtonColor.White}
        >
          <ArrowUpIcon />
        </Button>
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
