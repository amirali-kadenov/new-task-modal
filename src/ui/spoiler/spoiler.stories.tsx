import type { Meta, StoryObj } from '@storybook/react-vite'

import { SpoilerText } from './spoiler'

const meta = {
  title: 'UI/Spoiler',
  component: SpoilerText,
  parameters: {
    docs: {
      description: {
        component:
          'Спойлер: текст скрыт до клика. Используется для ответов и подсказок.',
      },
    },
  },
} satisfies Meta<typeof SpoilerText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Скрытый ответ: 42',
  },
}

export const LongText: Story = {
  name: 'Long text',
  args: {
    children:
      'Длинный скрытый ответ: сначала разложите выражение, затем приведите подобные и получите 126.',
  },
}

export const Formula: Story = {
  args: {
    children: 'Верный ответ: x = 7',
  },
}
