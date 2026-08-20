import type { ComponentType } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'

import type { TextTask } from '../types.task'

import {
  renderInTrainerStory,
  renderOpenInTrainerStory,
} from './create-text-template-stories'
import {
  makePlayCalcOverflowInTrainer,
  makePlayCorrectAnswerInTrainer,
  makePlayHintsInTrainer,
  makePlayShowAnswerInTrainer,
  makePlayTheoryInTrainer,
  makePlayWrongAnswerInTrainer,
} from './play-in-trainer'
import type { AllTasksFile } from './render-template-all-tasks'
import type { TemplateGroupFixture } from './render-template-groups'
import {
  PLAY_CASES_CALC_OVERFLOW,
  PLAY_CASES_CORRECT,
  PLAY_CASES_HINTS,
  PLAY_CASES_SHOW_ANSWER,
  PLAY_CASES_THEORY,
  PLAY_CASES_WRONG,
  TRAINER_STORY_DOCS,
  trainerPlayParameters,
} from './trainer-play-cases'

export type TrainerStoryArgs = {
  Template: ComponentType<TaskComponentProps<TextTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TextTask
  rootTitle?: string
  /** Full catalog fixture — enables per-task `taskId` resolution (Correct only). */
  allTasks?: AllTasksFile
}

type GroupArgs = { group?: string; taskId?: string; grade?: number }

type OpenTrainerArgs = {
  groups: TemplateGroupFixture[]
  rootTitle?: string
  defaultGroup: string
  defaultTaskId: string
  groupIds: string[]
}

/**
 * Correct-answer flow story (sidebar: Flow/Correct).
 * Also the trainer-parity snapshot target — `taskId` (+ `allTasks` supplied
 * by the template file) resolves one catalog task instead of the group
 * sample, so every task can be screenshotted, not just one per group.
 */
export const makeInTrainerCorrectStory = ({
  Template,
  groups,
  fallbackTask,
  rootTitle,
  allTasks,
}: TrainerStoryArgs) => ({
  name: 'Flow/Correct',
  parameters: trainerPlayParameters(
    PLAY_CASES_CORRECT,
    TRAINER_STORY_DOCS.correct,
  ),
  render: ({ group, taskId, grade }: GroupArgs) =>
    renderInTrainerStory({
      Template,
      groups,
      fallbackTask,
      rootTitle,
      group: group ?? '',
      taskId,
      allTasks,
      grade,
    }),
  play: makePlayCorrectAnswerInTrainer({ groups, fallbackTask }),
})

/** Wrong-answer flow story (sidebar: Flow/Wrong Answer). */
export const makeInTrainerWrongAnswerStory = ({
  Template,
  groups,
  fallbackTask,
  rootTitle,
}: TrainerStoryArgs) => ({
  name: 'Flow/Wrong Answer',
  parameters: trainerPlayParameters(PLAY_CASES_WRONG, TRAINER_STORY_DOCS.wrong),
  render: ({ group }: GroupArgs) =>
    renderInTrainerStory({
      Template,
      groups,
      fallbackTask,
      rootTitle,
      group: group ?? '',
    }),
  play: makePlayWrongAnswerInTrainer({ groups, fallbackTask }),
})

/** Host launch links / catalog (sidebar: Checklist). */
export const makeOpenInTrainerStory = ({
  groups,
  rootTitle,
  defaultGroup,
  defaultTaskId,
  groupIds,
}: OpenTrainerArgs) => ({
  name: 'Checklist',
  args: {
    group: defaultGroup,
    taskId: defaultTaskId,
  },
  argTypes: {
    group: {
      control: 'select' as const,
      options: groupIds,
      description: 'Structural group из data/groups.json',
    },
    taskId: {
      control: false as const,
      description: 'taskId задач выбранной group (4_1_1, …) — select в canvas',
    },
  },
  parameters: {
    docs: { description: { story: TRAINER_STORY_DOCS.open } },
  },
  render: ({ group, taskId }: GroupArgs) =>
    renderOpenInTrainerStory({
      groups,
      group,
      taskId,
      rootTitle,
    }),
})

/** API hints after wrong answers (sidebar: Flow/Hints). */
export const makeInTrainerHintsStory = ({
  Template,
  groups,
  fallbackTask,
  rootTitle,
}: TrainerStoryArgs) => ({
  name: 'Flow/Hints',
  parameters: trainerPlayParameters(PLAY_CASES_HINTS, TRAINER_STORY_DOCS.hints),
  render: ({ group }: GroupArgs) =>
    renderInTrainerStory({
      Template,
      groups,
      fallbackTask,
      rootTitle,
      group: group ?? '',
      trainerOptions: { withHints: true },
    }),
  play: makePlayHintsInTrainer({ groups, fallbackTask }),
})

/** Theory video on chat open (sidebar: Flow/Theory). */
export const makeInTrainerTheoryStory = ({
  Template,
  groups,
  fallbackTask,
  rootTitle,
}: TrainerStoryArgs) => ({
  name: 'Flow/Theory',
  parameters: trainerPlayParameters(
    PLAY_CASES_THEORY,
    TRAINER_STORY_DOCS.theory,
  ),
  render: ({ group }: GroupArgs) =>
    renderInTrainerStory({
      Template,
      groups,
      fallbackTask,
      rootTitle,
      group: group ?? '',
      trainerOptions: { withTheory: true },
    }),
  play: makePlayTheoryInTrainer,
})

/** Chat «Показать ответ» (sidebar: Flow/Show Answer). */
export const makeInTrainerShowAnswerStory = ({
  Template,
  groups,
  fallbackTask,
  rootTitle,
}: TrainerStoryArgs) => ({
  name: 'Flow/Show Answer',
  parameters: trainerPlayParameters(
    PLAY_CASES_SHOW_ANSWER,
    TRAINER_STORY_DOCS.showAnswer,
  ),
  render: ({ group }: GroupArgs) =>
    renderInTrainerStory({
      Template,
      groups,
      fallbackTask,
      rootTitle,
      group: group ?? '',
    }),
  play: makePlayShowAnswerInTrainer,
})

/** Long text hides calculator (sidebar: Flow/Calc Overflow). */
export const makeInTrainerCalcOverflowStory = ({
  Template,
  groups,
  fallbackTask,
  rootTitle,
}: TrainerStoryArgs) => ({
  name: 'Flow/Calc Overflow',
  parameters: trainerPlayParameters(
    PLAY_CASES_CALC_OVERFLOW,
    TRAINER_STORY_DOCS.calcOverflow,
    { noPadding: true },
  ),
  render: ({ group }: GroupArgs) =>
    renderInTrainerStory({
      Template,
      groups,
      fallbackTask,
      rootTitle,
      group: group ?? '',
      forceCalcOpen: false,
      longContent: true,
    }),
  play: makePlayCalcOverflowInTrainer,
})
