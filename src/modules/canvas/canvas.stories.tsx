import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { StoryPhoneFrame } from '@/lib/storybook/story-phone-frame'
import { runPlayStep } from '@/testing/play-step'
import { withTrackedPlay } from '@/testing/with-tracked-play'

import { Canvas } from './canvas'

const STORAGE_KEY = 'drawing-board-data'

const PLAY_CASES = [
  { id: 'toolbar', label: 'Toolbar visible' },
  { id: 'modes', label: 'Toggle erase / draw' },
  { id: 'strokeUndo', label: 'Stroke then undo' },
  { id: 'clear', label: 'Clear board' },
  { id: 'close', label: 'Close calls onClose' },
] as const

const meta = {
  title: 'Canvas/Canvas',
  component: Canvas,
  parameters: {
    layout: 'fullscreen',
    noPadding: true,
    playCases: [...PLAY_CASES],
    docs: {
      description: {
        component:
          'Доска для рисования: режимы draw/erase, история undo/redo, очистка, сохранение в `localStorage` (`drawing-board-data`) и закрытие через `onClose`.',
      },
    },
  },
  args: {
    onClose: fn(),
  },
  decorators: [
    (Story) => {
      window.localStorage.removeItem(STORAGE_KEY)
      return (
        <StoryPhoneFrame>
          <Story />
        </StoryPhoneFrame>
      )
    },
  ],
} satisfies Meta<typeof Canvas>

export default meta
type Story = StoryObj<typeof meta>

const drawStroke = (canvasEl: HTMLCanvasElement) => {
  const rect = canvasEl.getBoundingClientRect()
  const x1 = rect.left + rect.width * 0.3
  const y1 = rect.top + rect.height * 0.4
  const x2 = rect.left + rect.width * 0.6
  const y2 = rect.top + rect.height * 0.5

  canvasEl.dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, clientX: x1, clientY: y1 }),
  )
  canvasEl.dispatchEvent(
    new MouseEvent('mousemove', { bubbles: true, clientX: x2, clientY: y2 }),
  )
  canvasEl.dispatchEvent(
    new MouseEvent('mouseup', { bubbles: true, clientX: x2, clientY: y2 }),
  )
}

export const Default: Story = {
  play: withTrackedPlay([...PLAY_CASES], async ({ canvasElement, args }) => {
    window.localStorage.removeItem(STORAGE_KEY)

    const view = within(canvasElement)
    let drawBtn: HTMLElement
    let eraseBtn: HTMLElement
    let undoBtn: HTMLElement
    let redoBtn: HTMLElement
    let clearBtn: HTMLElement
    let closeBtn: HTMLElement
    let board: HTMLCanvasElement

    await runPlayStep('toolbar', 'Toolbar visible', async () => {
      drawBtn = await view.findByTitle('Рисовать')
      eraseBtn = view.getByTitle('Ластик')
      undoBtn = view.getByTitle('Назад')
      redoBtn = view.getByTitle('Вперед')
      clearBtn = view.getByTitle('Очистить всё')
      closeBtn = view.getByTitle('Закрыть доску')

      expect(drawBtn).toBeVisible()
      expect(eraseBtn).toBeVisible()
      expect(undoBtn).toBeDisabled()
      expect(redoBtn).toBeDisabled()
      expect(clearBtn).toBeVisible()
      expect(closeBtn).toBeVisible()
    })

    await runPlayStep('modes', 'Toggle erase / draw', async () => {
      await userEvent.click(eraseBtn!)
      expect(eraseBtn!.className).toMatch(/active/)
      await userEvent.click(drawBtn!)
      expect(drawBtn!.className).toMatch(/active/)
    })

    await runPlayStep('strokeUndo', 'Stroke then undo', async () => {
      board = canvasElement.querySelector('canvas') as HTMLCanvasElement
      expect(board).toBeTruthy()
      drawStroke(board)
      await waitFor(() => expect(undoBtn!).toBeEnabled())
      await userEvent.click(undoBtn!)
      await waitFor(() => expect(undoBtn!).toBeDisabled())
    })

    await runPlayStep('clear', 'Clear board', async () => {
      drawStroke(board!)
      await waitFor(() => expect(undoBtn!).toBeEnabled())
      await userEvent.click(clearBtn!)
      await waitFor(() => expect(undoBtn!).toBeEnabled())
    })

    await runPlayStep('close', 'Close calls onClose', async () => {
      await userEvent.click(closeBtn!)
      await expect(args.onClose).toHaveBeenCalled()
    })
  }),
}
