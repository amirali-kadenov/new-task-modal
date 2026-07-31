import type { Meta, StoryObj } from '@storybook/react-vite'

import type { TemplateGroupFixture } from '@/modules/tasks/ui/templates/text/lib/storybook'
import { TrainerGlobalProgressChecklist } from '@/modules/tasks/ui/templates/text/lib/storybook/trainer-progress-checklist'

import { TRAINER_VARIANTS } from './lib/trainer-variants'

const variants = TRAINER_VARIANTS.map((v) => ({
  key: v.key,
  label: v.label,
  rootTitle: `Templates/${v.key}`,
  groups: v.groups as TemplateGroupFixture[],
}))

const meta = {
  title: 'Trainer/Check-list',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Глобальная сводка прогресса Checklist по всем шаблонам (localStorage).',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'Check-list',
  render: () => <TrainerGlobalProgressChecklist variants={variants} />,
}
