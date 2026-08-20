import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { runPlayStep } from '@/testing/play-step'
import { withTrackedPlay } from '@/testing/with-tracked-play'
import type { Global } from '@/types/global'

import { Calculator } from './calculator'
import { Keyboard } from './keyboard'
import { CALC_MODE } from './model/constants'
import { LETTERS } from './model/symbols/letters'
import { MAIN } from './model/symbols/main'

const MAIN_PLAY_CASES = [
  { id: 'keysVisible', label: 'Number keys visible' },
  { id: 'pressDigit', label: 'Press digit calls onKeyPress' },
] as const

const LETTERS_PLAY_CASES = [
  { id: 'keysVisible', label: 'Letter keys visible' },
  { id: 'pressLetter', label: 'Press letter calls onKeyPress' },
] as const

const FULL_PLAY_CASES = [
  { id: 'digitInput', label: 'Digit updates last input' },
] as const

const meta = {
  title: 'Trainer/Keyboard',
  component: Keyboard,
  parameters: {
    docs: {
      description: {
        component:
          'Клавиатура калькулятора тренажёра: цифры/операторы (main) и буквы (letters). В модале живёт внутри Calculator + Slider.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 375,
          margin: '0 auto',
          padding: '16px 0',
          background: 'var(--bg-subtle)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Keyboard>

export default meta
type Story = StoryObj<typeof meta>

export const Main: Story = {
  name: 'Main (numbers)',
  parameters: {
    playCases: [...MAIN_PLAY_CASES],
  },
  args: {
    mode: CALC_MODE.MAIN,
    keys: MAIN,
    onKeyPress: fn(),
  },
  play: withTrackedPlay(
    [...MAIN_PLAY_CASES],
    async ({ canvasElement, args }) => {
      const canvas = within(canvasElement)

      await runPlayStep('keysVisible', 'Number keys visible', async () => {
        await expect(
          canvasElement.querySelectorAll('[data-calc]').length,
        ).toBeGreaterThan(0)
        await expect(canvas.getByRole('button', { name: '7' })).toBeVisible()
        await expect(canvas.getByRole('button', { name: '0' })).toBeVisible()
      })

      await runPlayStep(
        'pressDigit',
        'Press digit calls onKeyPress',
        async () => {
          await userEvent.click(canvas.getByRole('button', { name: '5' }))
          await expect(args.onKeyPress).toHaveBeenCalledWith(
            expect.objectContaining({ title: '5', label: '5' }),
          )
        },
      )
    },
  ),
}

export const Letters: Story = {
  parameters: {
    playCases: [...LETTERS_PLAY_CASES],
  },
  args: {
    mode: CALC_MODE.LETTERS,
    keys: LETTERS,
    onKeyPress: fn(),
  },
  play: withTrackedPlay(
    [...LETTERS_PLAY_CASES],
    async ({ canvasElement, args }) => {
      const canvas = within(canvasElement)

      await runPlayStep('keysVisible', 'Letter keys visible', async () => {
        await expect(canvas.getByRole('button', { name: 'a' })).toBeVisible()
        await expect(canvas.getByRole('button', { name: 'x' })).toBeVisible()
      })

      await runPlayStep(
        'pressLetter',
        'Press letter calls onKeyPress',
        async () => {
          await userEvent.click(canvas.getByRole('button', { name: 'a' }))
          await expect(args.onKeyPress).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'a' }),
          )
        },
      )
    },
  ),
}

const storyGlobal = {
  translate: (key: string) => key,
} as Global

export const FullCalculator: Story = {
  name: 'Full calculator',
  args: {
    mode: CALC_MODE.MAIN,
    keys: MAIN,
    onKeyPress: fn(),
  },
  parameters: {
    playCases: [...FULL_PLAY_CASES],
    docs: {
      description: {
        story:
          'Полный калькулятор со слайдером: свайп между буквами и цифрами, shift для uppercase.',
      },
    },
  },
  render: function Render() {
    const [last, setLast] = useState('')
    return (
      <div>
        <Calculator global={storyGlobal} onInput={setLast} />
        <p
          style={{
            margin: '12px 16px 0',
            fontSize: 13,
            color: 'var(--text-secondary)',
          }}
        >
          last input: <code>{last || '—'}</code>
        </p>
      </div>
    )
  },
  play: withTrackedPlay([...FULL_PLAY_CASES], async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await runPlayStep('digitInput', 'Digit updates last input', async () => {
      // Slider order: Letters, then Main — switch to numbers via pagination.
      const dots = canvas.getAllByRole('button').filter((btn) => {
        return !btn.hasAttribute('data-calc')
      })
      await expect(dots.length).toBeGreaterThanOrEqual(2)
      await userEvent.click(dots[1])

      const five = await canvas.findByRole('button', { name: '5' })
      await userEvent.click(five)

      const lastCode = canvasElement.querySelector('code')
      await expect(lastCode).toBeTruthy()
      await expect(lastCode).toHaveTextContent('5')
      await expect(lastCode).not.toHaveTextContent('—')
    })
  }),
}
