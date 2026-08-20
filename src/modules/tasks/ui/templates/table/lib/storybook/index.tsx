import type { ComponentType } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  makePlayCorrectAnswerInTrainer as makeTextPlayCorrectAnswerInTrainer,
  makePlayWrongAnswerInTrainer as makeTextPlayWrongAnswerInTrainer,
  makeInTrainerCorrectStory as makeTextInTrainerCorrectStory,
  makeInTrainerWrongAnswerStory as makeTextInTrainerWrongAnswerStory,
  makeOpenInTrainerStory as makeTextOpenInTrainerStory,
  makeInTrainerHintsStory as makeTextInTrainerHintsStory,
  makeInTrainerTheoryStory as makeTextInTrainerTheoryStory,
  makeInTrainerShowAnswerStory as makeTextInTrainerShowAnswerStory,
  makeInTrainerCalcOverflowStory as makeTextInTrainerCalcOverflowStory,
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
  TemplateGroupFixture as TextGroupFixture,
} from '@/modules/tasks/ui/templates/text/lib/storybook'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import type { TableTask } from '../types.task'

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
  task: TableTask
  launch?: TrainerLaunch
  tasks?: { id: string; launch: TrainerLaunch }[]
}

export type TemplateAllTaskFixture = {
  id: string
  group: string
  task: TableTask
  launch?: TrainerLaunch
}

export type TableStoryArgs = {
  group: string
  taskId?: string
  grade?: number
}

export type TableStoryMetaArgs = TaskComponentProps<TableTask> & TableStoryArgs

const asTextTask = (task: TableTask): TextTask => task as unknown as TextTask

const asTextTemplate = (
  Template: ComponentType<TaskComponentProps<TableTask>>,
) => Template as unknown as ComponentType<TaskComponentProps<TextTask>>

const asTextGroups = (groups: TemplateGroupFixture[]): TextGroupFixture[] =>
  groups as unknown as TextGroupFixture[]

interface SharedArgs {
  Template: ComponentType<TaskComponentProps<TableTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TableTask
  group: string
  rootTitle?: string
  allTasks?: import('@/modules/tasks/ui/templates/text/lib/storybook').AllTasksFile
  taskId?: string
  grade?: number
}

export const renderDefaultStory = ({
  Template,
  groups,
  fallbackTask,
  group,
  rootTitle,
  allTasks,
  taskId,
  grade,
}: SharedArgs) =>
  renderTextDefaultStory({
    Template: asTextTemplate(Template),
    groups: asTextGroups(groups),
    fallbackTask: asTextTask(fallbackTask),
    group,
    rootTitle,
    allTasks,
    taskId,
    grade,
  })

export const renderWithSolutionStory = ({
  Template,
  groups,
  fallbackTask,
  group,
  rootTitle,
  allTasks,
  taskId,
  grade,
}: SharedArgs) =>
  renderTextWithSolutionStory({
    Template: asTextTemplate(Template),
    groups: asTextGroups(groups),
    fallbackTask: asTextTask(fallbackTask),
    group,
    rootTitle,
    allTasks,
    taskId,
    grade,
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
  allTasks,
  taskId,
  grade,
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
    allTasks,
    taskId,
    grade,
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
  taskId,
  rootTitle,
}: {
  Template: ComponentType<TaskComponentProps<TableTask>>
  tasks:
    | TemplateAllTaskFixture[]
    | import('@/modules/tasks/ui/templates/text/lib/storybook').AllTasksFile
  grade?: number
  taskId?: string
  rootTitle?: string
}) =>
  renderTextAllTasksStory({
    Template: asTextTemplate(Template),
    tasks: tasks as unknown as TextAllTasksFile,
    grade,
    taskId,
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
  fallbackTask: TableTask
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
  fallbackTask: TableTask
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
  Template: ComponentType<TaskComponentProps<TableTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TableTask
  rootTitle?: string
}) =>
  makeTextInTrainerHintsStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerTheoryStory = (args: {
  Template: ComponentType<TaskComponentProps<TableTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TableTask
  rootTitle?: string
}) =>
  makeTextInTrainerTheoryStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerShowAnswerStory = (args: {
  Template: ComponentType<TaskComponentProps<TableTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TableTask
  rootTitle?: string
}) =>
  makeTextInTrainerShowAnswerStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerCalcOverflowStory = (args: {
  Template: ComponentType<TaskComponentProps<TableTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TableTask
  rootTitle?: string
}) =>
  makeTextInTrainerCalcOverflowStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerCorrectStory = (args: {
  Template: ComponentType<TaskComponentProps<TableTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TableTask
  rootTitle?: string
  allTasks?: import('@/modules/tasks/ui/templates/text/lib/storybook').AllTasksFile
}) =>
  makeTextInTrainerCorrectStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
    allTasks: args.allTasks,
  })

export const makeInTrainerWrongAnswerStory = (args: {
  Template: ComponentType<TaskComponentProps<TableTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TableTask
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
