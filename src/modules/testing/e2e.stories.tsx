import type { Meta, StoryObj } from '@storybook/react-vite'

import { TestSuiteRunner } from './ui/test-suite-runner'

const meta = {
  title: 'Testing/В живом приложении',
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
      suite="e2e"
      label="Проверки в живом приложении (e2e)"
      purpose="Настоящее приложение на порту 8888. При ошибке — снимки, запись и лог. «Показать окно браузера» открывает видимое окно."
      probeUrl="http://localhost:8888/"
      hintWhenUnreachable="Живое приложение не отвечает на http://localhost:8888 — запустите его перед проверкой"
    />
  ),
}
