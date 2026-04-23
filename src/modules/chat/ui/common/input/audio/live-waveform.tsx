import { useEffect, useRef, useState } from 'react'
import s from './audio.module.scss'

interface Props {
  analyser: AnalyserNode | null
}

export const LiveWaveform = ({ analyser }: Props) => {
  const [peaks, setPeaks] = useState<number[]>([])
  const requestRef = useRef<number>(null)
  const lastSampleTime = useRef<number>(0)

  useEffect(() => {
    if (!analyser) {
      setPeaks([])
      return
    }

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    lastSampleTime.current = performance.now()

    const updateWaveform = (now: number) => {
      // Sample every 100ms for a steady growth
      if (now - lastSampleTime.current > 100) {
        // Extract current volume level
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const average = sum / bufferLength

        // Normalize using power curve matching VoiceMessage logic
        // We use 64 as a max-average threshold to make it feel responsive
        const normalized = Math.min(1, average / 64)
        const powerView = Math.pow(normalized, 0.7)
        const peak = Math.max(4, powerView * 24)

        setPeaks((prev) => [...prev, peak].slice(-33)) // 33 samples at 4.5px each = 148.5px, fitting perfectly in 150px
        lastSampleTime.current = now
      }

      requestRef.current = requestAnimationFrame(updateWaveform)
    }

    requestRef.current = requestAnimationFrame(updateWaveform)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [analyser])

  return (
    <div className={s.liveWaveform}>
      {peaks.map((height, i) => (
        <div
          key={i}
          className={s.waveformBar}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )
}
