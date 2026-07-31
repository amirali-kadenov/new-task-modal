import type { Meta, StoryObj } from '@storybook/react-vite'

import { TestSuiteRunner } from './ui/test-suite-runner'

const meta = {
  title: 'Testing/Данные и логика',
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
  render: () => (
    <TestSuiteRunner
      suite="unit"
      label="Данные и логика (unit)"
      purpose="Без браузера: данные и логика задания. Можно ограничить класс и конкретный шаблон."
    />
  ),
}
