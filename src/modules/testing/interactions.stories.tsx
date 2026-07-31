import type { Meta, StoryObj } from '@storybook/react-vite'

import { TestSuiteRunner } from './ui/test-suite-runner'

const meta = {
  title: 'Testing/В окне задачи',
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
      suite="interactions"
      label="Проверки в окне задачи (integration)"
      purpose="Сценарии в Storybook: все варианты раскладки, реальные задачи класса или полный прогон. Можно выбрать класс и шаблон."
    />
  ),
}
