import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { runPlayStep } from '@/testing/play-step'
import { withTrackedPlay } from '@/testing/with-tracked-play'

import '@/styles/_index.scss'
import { Slider } from './slider'

const PLAY_CASES = [
  { id: 'dots', label: 'Three pagination dots' },
  { id: 'navigate', label: 'Click last dot' },
] as const

const meta = {
  component: Slider,
  title: 'UI/Slider',
  parameters: {
    playCases: [...PLAY_CASES],
    docs: {
      description: {
        component:
          'Карусель на keen-slider с пагинацией точками. Подходит для слайдов с произвольным контентом.',
      },
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

const slideStyle = {
  padding: 24,
  textAlign: 'center' as const,
  background: 'var(--bg-subtle)',
  borderRadius: 12,
}

export const Default: Story = {
  args: {
    slides: [
      <div key={0} style={slideStyle}>
        Slide 1
      </div>,
      <div key={1} style={slideStyle}>
        Slide 2
      </div>,
      <div key={2} style={slideStyle}>
        Slide 3
      </div>,
    ],
  },
  play: withTrackedPlay([...PLAY_CASES], async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    let dots: HTMLElement[]

    await runPlayStep('dots', 'Three pagination dots', async () => {
      dots = canvas.getAllByRole('button')
      await expect(dots).toHaveLength(3)
    })

    await runPlayStep('navigate', 'Click last dot', async () => {
      await userEvent.click(dots![2])
      await expect(dots![2]).toBeInTheDocument()
    })
  }),
}

export const SingleSlide: Story = {
  name: 'Single slide',
  args: {
    slides: [
      <div key={0} style={slideStyle}>
        Один слайд — пагинация скрыта
      </div>,
    ],
  },
}

export const ManySlides: Story = {
  name: 'Many slides',
  args: {
    slides: Array.from({ length: 6 }, (_, i) => (
      <div key={i} style={slideStyle}>
        Slide {i + 1}
      </div>
    )),
  },
}
