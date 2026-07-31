import type { Meta, StoryObj } from '@storybook/react-vite'

import { FlexRow } from './flex-row'

const meta = {
  title: 'UI/FlexRow',
  component: FlexRow,
  parameters: {
    docs: {
      description: {
        component:
          'Горизонтальный flex-ряд (`align-items: center`). Базовый layout-примитив.',
      },
    },
  },
} satisfies Meta<typeof FlexRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <span>Слева</span>
        <span>Центр</span>
        <span>Справа</span>
      </>
    ),
  },
}

export const WithGap: Story = {
  name: 'With gap',
  args: {
    style: { gap: 16 },
    children: (
      <>
        <span>A</span>
        <span>B</span>
        <span>C</span>
        <span>D</span>
      </>
    ),
  },
}

export const SpaceBetween: Story = {
  name: 'Space between',
  args: {
    style: { justifyContent: 'space-between', width: '100%', maxWidth: 360 },
    children: (
      <>
        <span>Слева</span>
        <span>Справа</span>
      </>
    ),
  },
}

export const ManyItems: Story = {
  name: 'Many items',
  args: {
    style: { gap: 8, flexWrap: 'wrap' },
    children: (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            style={{
              padding: '4px 8px',
              background: 'var(--bg-subtle)',
              borderRadius: 8,
            }}
          >
            Item {i + 1}
          </span>
        ))}
      </>
    ),
  },
}
