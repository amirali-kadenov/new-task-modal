import { composeStories } from '@storybook/react-vite'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as stories from './chat-input.stories'

const start = vi.fn()
const stop = vi.fn()
const cancel = vi.fn()
const getAnalyser = vi.fn(() => null)

vi.mock('./audio/media-recorder-wrapper', () => ({
  MediaRecorderWrapper: class {
    start = start
    stop = stop
    cancel = cancel
    getAnalyser = getAnalyser
  },
}))

const { Default } = composeStories(stories)

const renderInput = (
  overrides: Partial<{
    onSend: ReturnType<typeof vi.fn>
    onAddMessage: ReturnType<typeof vi.fn>
  }> = {},
) => {
  const onSend = overrides.onSend ?? vi.fn()
  const onAddMessage = overrides.onAddMessage ?? vi.fn()
  const view = render(<Default onSend={onSend} onAddMessage={onAddMessage} />)
  return { ...view, onSend, onAddMessage }
}

beforeEach(() => {
  vi.clearAllMocks()
  start.mockResolvedValue(undefined)
  stop.mockResolvedValue({ blob: new Blob(['voice']), duration: 3 })
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
})

describe('ChatInput', () => {
  it('shows text field, attach, and microphone when empty', () => {
    const { container } = renderInput()

    expect(screen.getByPlaceholderText('Cообщение...')).toBeInTheDocument()
    expect(container.querySelector('input[type="file"]')).toBeTruthy()
    // attach + microphone
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('sends text via button and clears the field', () => {
    const { onSend } = renderInput()
    const input = screen.getByPlaceholderText('Cообщение...')

    fireEvent.change(input, { target: { value: '  привет  ' } })
    // last button is send (first is file attach)
    fireEvent.click(screen.getAllByRole('button').at(-1)!)

    expect(onSend).toHaveBeenCalledWith('привет')
    expect(input).toHaveValue('')
  })

  it('sends text on Enter', () => {
    const { onSend } = renderInput()
    const input = screen.getByPlaceholderText('Cообщение...')

    fireEvent.change(input, { target: { value: 'вопрос' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSend).toHaveBeenCalledWith('вопрос')
  })

  it('does not send empty or whitespace-only text', () => {
    const { onSend } = renderInput()
    const input = screen.getByPlaceholderText('Cообщение...')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSend).not.toHaveBeenCalled()
  })

  it.each([
    ['photo.png', 'image'],
    ['clip.mp4', 'video'],
    ['doc.pdf', 'file'],
  ] as const)('attaches %s as %s message', async (name, type) => {
    const { onAddMessage, container } = renderInput()
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    const file = new File(['data'], name, { type: 'application/octet-stream' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(onAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type,
          fileName: name,
          fileUrl: 'blob:mock',
        }),
      )
    })
  })

  it('attaches voice.mp3 as audio message', async () => {
    const { onAddMessage, container } = renderInput()
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(['data'], 'voice.mp3', { type: 'application/octet-stream' }),
        ],
      },
    })

    await waitFor(() => {
      expect(onAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'audio',
          audioUrl: 'blob:mock',
          duration: 0,
        }),
      )
    })
  })

  it('records voice and adds an audio message', async () => {
    const { onAddMessage } = renderInput()

    // empty state → microphone button is the only visible icon button next to input
    const mic = screen.getAllByRole('button').at(-1)!
    fireEvent.click(mic)

    await waitFor(() => expect(start).toHaveBeenCalled())

    // recording UI: cancel + send; send is ArrowUp (last button)
    const sendVoice = screen.getAllByRole('button').at(-1)!
    fireEvent.click(sendVoice)

    await waitFor(() => {
      expect(stop).toHaveBeenCalled()
      expect(onAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'audio',
          duration: 3,
          audioUrl: 'blob:mock',
        }),
      )
    })
  })

  it('cancels voice recording without adding a message', async () => {
    const { onAddMessage } = renderInput()

    fireEvent.click(screen.getAllByRole('button').at(-1)!)
    await waitFor(() => expect(start).toHaveBeenCalled())

    fireEvent.click(screen.getAllByRole('button')[0]!)

    expect(cancel).toHaveBeenCalled()
    expect(onAddMessage).not.toHaveBeenCalled()
    expect(screen.getByPlaceholderText('Cообщение...')).toBeInTheDocument()
  })
})
