import type { Meta, StoryObj } from '@storybook/react-vite'

import { AllSuitesRunner } from './ui/all-suites-runner'

const meta = {
  title: 'Testing/Запуск',
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
  render: () => <AllSuitesRunner />,
}
