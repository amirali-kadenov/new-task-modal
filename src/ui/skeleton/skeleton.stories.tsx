import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from './skeleton'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'Плейсхолдер-шиммер. Размер задаётся через `style` или `className` потребителем.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    style: { width: 200, height: 24 },
  },
}

export const Circle: Story = {
  args: {
    style: { width: 40, height: 40, borderRadius: '50%' },
  },
}

export const Block: Story = {
  args: {
    style: { width: '100%', maxWidth: 320, height: 120, borderRadius: 12 },
  },
}

export const TextLines: Story = {
  name: 'Text lines',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 280,
      }}
    >
      <Skeleton style={{ width: '100%', height: 16 }} />
      <Skeleton style={{ width: '90%', height: 16 }} />
      <Skeleton style={{ width: '60%', height: 16 }} />
    </div>
  ),
}
