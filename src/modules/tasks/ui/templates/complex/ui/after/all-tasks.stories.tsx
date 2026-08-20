import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  normalizeAllTasksFile,
  renderAllTasksStory,
  type ComplexStoryMetaArgs,
  makePlayAllTasksSmoke,
} from '../../lib/storybook'

import allTasksJson from './data/all-tasks.json'

import { ComplexAfter as Template } from '.'

const ROOT_TITLE = 'Templates/Complex/after'

const allTasks = normalizeAllTasksFile(allTasksJson)

const meta = {
  title: 'Templates/Complex/after/Tasks',
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
} satisfies Meta<ComplexStoryMetaArgs>

export default meta
type Story = StoryObj<ComplexStoryMetaArgs>

export const All: Story = {
  play: makePlayAllTasksSmoke(),
  render: ({ grade, taskId }) =>
    renderAllTasksStory({
      Template,
      tasks: allTasksJson,
      grade: grade ?? allTasks.defaultGrade,
      taskId,
      rootTitle: ROOT_TITLE,
    }),
}
