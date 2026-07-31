export interface VoiceWaveformGeometry {
  barWidth: number
  barGap: number
  minBarHeight: number
  radius: number
}

const POWER = 0.7
const REFERENCE_PERCENTILE = 0.95

/**
 * WaveSurfer `renderFunction`: RMS buckets + 95th-percentile scale + pow(0.7),
 * bottom-aligned roundRect bars (matches live recording curve).
 */
export const createVoiceWaveformRenderer =
  ({ barWidth, barGap, minBarHeight, radius }: VoiceWaveformGeometry) =>
  (channels: Array<Float32Array | number[]>, ctx: CanvasRenderingContext2D) => {
    const samples = channels[0]
    if (!samples?.length) return

    const { width, height } = ctx.canvas
    const dpr = window.devicePixelRatio || 1
    const stepPx = (barWidth + barGap) * dpr
    const barWidthPx = barWidth * dpr
    const barCount = Math.max(1, Math.floor(width / stepPx))
    const minHeightPx = minBarHeight * dpr

    const rmsValues = new Array<number>(barCount)
    for (let i = 0; i < barCount; i++) {
      const start = Math.floor((i / barCount) * samples.length)
      const end = Math.floor(((i + 1) / barCount) * samples.length)
      let sumSq = 0
      let n = 0
      for (let j = start; j < end; j++) {
        const v = samples[j] ?? 0
        sumSq += v * v
        n++
      }
      rmsValues[i] = n > 0 ? Math.sqrt(sumSq / n) : 0
    }

    const sorted = [...rmsValues].sort((a, b) => a - b)
    const refIndex = Math.min(
      sorted.length - 1,
      Math.floor(sorted.length * REFERENCE_PERCENTILE),
    )
    const reference = Math.max(sorted[refIndex] ?? 0, 1e-6)
    const minRatio = minHeightPx / height

    ctx.beginPath()
    for (let i = 0; i < barCount; i++) {
      const ratio = Math.min(1, (rmsValues[i] ?? 0) / reference)
      const curved = Math.max(minRatio, Math.min(1, Math.pow(ratio, POWER)))
      const barH = curved * height
      const x = i * stepPx
      const y = height - barH

      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, barWidthPx, barH, radius * dpr)
      } else {
        ctx.rect(x, y, barWidthPx, barH)
      }
    }
    ctx.fill()
    ctx.closePath()
  }
