import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  normalizeAllTasksFile,
  renderAllTasksStory,
  type ComparisonStoryMetaArgs,
  makePlayAllTasksSmoke,
} from '../../lib/storybook'

import allTasksJson from './data/all-tasks.json'

import { ComparisonPlain as Template } from '.'

const ROOT_TITLE = 'Templates/Comparison/plain'

const allTasks = normalizeAllTasksFile(allTasksJson)

const meta = {
  title: 'Templates/Comparison/plain/Tasks',
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
} satisfies Meta<ComparisonStoryMetaArgs>

export default meta
type Story = StoryObj<ComparisonStoryMetaArgs>

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
