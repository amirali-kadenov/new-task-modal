import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  HIDDEN_TASK_ARGTYPES,
  STORY_DOCS,
  storyDocs,
  templateDocs,
} from '../../../shared/storybook/story-docs'
import {
  getGroupControlOptions,
  renderDefaultStory,
  renderWithSolutionStory,
  type TemplateGroupFixture,
  type TestStoryMetaArgs,
  getOpenInTrainerControls,
  normalizeAllTasksFile,
  type AllTasksFile,
} from '../../lib/storybook'
import type { TestTask } from '../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import groupsJson from './data/groups.json'
import fixture from './data/task.json'
import readme from './README.md?raw'

import { TestPlain as Template } from '.'

const task = fixture as unknown as TestTask
const groups = groupsJson as unknown as TemplateGroupFixture[]
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const allTasks = allTasksJson as unknown as AllTasksFile
const normalizedTasks = normalizeAllTasksFile(allTasks)
const openInTrainer = getOpenInTrainerControls(groups)

const ROOT_TITLE = 'Templates/Test/plain'

const meta = {
  title: 'Templates/Test/plain',
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
        'Structural group из data/groups.json (`all` — все в AllGroups)',
    },
    taskId: {
      control: 'select',
      options: openInTrainer.allTaskIds,
      description: 'Конкретная задача (id) из all-tasks.json',
    },
  },
  parameters: templateDocs(readme),
} satisfies Meta<TestStoryMetaArgs>

export default meta
type Story = StoryObj<TestStoryMetaArgs>

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
