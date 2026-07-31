import type { Meta, StoryObj } from '@storybook/react-vite'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import { TopBar } from './top-bar'

const deps = {
  helpers: {
    ArabicNumeralUtils: {
      isArabic: () => false,
      getDirection: () => 'ltr',
    },
  },
} as TaskModalDependencies

const depsRtl = {
  helpers: {
    ArabicNumeralUtils: {
      isArabic: () => true,
      getDirection: () => 'rtl',
    },
  },
} as TaskModalDependencies

const meta = {
  title: 'UI/TopBar',
  component: TopBar,
  parameters: {
    docs: {
      description: {
        component:
          'Шапка модалки: заголовок, закрытие и опциональная кнопка «назад». Направление текста зависит от deps (LTR/RTL).',
      },
    },
  },
  args: {
    deps,
    onClose: () => undefined,
    children: 'Задача №1/5',
  },
} satisfies Meta<typeof TopBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBack: Story = {
  args: {
    onGoBack: () => undefined,
  },
}

export const LongTitle: Story = {
  name: 'Long title',
  args: {
    children: 'Очень длинное название задачи про многозначные числа №12/30',
    onGoBack: () => undefined,
  },
}

export const Rtl: Story = {
  name: 'RTL',
  args: {
    deps: depsRtl,
    children: 'المهمة رقم 1/5',
    onGoBack: () => undefined,
  },
}
