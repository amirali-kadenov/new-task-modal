import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { runPlayStep } from '@/testing/play-step'
import { withTrackedPlay } from '@/testing/with-tracked-play'

import { HeartDecreaseAnimation } from './heart-decrease-animation'

const PLAY_CASES = [
  { id: 'img', label: 'Renders animated webp' },
] as const

const meta = {
  title: 'Trainer/Lives/HeartDecreaseAnimation',
  component: HeartDecreaseAnimation,
  parameters: {
    docs: {
      description: {
        component:
          'WebP-анимация потери жизни в шапке модалки. Кадр зависит от `livesCount` (макс. жизней) и `attemptsCount` (номер текущей ошибки).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '40px 24px',
          overflow: 'visible',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 80,
          background: 'var(--bg-subtle, #f5f5f5)',
          borderRadius: 12,
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    livesCount: 3,
    attemptsCount: 1,
  },
} satisfies Meta<typeof HeartDecreaseAnimation>

export default meta
type Story = StoryObj<typeof meta>

/** 3 → 2 (первая ошибка при 3 жизнях) */
export const ThreeToTwo: Story = {
  name: '3 → 2',
  parameters: {
    playCases: [...PLAY_CASES],
  },
  args: {
    livesCount: 3,
    attemptsCount: 1,
  },
  play: withTrackedPlay([...PLAY_CASES], async ({ canvasElement }) => {
    await runPlayStep('img', 'Renders animated webp', async () => {
      const img = canvasElement.querySelector('img')
      await expect(img).toBeTruthy()
      await expect(img?.getAttribute('src') ?? '').toMatch(/3-to-2/)
    })
  }),
}

/** 2 → 1 */
export const TwoToOne: Story = {
  name: '2 → 1',
  args: {
    livesCount: 3,
    attemptsCount: 2,
  },
}

/** 1 → 0 */
export const OneToZero: Story = {
  name: '1 → 0',
  args: {
    livesCount: 3,
    attemptsCount: 3,
  },
}

/** Штрафная задача с 2 жизнями: первая ошибка → 2→1 */
export const PenaltyTwoLives: Story = {
  name: 'Penalty (2 lives) → 2→1',
  args: {
    livesCount: 2,
    attemptsCount: 1,
  },
}

/** Штрафная задача с 1 жизнью: единственная ошибка → 1→0 */
export const PenaltyOneLife: Story = {
  name: 'Penalty (1 life) → 1→0',
  args: {
    livesCount: 1,
    attemptsCount: 1,
  },
}

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 32,
        alignItems: 'flex-end',
        flexWrap: 'wrap',
      }}
    >
      {(
        [
          ['3→2', 3, 1],
          ['2→1', 3, 2],
          ['1→0', 3, 3],
        ] as const
      ).map(([label, livesCount, attemptsCount]) => (
        <div
          key={label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <HeartDecreaseAnimation
            livesCount={livesCount}
            attemptsCount={attemptsCount}
          />
          <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span>
        </div>
      ))}
    </div>
  ),
}
