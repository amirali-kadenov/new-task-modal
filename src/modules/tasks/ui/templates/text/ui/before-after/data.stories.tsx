import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  getGroupControlOptions,
  getOpenInTrainerControls,
  normalizeAllTasksFile,
  renderDataAllGroupsStory,
  renderDataAllTasksStory,
  renderDataOneTaskStory,
  type AllTasksFile,
  type TemplateGroupFixture,
  type TextTemplateStoryMetaArgs,
} from '../../lib/storybook'
import type { TextTask as Task } from '../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import groupsJson from './data/groups.json'
import fixture from './data/task.json'

import { TextBeforeAfter as Template } from '.'

const task = fixture as unknown as Task
const groups = groupsJson as unknown as TemplateGroupFixture[]
const allTasks = normalizeAllTasksFile(allTasksJson as unknown as AllTasksFile)
const openInTrainer = getOpenInTrainerControls(groups)
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const ROOT_TITLE = 'Templates/Text/before-after'

const meta = {
  title: 'Templates/Text/before-after/Data',
  component: Template,
  args: {
    grade: allTasks.defaultGrade,
    group: defaultGroup,
    taskId: openInTrainer.defaultTaskId,
  },
  argTypes: {
    grade: {
      control: 'select',
      options: allTasks.grades,
      description: 'Класс (grade)',
    },
    group: {
      control: 'select',
      options: groupIds,
      description: 'Structural group',
    },
    taskId: {
      control: false,
      description: 'taskId — select в canvas',
    },
  },
} satisfies Meta<TextTemplateStoryMetaArgs>

export default meta
type Story = StoryObj<TextTemplateStoryMetaArgs>

export const OneTask: Story = {
  name: 'One Task',
  render: ({ grade, group, taskId }) =>
    renderDataOneTaskStory({
      rootTitle: ROOT_TITLE,
      groups,
      allTasks: allTasksJson as unknown as AllTasksFile,
      fallbackTask: task,
      grade: grade ?? allTasks.defaultGrade,
      group,
      taskId,
    }),
}

export const AllGroups: Story = {
  name: 'Groups',
  render: () =>
    renderDataAllGroupsStory({
      rootTitle: ROOT_TITLE,
      groups,
    }),
}

export const AllTasks: Story = {
  name: 'Tasks',
  render: ({ grade }) =>
    renderDataAllTasksStory({
      rootTitle: ROOT_TITLE,
      allTasks: allTasksJson as unknown as AllTasksFile,
      grade: grade ?? allTasks.defaultGrade,
    }),
}
