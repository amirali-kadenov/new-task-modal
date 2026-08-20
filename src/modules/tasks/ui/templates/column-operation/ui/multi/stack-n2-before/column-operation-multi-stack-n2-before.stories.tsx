import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  HIDDEN_TASK_ARGTYPES,
  STORY_DOCS,
  storyDocs,
  templateDocs,
} from '../../../../shared/storybook/story-docs'
import {
  getGroupControlOptions,
  pickOperationFixture,
  renderAllOperationsStory,
  renderDefaultStory,
  renderOperationStory,
  renderWithSolutionStory,
  type ColumnOperationStoryMetaArgs,
  type OperationFixture,
  type TemplateGroupFixture,
  getOpenInTrainerControls,
  normalizeAllTasksFile,
  type AllTasksFile,
} from '../../../lib/storybook'
import type { ColumnOperationTask } from '../../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import groupsJson from './data/groups.json'
import operationsJson from './data/operations.json'
import fixture from './data/task.json'
import readme from './README.md?raw'

import { ColumnOperationMultiStackN2Before as Template } from '.'

const task = fixture as unknown as ColumnOperationTask
const groups = groupsJson as unknown as TemplateGroupFixture[]
const operations = operationsJson as unknown as OperationFixture[]
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const allTasks = allTasksJson as unknown as AllTasksFile
const normalizedTasks = normalizeAllTasksFile(allTasks)
const openInTrainer = getOpenInTrainerControls(groups)

const ROOT_TITLE = 'Templates/ColumnOperation/multi/stack-n2-before'

const meta = {
  title: 'Templates/ColumnOperation/multi/stack-n2-before',
  component: Template,
  args: {
    group: defaultGroup,
    taskId: openInTrainer.defaultTaskId,
  },
  argTypes: {
    ...HIDDEN_TASK_ARGTYPES,
    group: {
      control: 'select',
      options: groupIds,
      description:
        'Операция из data/groups.json: plus / minus / times / div (`all` — все в AllGroups)',
    },
    taskId: {
      control: 'select',
      options: openInTrainer.allTaskIds,
      description: 'Конкретная задача (id) из all-tasks.json',
    },
  },
  parameters: templateDocs(readme),
} satisfies Meta<ColumnOperationStoryMetaArgs>

export default meta
type Story = StoryObj<ColumnOperationStoryMetaArgs>

export const Default: Story = {
  parameters: storyDocs(STORY_DOCS.default),
  render: ({ group, taskId }) =>
    renderDefaultStory({
      Template,
      groups,
      fallbackTask: task,
      group,
      taskId,
      allTasks,
      grade: normalizedTasks.defaultGrade,
      rootTitle: ROOT_TITLE,
    }),
}

export const WithSolution: Story = {
  parameters: storyDocs(STORY_DOCS.withSolution),
  render: ({ group, taskId }) =>
    renderWithSolutionStory({
      Template,
      groups,
      fallbackTask: task,
      group,
      taskId,
      allTasks,
      grade: normalizedTasks.defaultGrade,
      rootTitle: ROOT_TITLE,
    }),
}

/** Multi covers only division (частное / остаток). */
export const Division: Story = {
  render: () =>
    renderOperationStory({
      Template,
      fixture: pickOperationFixture(operations, 'div'),
    }),
}

export const AllOperations: Story = {
  render: () => renderAllOperationsStory({ Template, fixtures: operations }),
}
