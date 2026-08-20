import type { Meta, StoryObj } from '@storybook/react-vite'

import { TestSuiteRunner } from './ui/test-suite-runner'

const meta = {
  title: 'Testing/Скриншотные проверки',
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
      suite="visual"
      label="Скриншотные проверки (visual)"
      purpose="Сравнивает PNG эталоны Default и WithSolution для всех Groups и Tasks в Storybook (Playwright). Полный каталог тяжёлый (~3k снимков) — сужайте шаблоном/классом/задачей. Нужен Storybook на порту 6006. После зелёного прогона по выбранному шаблону — метка «авто»; «просмотрено» — вручную."
      probeUrl="http://localhost:6006/"
      hintWhenUnreachable="Storybook не отвечает на http://localhost:6006 — запустите `pnpm storybook` перед проверкой"
    />
  ),
}
