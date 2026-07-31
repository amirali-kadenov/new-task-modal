import type { ComponentType } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  ALL_GROUPS,
  getGroupControlOptions,
  getOpenInTrainerControls,
  makePlayCorrectAnswerInTrainer as makeTextPlayCorrectAnswerInTrainer,
  makePlayWrongAnswerInTrainer as makeTextPlayWrongAnswerInTrainer,
    makeInTrainerCorrectStory as makeTextInTrainerCorrectStory,
  makeInTrainerWrongAnswerStory as makeTextInTrainerWrongAnswerStory,
  makeOpenInTrainerStory as makeTextOpenInTrainerStory,
  makeInTrainerHintsStory as makeTextInTrainerHintsStory,
  makeInTrainerTheoryStory as makeTextInTrainerTheoryStory,
  makeInTrainerShowAnswerStory as makeTextInTrainerShowAnswerStory,
  makeInTrainerCalcOverflowStory as makeTextInTrainerCalcOverflowStory,
  getAllTasksForGrade,
  normalizeAllTasksFile,
  renderAllGroupsStory as renderTextAllGroupsStory,
  renderAllTasksStory as renderTextAllTasksStory,
  renderDefaultStory as renderTextDefaultStory,
  renderInTrainerStory as renderTextInTrainerStory,
  renderOpenInTrainerStory as renderTextOpenInTrainerStory,
  renderWithSolutionStory as renderTextWithSolutionStory,
  type TrainerLaunch,
} from '@/modules/tasks/ui/templates/text/lib/storybook'
import type {
  AllTasksFile as TextAllTasksFile,
  TemplateAllTaskFixture as TextAllTaskFixture,
  TemplateGroupFixture as TextGroupFixture,
} from '@/modules/tasks/ui/templates/text/lib/storybook'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import type { ComplexTask } from '../types.task'

export {
  ALL_GROUPS,
  getAllTasksForGrade,
  getGroupControlOptions,
  getOpenInTrainerControls,
  normalizeAllTasksFile,
  renderDataAllGroupsStory,
  renderDataAllTasksStory,
  renderDataOneTaskStory,
} from '@/modules/tasks/ui/templates/text/lib/storybook'

export type { AllTasksFile } from '@/modules/tasks/ui/templates/text/lib/storybook'

export type TemplateGroupFixture = {
  group: string
  count?: number
  task: ComplexTask
  launch?: TrainerLaunch
  tasks?: { id: string; launch: TrainerLaunch }[]
}

export type TemplateAllTaskFixture = {
  id: string
  group: string
  task: ComplexTask
  launch?: TrainerLaunch
}

export type ComplexStoryArgs = {
  group: string
  taskId?: string
  grade?: number
}

export type ComplexStoryMetaArgs = TaskComponentProps<ComplexTask> &
  ComplexStoryArgs

const asTextTask = (task: ComplexTask): TextTask => task as unknown as TextTask

const asTextTemplate = (
  Template: ComponentType<TaskComponentProps<ComplexTask>>,
) => Template as unknown as ComponentType<TaskComponentProps<TextTask>>

const asTextGroups = (groups: TemplateGroupFixture[]): TextGroupFixture[] =>
  groups as unknown as TextGroupFixture[]

interface SharedArgs {
  Template: ComponentType<TaskComponentProps<ComplexTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: ComplexTask
  group: string
  rootTitle?: string
}

export const renderDefaultStory = ({
  Template,
  groups,
  fallbackTask,
  group,
  rootTitle,
}: SharedArgs) =>
  renderTextDefaultStory({
    Template: asTextTemplate(Template),
    groups: asTextGroups(groups),
    fallbackTask: asTextTask(fallbackTask),
    group,
    rootTitle,
  })

export const renderWithSolutionStory = ({
  Template,
  groups,
  fallbackTask,
  group,
  rootTitle,
}: SharedArgs) =>
  renderTextWithSolutionStory({
    Template: asTextTemplate(Template),
    groups: asTextGroups(groups),
    fallbackTask: asTextTask(fallbackTask),
    group,
    rootTitle,
  })

export const renderInTrainerStory = ({
  Template,
  groups,
  fallbackTask,
  group,
  rootTitle,
  trainerOptions,
  forceCalcOpen,
  longContent,
}: SharedArgs & {
  trainerOptions?: { withHints?: boolean; withTheory?: boolean }
  forceCalcOpen?: boolean
  longContent?: boolean
}) =>
  renderTextInTrainerStory({
    Template: asTextTemplate(Template),
    groups: asTextGroups(groups),
    fallbackTask: asTextTask(fallbackTask),
    group,
    rootTitle,
    trainerOptions,
    forceCalcOpen,
    longContent,
  })

