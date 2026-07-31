import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  normalizeAllTasksFile,
  renderAllTasksStory,
  type AllTasksFile,
  type ColumnOperationStoryMetaArgs,
  makePlayAllTasksSmoke,
} from '../../lib/storybook'

import allTasksJson from './data/all-tasks.json'

import { ColumnOperationPlain as Template } from '.'

const ROOT_TITLE = 'Templates/ColumnOperation/plain'

const allTasks = normalizeAllTasksFile(allTasksJson as unknown as AllTasksFile)

const meta = {
  title: 'Templates/ColumnOperation/plain/Tasks',
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
} satisfies Meta<ColumnOperationStoryMetaArgs>

export default meta
type Story = StoryObj<ColumnOperationStoryMetaArgs>

export const All: Story = {
  play: makePlayAllTasksSmoke(),
  render: ({ grade }) =>
    renderAllTasksStory({
      Template,
      tasks: allTasksJson as unknown as AllTasksFile,
      grade: grade ?? allTasks.defaultGrade,
      rootTitle: ROOT_TITLE,
    }),
}
