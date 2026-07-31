import type { Meta, StoryObj } from '@storybook/react-vite'

import { TestingOverview } from '@/docs/TestingOverview'

const meta = {
  title: 'Testing/Overview',
  tags: ['!test', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
    noPadding: false,
    controls: { disable: true },
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <TestingOverview />,
}
