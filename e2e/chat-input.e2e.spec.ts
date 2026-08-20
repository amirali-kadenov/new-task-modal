import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test, type Page } from '@playwright/test'

import { chatStoryUrl, STORYBOOK_BASE } from './storybook-url'

/**
 * End-to-end chat input coverage against the Storybook `Chat/Chat` story:
 * text, image/video/audio/file attachments, and voice recording.
 *
 * Requires Storybook (`npm run storybook`, default `http://localhost:6006`,
 * overridable via `STORYBOOK_BASE`). Skips cleanly when it isn't reachable.
 */

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MEDIA = path.join(dirname, '../public/storybook-media')

let storybookIsRunning = false

test.beforeAll(async () => {
  try {
    const response = await fetch(STORYBOOK_BASE, {
      signal: AbortSignal.timeout(5000),
    })
    storybookIsRunning = response.status < 500
  } catch {
    storybookIsRunning = false
  }
})

test.beforeEach(async ({ page }) => {
  test.skip(
    !storybookIsRunning,
    `Storybook is not reachable at ${STORYBOOK_BASE} — start it with ` +
      '`npm run storybook` to run this suite.',
  )

  await page.addInitScript(() => {
    class FakeMediaRecorder {
      state = 'inactive'
      mimeType = 'audio/webm'
      ondataavailable: ((e: { data: Blob }) => void) | null = null
      onerror: ((e: unknown) => void) | null = null
      onstop: (() => void) | null = null

      start() {
        this.state = 'recording'
        queueMicrotask(() => {
          this.ondataavailable?.({
            data: new Blob(['voice'], { type: 'audio/webm' }),
          })
        })
      }

      stop() {
        this.state = 'inactive'
        this.onstop?.()
      }

      static isTypeSupported() {
        return true
      }
    }

    Object.defineProperty(window, 'MediaRecorder', {
      configurable: true,
      writable: true,
      value: FakeMediaRecorder,
    })

    const audioCtx = new AudioContext()
    const destination = audioCtx.createMediaStreamDestination()
    navigator.mediaDevices.getUserMedia = () =>
      Promise.resolve(destination.stream)
  })

  await page.goto(chatStoryUrl())
  await expect(page.getByRole('heading', { name: 'AI-чат' })).toBeVisible({
    timeout: 15_000,
  })

  await page.getByText('Ментор').click()
  await expect(page.getByPlaceholder('Cообщение...')).toBeVisible()
})

const attachFile = async (page: Page, filePath: string) => {
  await page.locator('input[type="file"]').setInputFiles(filePath)
}

test.describe('Chat input (Storybook)', () => {
  test('sends a text message', async ({ page }) => {
    const input = page.getByPlaceholder('Cообщение...')
    await input.fill('Привет из e2e')
    await input.press('Enter')

    await expect(page.getByText('Привет из e2e')).toBeVisible()
  })

  test('attaches an image message', async ({ page }) => {
    await attachFile(page, path.join(MEDIA, 'sample-image.jpg'))

    await expect(page.locator('img[src^="blob:"]').last()).toBeVisible()
  })

  test('attaches a video message', async ({ page }) => {
    await attachFile(page, path.join(MEDIA, 'sample-video.mp4'))

    await expect(page.locator('video[src^="blob:"]').last()).toBeVisible()
  })

  test('attaches an audio file message', async ({ page }) => {
    await attachFile(page, path.join(MEDIA, 'sample-audio.mp3'))

    await expect(
      page.getByText('Audio unavailable').or(page.getByText(/^\d+:\d{2}$/)),
    ).toBeVisible({ timeout: 10_000 })
  })

  test('attaches a generic file message', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles({
      name: 'notes.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 e2e'),
    })

    await expect(page.getByText('notes.pdf')).toBeVisible()
  })

  test('records and sends a voice message', async ({ page }) => {
    // Empty state: attach + microphone; mic is the last button.
    await page.getByRole('button').last().click()

    // Recording UI: cancel + send (arrow-up). Send is last.
    await expect(page.getByText('0:00')).toBeVisible()
    await page.getByRole('button').last().click()

    await expect(page.getByPlaceholder('Cообщение...')).toBeVisible()
    // Fake blob often fails WaveSurfer — either waveform duration or fallback.
    await expect(
      page.getByText('Audio unavailable').or(page.getByText(/^\d+:\d{2}$/)),
    ).toBeVisible({ timeout: 10_000 })
  })
})
