import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  normalizeAllTasksFile,
  renderAllTasksStory,
  type AllTasksFile,
  type TestStoryMetaArgs,
  makePlayAllTasksSmoke,
} from '../../lib/storybook'

import allTasksJson from './data/all-tasks.json'

import { TestPlain as Template } from '.'

const ROOT_TITLE = 'Templates/Test/plain'

const allTasks = normalizeAllTasksFile(allTasksJson)

const meta = {
  title: 'Templates/Test/plain/Tasks',
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
} satisfies Meta<TestStoryMetaArgs>

export default meta
type Story = StoryObj<TestStoryMetaArgs>

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
