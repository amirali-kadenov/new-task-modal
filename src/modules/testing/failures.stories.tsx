import type { Meta, StoryObj } from '@storybook/react-vite'

import { TestFailuresPanel } from './ui/test-failures-panel'

const meta = {
  title: 'Testing/Падения',
  tags: ['!test', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
    noPadding: true,
    controls: { disable: true },
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <TestFailuresPanel />,
}
