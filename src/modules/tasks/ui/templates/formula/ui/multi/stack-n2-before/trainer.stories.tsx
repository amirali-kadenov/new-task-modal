import type { Meta, StoryObj } from '@storybook/react-vite'

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
  type FormulaStoryMetaArgs,
  exampleFromTask,
  trainerFolderDocsParameters,
} from '../../../lib/storybook'
import type { FormulaTask as Task } from '../../../lib/types.task'

import groupsJson from './data/groups.json'
import fixture from './data/task.json'

import { FormulaMultiStackN2Before as Template } from '.'

const task = fixture as unknown as Task
const groups = groupsJson as unknown as TemplateGroupFixture[]
const openInTrainer = getOpenInTrainerControls(groups)
const { groupIds, defaultGroup } = getGroupControlOptions(groups)
const ROOT_TITLE = 'Templates/Formula/multi/stack-n2-before'

const meta = {
  title: 'Templates/Formula/multi/stack-n2-before/Trainer',
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
} satisfies Meta<FormulaStoryMetaArgs>

export default meta
type Story = StoryObj<FormulaStoryMetaArgs>

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
