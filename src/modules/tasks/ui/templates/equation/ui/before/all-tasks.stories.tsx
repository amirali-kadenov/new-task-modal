import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  normalizeAllTasksFile,
  renderAllTasksStory,
  type AllTasksFile,
  type EquationStoryMetaArgs,
  makePlayAllTasksSmoke,
} from '../../shared/lib/storybook'

import allTasksJson from './data/all-tasks.json'

import { EquationBefore as Template } from '.'

const ROOT_TITLE = 'Templates/Equation/before'

const allTasks = normalizeAllTasksFile(allTasksJson as unknown as AllTasksFile)

const meta = {
  title: 'Templates/Equation/before/Tasks',
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
} satisfies Meta<EquationStoryMetaArgs>

export default meta
type Story = StoryObj<EquationStoryMetaArgs>

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
