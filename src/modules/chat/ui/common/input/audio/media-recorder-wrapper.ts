const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export class MediaRecorderWrapper {
  private mediaRecorder: MediaRecorder | null = null
  private mediaStream: MediaStream | null = null
  private chunks: Blob[] = []
  private startTime = 0
  private analyser: AnalyserNode | null = null

  getStream() {
    return this.mediaStream
  }

  async start() {
    this.chunks = []

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      const audioTrack = this.mediaStream.getAudioTracks()[0]
      if (audioTrack) {
        console.log('🎤 Recording started with device:', audioTrack.label)
        console.log('Track settings:', audioTrack.getSettings())
      }

      const mimeType = this.getMimeType()
      console.log('📦 Using mimeType:', mimeType)

      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType,
        audioBitsPerSecond: 128000,
      })

      this.startTime = performance.now()

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data)
        }
      }

      this.mediaRecorder.onerror = (e) => {
        console.error('❌ MediaRecorder error:', e)
      }

      this.mediaRecorder.start(100) // Collect data every 100ms
    } catch (err) {
      console.error('❌ Failed to start recording:', err)
      throw err
    }
  }

  getMimeType() {
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      return 'audio/webm;codecs=opus'
    }
    if (MediaRecorder.isTypeSupported('audio/webm')) {
      return 'audio/webm'
    }
    return 'audio/mp4'
  }

  stop(): Promise<{ blob: Blob; duration: number }> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve({ blob: new Blob(), duration: 0 })
        return
      }

      this.mediaRecorder.onstop = () => {
        const duration = (performance.now() - this.startTime) / 1000
        console.log('⏹️ Recording stopped. Duration:', duration.toFixed(2), 's')

        const blob = new Blob(this.chunks, {
          type: this.mediaRecorder!.mimeType,
        })
        console.log('💾 Audio Blob created:', {
          size: (blob.size / 1024).toFixed(2) + ' KB',
          type: blob.type,
        })

        this.cleanup()
        resolve({ blob, duration })
      }

      this.mediaRecorder.stop()
    })
  }

  getAnalyser(): AnalyserNode | null {
    if (!this.mediaStream) return null
    if (this.analyser) return this.analyser

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    const audioContext = new AudioContextClass()
    const source = audioContext.createMediaStreamSource(this.mediaStream)
    this.analyser = audioContext.createAnalyser()
    this.analyser.fftSize = 256
    source.connect(this.analyser)
    return this.analyser
  }

  private cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }
    this.mediaRecorder = null
    this.chunks = []
    this.analyser = null
  }

  cancel() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }
    this.cleanup()
  }
}
