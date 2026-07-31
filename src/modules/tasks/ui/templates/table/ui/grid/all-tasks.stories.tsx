import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  normalizeAllTasksFile,
  renderAllTasksStory,
  type AllTasksFile,
  type TableStoryMetaArgs,
  makePlayAllTasksSmoke,
} from '../../lib/storybook'

import allTasksJson from './data/all-tasks.json'

import { TableGrid as Template } from '.'

const ROOT_TITLE = 'Templates/Table/grid'

const allTasks = normalizeAllTasksFile(allTasksJson)

const meta = {
  title: 'Templates/Table/grid/Tasks',
  component: Template,
  args: {
    grade: allTasks.defaultGrade,
  },
  argTypes: {
    grade: {
      control: 'select',
      options: allTasks.grades,
      description: 'Класс (grade) для списка задач в Tasks',
    },
  },
  parameters: {
    skipRunPlayButton: true,
  },
} satisfies Meta<TableStoryMetaArgs>

export default meta
type Story = StoryObj<TableStoryMetaArgs>

export const All: Story = {
  play: makePlayAllTasksSmoke(),
  render: ({ grade }) =>
    renderAllTasksStory({
      Template,
      tasks: allTasksJson,
      grade: grade ?? allTasks.defaultGrade,
      rootTitle: ROOT_TITLE,
    }),
}
