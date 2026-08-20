import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  normalizeAllTasksFile,
  renderAllTasksStory,
  type AllTasksFile,
  type TextTemplateStoryMetaArgs,
  makePlayAllTasksSmoke,
} from '../../../lib/storybook'

import allTasksJson from './data/all-tasks.json'

import { TextMultiStackN2After as Template } from '.'

const ROOT_TITLE = 'Templates/Text/multi/stack-n2-after'

const allTasks = normalizeAllTasksFile(allTasksJson as unknown as AllTasksFile)

const meta = {
  title: 'Templates/Text/multi/stack-n2-after/Tasks',
  tags: ['!autodocs'],
  component: Template,
  args: {
    grade: allTasks.defaultGrade,
    taskId: '',
  },
  argTypes: {
    grade: {
      control: 'select',
      options: allTasks.grades,
      description: 'Класс (grade) для списка задач в Tasks',
    },
    taskId: {
      control: 'text',
      description: 'Опционально: одна задача (пусто = все)',
    },
  },
  parameters: {
    skipRunPlayButton: true,
  },
} satisfies Meta<TextTemplateStoryMetaArgs>

export default meta
type Story = StoryObj<TextTemplateStoryMetaArgs>

export const All: Story = {
  play: makePlayAllTasksSmoke(),
  render: ({ grade, taskId }) =>
    renderAllTasksStory({
      Template,
      tasks: allTasksJson as unknown as AllTasksFile,
      grade: grade ?? allTasks.defaultGrade,
      taskId,
      rootTitle: ROOT_TITLE,
    }),
}
