const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export class MediaRecorderWrapper {
  private mediaRecorder: MediaRecorder | null = null
  private mediaStream: MediaStream | null = null
  private chunks: Blob[] = []
  private startTime = 0

  async start() {
    this.chunks = []
    this.startTime = Date.now()

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 48000,
      },
    })
    const mimeType = this.getMimeType()
    console.log('mimeType', { IS_SAFARI, mimeType })

    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      audioBitsPerSecond: 128000,
    })

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data)
      }
    }

    this.mediaRecorder.start(100) // Collect data every 100ms
  }

  getMimeType() {
    // return 'audio/mp4'
    // if (IS_SAFARI) {
    //   return 'audio/mp4'
    // }
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
      if (!this.mediaRecorder) {
        resolve({ blob: new Blob(), duration: 0 })
        return
      }

      this.mediaRecorder.onstop = () => {
        const duration = Math.floor((Date.now() - this.startTime) / 1000)
        const blob = new Blob(this.chunks, {
          type: this.mediaRecorder!.mimeType,
        })

        this.cleanup()
        resolve({ blob, duration })
      }

      this.mediaRecorder.stop()
    })
  }

  private cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }
    this.mediaRecorder = null
    this.chunks = []
  }

  cancel() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }
    this.cleanup()
  }
}
