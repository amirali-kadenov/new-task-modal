import type { Meta } from '@storybook/react-vite'

import {
  getGroupControlOptions,
  getOpenInTrainerControls,
  makeInTrainerCorrectStory,
  makeInTrainerWrongAnswerStory,
  makeOpenInTrainerStory,
  makeInTrainerHintsStory,
  makeInTrainerTheoryStory,
  makeInTrainerShowAnswerStory,
  makeInTrainerCalcOverflowStory,
  type TemplateGroupFixture,
  type ComplexStoryMetaArgs,
  exampleFromTask,
  trainerFolderDocsParameters,
} from '../../lib/storybook'
import type { ComplexTask as Task } from '../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import groupsJson from './data/groups.json'
import fixture from './data/task.json'

import { ComplexAfterEquation as Template } from '.'

const task = fixture as unknown as Task
const groups = groupsJson as unknown as TemplateGroupFixture[]
const openInTrainer = getOpenInTrainerControls(groups)
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const ROOT_TITLE = 'Templates/Complex/after-equation'

const meta = {
  title: 'Templates/Complex/after-equation/Trainer',
  component: Template,
  parameters: {
    ...trainerFolderDocsParameters(exampleFromTask(task, ROOT_TITLE)),
  },
  args: {
    group: defaultGroup,
  },
  argTypes: {
    group: {
      control: 'select',
      options: groupIds,
      description: 'Structural group из data/groups.json',
    },
  },
} satisfies Meta<ComplexStoryMetaArgs>

export default meta

export const Checklist = makeOpenInTrainerStory({
  groups,
  rootTitle: ROOT_TITLE,
  defaultGroup: openInTrainer.defaultGroup,
  defaultTaskId: openInTrainer.defaultTaskId,
  groupIds: openInTrainer.groupIds,
})

export const Correct = makeInTrainerCorrectStory({
  Template,
  groups,
  fallbackTask: task,
  allTasks: allTasksJson,
  rootTitle: ROOT_TITLE,
})

export const WrongAnswer = makeInTrainerWrongAnswerStory({
  Template,
  groups,
  fallbackTask: task,
  rootTitle: ROOT_TITLE,
})

export const Hints = makeInTrainerHintsStory({
  Template,
  groups,
  fallbackTask: task,
  rootTitle: ROOT_TITLE,
})

export const Theory = makeInTrainerTheoryStory({
  Template,
  groups,
  fallbackTask: task,
  rootTitle: ROOT_TITLE,
})

export const ShowAnswer = makeInTrainerShowAnswerStory({
  Template,
  groups,
  fallbackTask: task,
  rootTitle: ROOT_TITLE,
})

export const CalcOverflow = makeInTrainerCalcOverflowStory({
  Template,
  groups,
  fallbackTask: task,
  rootTitle: ROOT_TITLE,
})