export const renderAllGroupsStory = ({
  Template,
  groups,
  group,
  rootTitle,
}: Omit<SharedArgs, 'fallbackTask'>) =>
  renderTextAllGroupsStory({
    Template: asTextTemplate(Template),
    groups: asTextGroups(groups),
    group,
    rootTitle,
  })

export const renderAllTasksStory = ({
  Template,
  tasks,
  grade,
  rootTitle,
}: {
  Template: ComponentType<TaskComponentProps<ComplexTask>>
  tasks: TemplateAllTaskFixture[] | import('@/modules/tasks/ui/templates/text/lib/storybook').AllTasksFile
  grade?: number
  rootTitle?: string
}) =>
  renderTextAllTasksStory({
    Template: asTextTemplate(Template),
    tasks: tasks as unknown as TextAllTasksFile,
    grade,
    rootTitle,
  })

export const renderOpenInTrainerStory = ({
  groups,
  group,
  taskId,
  rootTitle,
}: {
  groups: TemplateGroupFixture[]
  group?: string
  taskId?: string
  rootTitle?: string
}) =>
  renderTextOpenInTrainerStory({
    groups: asTextGroups(groups),
    group,
    taskId,
    rootTitle,
  })

export const makePlayCorrectAnswerInTrainer = ({
  groups,
  fallbackTask,
}: {
  groups: TemplateGroupFixture[]
  fallbackTask: ComplexTask
}) =>
  makeTextPlayCorrectAnswerInTrainer({
    groups: asTextGroups(groups),
    fallbackTask: asTextTask(fallbackTask),
  })

export const makePlayWrongAnswerInTrainer = ({
  groups,
  fallbackTask,
}: {
  groups: TemplateGroupFixture[]
  fallbackTask: ComplexTask
}) =>
  makeTextPlayWrongAnswerInTrainer({
    groups: asTextGroups(groups),
    fallbackTask: asTextTask(fallbackTask),
  })


export {
  makePlayAllGroupsSmoke,
  makePlayAllTasksSmoke,
  exampleFromTask,
  trainerFolderDocsParameters,
} from '@/modules/tasks/ui/templates/text/lib/storybook'

export const makeInTrainerHintsStory = (args: {
  Template: ComponentType<TaskComponentProps<any>>
  groups: TemplateGroupFixture[]
  fallbackTask: any
  rootTitle?: string
}) =>
  makeTextInTrainerHintsStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerTheoryStory = (args: {
  Template: ComponentType<TaskComponentProps<any>>
  groups: TemplateGroupFixture[]
  fallbackTask: any
  rootTitle?: string
}) =>
  makeTextInTrainerTheoryStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerShowAnswerStory = (args: {
  Template: ComponentType<TaskComponentProps<any>>
  groups: TemplateGroupFixture[]
  fallbackTask: any
  rootTitle?: string
}) =>
  makeTextInTrainerShowAnswerStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerCalcOverflowStory = (args: {
  Template: ComponentType<TaskComponentProps<any>>
  groups: TemplateGroupFixture[]
  fallbackTask: any
  rootTitle?: string
}) =>
  makeTextInTrainerCalcOverflowStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerCorrectStory = (args: {
  Template: ComponentType<TaskComponentProps<any>>
  groups: TemplateGroupFixture[]
  fallbackTask: any
  rootTitle?: string
}) =>
  makeTextInTrainerCorrectStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerWrongAnswerStory = (args: {
  Template: ComponentType<TaskComponentProps<any>>
  groups: TemplateGroupFixture[]
  fallbackTask: any
  rootTitle?: string
}) =>
  makeTextInTrainerWrongAnswerStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeOpenInTrainerStory = (args: {
  groups: TemplateGroupFixture[]
  rootTitle?: string
  defaultGroup: string
  defaultTaskId: string
  groupIds: string[]
}) =>
  makeTextOpenInTrainerStory({
    groups: asTextGroups(args.groups),
    rootTitle: args.rootTitle,
    defaultGroup: args.defaultGroup,
    defaultTaskId: args.defaultTaskId,
    groupIds: args.groupIds,
  })

