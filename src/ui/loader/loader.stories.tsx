import type { Meta, StoryObj } from '@storybook/react-vite'

import { Loader } from './loader'

const meta = {
  title: 'UI/Loader',
  component: Loader,
  parameters: {
    docs: {
      description: {
        component:
          'Спиннер загрузки. Варианты `white` / `black` для контраста на тёмном и светлом фоне.',
      },
    },
  },
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const White: Story = {
  args: {
    variant: 'white',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#1d1b20' }}>
        <Story />
      </div>
    ),
  ],
}

export const Black: Story = {
  args: {
    variant: 'black',
  },
}

export const Large: Story = {
  args: {
    width: 48,
    height: 48,
    variant: 'black',
  },
}

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Loader />
      <Loader variant="black" />
      <div style={{ padding: 12, background: '#1d1b20', borderRadius: 8 }}>
        <Loader variant="white" />
      </div>
    </div>
  ),
}
