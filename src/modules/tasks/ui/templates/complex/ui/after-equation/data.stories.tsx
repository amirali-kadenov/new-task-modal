import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  getGroupControlOptions,
  getOpenInTrainerControls,
  normalizeAllTasksFile,
  renderDataAllGroupsStory,
  renderDataAllTasksStory,
  renderDataOneTaskStory,
  type TemplateGroupFixture,
  type ComplexStoryMetaArgs,
} from '../../lib/storybook'
import type { ComplexTask as Task } from '../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import groupsJson from './data/groups.json'
import fixture from './data/task.json'

import { ComplexAfterEquation as Template } from '.'

const task = fixture as unknown as Task
const groups = groupsJson as unknown as TemplateGroupFixture[]
const allTasks = normalizeAllTasksFile(allTasksJson)
const openInTrainer = getOpenInTrainerControls(groups)
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const ROOT_TITLE = 'Templates/Complex/after-equation'

const meta = {
  title: 'Templates/Complex/after-equation/Data',
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
} satisfies Meta<ComplexStoryMetaArgs>

export default meta
type Story = StoryObj<ComplexStoryMetaArgs>

export const OneTask: Story = {
  name: 'One Task',
  render: ({ grade, group, taskId }) =>
    renderDataOneTaskStory({
      rootTitle: ROOT_TITLE,
      groups,
      allTasks: allTasksJson,
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
      allTasks: allTasksJson,
      grade: grade ?? allTasks.defaultGrade,
    }),
}
