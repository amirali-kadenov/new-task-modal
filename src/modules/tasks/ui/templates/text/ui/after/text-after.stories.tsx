import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  HIDDEN_TASK_ARGTYPES,
  STORY_DOCS,
  storyDocs,
  templateDocs,
} from '../../../shared/storybook/story-docs'
import {
  getGroupControlOptions,
  getOpenInTrainerControls,
  normalizeAllTasksFile,
  renderDefaultStory,
  renderWithSolutionStory,
  type AllTasksFile,
  type TemplateGroupFixture,
  type TextTemplateStoryMetaArgs,
} from '../../lib/storybook'
import type { TextTask } from '../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import groupsJson from './data/groups.json'
import fixture from './data/task.json'
import readme from './README.md?raw'

import { TextAfter as Template } from '.'

const task = fixture as unknown as TextTask
const groups = groupsJson as unknown as TemplateGroupFixture[]
const allTasks = allTasksJson as unknown as AllTasksFile
const normalizedTasks = normalizeAllTasksFile(allTasks)
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const openInTrainer = getOpenInTrainerControls(groups)

const ROOT_TITLE = 'Templates/Text/after'

const meta = {
  title: 'Templates/Text/after',
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
} satisfies Meta<TextTemplateStoryMetaArgs>

export default meta
type Story = StoryObj<TextTemplateStoryMetaArgs>

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
