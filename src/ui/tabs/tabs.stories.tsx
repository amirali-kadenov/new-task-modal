import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs } from './tabs'

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Вкладки с заголовком и опциональным subtitle. Контент панели — render-функция.',
      },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      {
        title: 'Решение',
        subtitle: 'текст',
        content: () => <div style={{ padding: 16 }}>Контент решения</div>,
      },
      {
        title: 'Видео',
        subtitle: '2:30',
        content: () => <div style={{ padding: 16 }}>Контент видео</div>,
      },
    ],
  },
}

export const TitlesOnly: Story = {
  name: 'Titles only',
  args: {
    tabs: [
      {
        title: 'AI-чат',
        content: () => <div style={{ padding: 16 }}>AI</div>,
      },
      {
        title: 'Ментор',
        content: () => <div style={{ padding: 16 }}>Ментор</div>,
      },
    ],
  },
}

export const ThreeTabs: Story = {
  name: 'Three tabs',
  args: {
    tabs: [
      {
        title: 'Теория',
        subtitle: '1',
        content: () => <div style={{ padding: 16 }}>Теория</div>,
      },
      {
        title: 'Практика',
        subtitle: '2',
        content: () => <div style={{ padding: 16 }}>Практика</div>,
      },
      {
        title: 'Тест',
        subtitle: '3',
        content: () => <div style={{ padding: 16 }}>Тест</div>,
      },
    ],
  },
}

export const SingleTab: Story = {
  name: 'Single tab',
  args: {
    tabs: [
      {
        title: 'Одна вкладка',
        content: () => <div style={{ padding: 16 }}>Единственная панель</div>,
      },
    ],
  },
}
