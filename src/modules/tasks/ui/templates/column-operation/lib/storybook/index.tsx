import type { ComponentType, ReactNode } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  filterGroups,
  makePlayCorrectAnswerInTrainer as makeTextPlayCorrectAnswerInTrainer,
  makePlayWrongAnswerInTrainer as makeTextPlayWrongAnswerInTrainer,
  makeInTrainerCorrectStory as makeTextInTrainerCorrectStory,
  makeInTrainerWrongAnswerStory as makeTextInTrainerWrongAnswerStory,
  makeOpenInTrainerStory as makeTextOpenInTrainerStory,
  makeInTrainerHintsStory as makeTextInTrainerHintsStory,
  makeInTrainerTheoryStory as makeTextInTrainerTheoryStory,
  makeInTrainerShowAnswerStory as makeTextInTrainerShowAnswerStory,
  makeInTrainerCalcOverflowStory as makeTextInTrainerCalcOverflowStory,
  renderAllTasksStory as renderTextAllTasksStory,
  renderDefaultStory as renderTextDefaultStory,
  renderInTrainerStory as renderTextInTrainerStory,
  renderOpenInTrainerStory as renderTextOpenInTrainerStory,
  renderWithSolutionStory as renderTextWithSolutionStory,
  RenderTemplateGroups,
  TextTemplateStory,
  TrainerLaunchLinks,
  withoutSolution,
  type TrainerLaunch,
} from '@/modules/tasks/ui/templates/text/lib/storybook'
import type {
  AllTasksFile as TextAllTasksFile,
  TemplateGroupFixture as TextGroupFixture,
} from '@/modules/tasks/ui/templates/text/lib/storybook'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import type { ColumnOperationType } from '../detect-column-operation-type'
import type { ColumnOperationTask } from '../types.task'

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
  task: ColumnOperationTask
  launch?: TrainerLaunch
  tasks?: { id: string; launch: TrainerLaunch }[]
}

export type TemplateAllTaskFixture = {
  id: string
  group: string
  task: ColumnOperationTask
  launch?: TrainerLaunch
}

export type OperationFixture = {
  operation: ColumnOperationType
  taskId?: string
  task: ColumnOperationTask
  launch?: TrainerLaunch
}

export type ColumnOperationStoryArgs = {
  group: string
  taskId?: string
  grade?: number
}

export type ColumnOperationStoryMetaArgs =
  TaskComponentProps<ColumnOperationTask> & ColumnOperationStoryArgs

const OPERATION_LABELS: Record<string, string> = {
  plus: '+',
  minus: '−',
  times: '×',
  div: '÷',
}

const asTextTask = (task: ColumnOperationTask): TextTask =>
  task as unknown as TextTask

const asTextTemplate = (
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>,
) => Template as unknown as ComponentType<TaskComponentProps<TextTask>>

const asTextGroups = (groups: TemplateGroupFixture[]): TextGroupFixture[] =>
  groups as unknown as TextGroupFixture[]

interface SharedArgs {
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: ColumnOperationTask
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

export const renderAllGroupsStory = ({
  Template,
  groups,
  group,
  rootTitle,
}: Omit<SharedArgs, 'fallbackTask'>) => {
  const filtered = filterGroups(asTextGroups(groups), group).map((fixture) => {
    const symbol = OPERATION_LABELS[fixture.group]
    if (!symbol) return fixture
    return {
      ...fixture,
      group: `${fixture.group} (${symbol})`,
    }
  })

  return (
    <RenderTemplateGroups
      Template={asTextTemplate(Template)}
      groups={filtered}
      rootTitle={rootTitle}
    />
  )
}

export const renderAllTasksStory = ({
  Template,
  tasks,
  grade,
  taskId,
  rootTitle,
}: {
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
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
  fallbackTask: ColumnOperationTask
}) =>
  makeTextPlayCorrectAnswerInTrainer({
    groups: asTextGroups(groups),
    fallbackTask: asTextTask(fallbackTask),
  })

export const pickOperationFixture = (
  fixtures: OperationFixture[],
  operation: string,
): OperationFixture | undefined =>
  fixtures.find((fixture) => fixture.operation === operation)

export const renderOperationStory = ({
  Template,
  fixture,
  withSolution = false,
}: {
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  fixture: OperationFixture | undefined
  withSolution?: boolean
}) => {
  if (!fixture) {
    return (
      <div style={{ color: '#b91c1c', fontSize: 13 }}>
        Missing operation fixture — regenerate with{' '}
        <code>generate-column-operation-template-groups.mjs</code>.
      </div>
    )
  }

  const task = withSolution
    ? asTextTask(fixture.task)
    : withoutSolution(asTextTask(fixture.task))

  if (withSolution && !fixture.task.solution) {
    return (
      <div style={{ color: '#b91c1c', fontSize: 13 }}>
        Missing <code>task.solution</code> for operation{' '}
        <code>{fixture.operation}</code>.
      </div>
    )
  }

  return (
    <div>
      <TrainerLaunchLinks launch={fixture.launch} />
      <TextTemplateStory Template={asTextTemplate(Template)} task={task} />
    </div>
  )
}

const variantLabelStyle = {
  margin: '0 0 8px',
  fontSize: 12,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
}

const Variant = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div style={{ marginBottom: 20 }}>
    <div style={variantLabelStyle}>{label}</div>
    {children}
  </div>
)

/** All operations: Default + WithSolution per fixture. */
export const renderAllOperationsStory = ({
  Template,
  fixtures,
}: {
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  fixtures: OperationFixture[]
}) => (
  <div>
    {fixtures.map((fixture) => {
      const label =
        OPERATION_LABELS[fixture.operation] ?? String(fixture.operation)

      return (
        <section
          key={fixture.operation}
          style={{
            marginBottom: 48,
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: 32,
          }}
        >
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
            <code>{fixture.operation}</code>
            <span style={{ marginLeft: 8, color: '#6b7280', fontWeight: 400 }}>
              ({label})
            </span>
            {fixture.taskId ? (
              <span
                style={{ marginLeft: 8, color: '#9ca3af', fontWeight: 400 }}
              >
                {fixture.taskId}
              </span>
            ) : null}
          </h3>

          <TrainerLaunchLinks launch={fixture.launch} />

          <Variant label="Default">
            <TextTemplateStory
              Template={asTextTemplate(Template)}
              task={withoutSolution(asTextTask(fixture.task))}
            />
          </Variant>

          <Variant label="WithSolution">
            {fixture.task.solution ? (
              <TextTemplateStory
                Template={asTextTemplate(Template)}
                task={asTextTask(fixture.task)}
              />
            ) : (
              <div style={{ color: '#b91c1c', fontSize: 13 }}>
                Missing <code>task.solution</code> for{' '}
                <code>{fixture.operation}</code>.
              </div>
            )}
          </Variant>
        </section>
      )
    })}
  </div>
)

export const makePlayWrongAnswerInTrainer = ({
  groups,
  fallbackTask,
}: {
  groups: TemplateGroupFixture[]
  fallbackTask: ColumnOperationTask
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
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: ColumnOperationTask
  rootTitle?: string
}) =>
  makeTextInTrainerHintsStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerTheoryStory = (args: {
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: ColumnOperationTask
  rootTitle?: string
}) =>
  makeTextInTrainerTheoryStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerShowAnswerStory = (args: {
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: ColumnOperationTask
  rootTitle?: string
}) =>
  makeTextInTrainerShowAnswerStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerCalcOverflowStory = (args: {
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: ColumnOperationTask
  rootTitle?: string
}) =>
  makeTextInTrainerCalcOverflowStory({
    Template: asTextTemplate(args.Template),
    groups: asTextGroups(args.groups),
    fallbackTask: asTextTask(args.fallbackTask),
    rootTitle: args.rootTitle,
  })

export const makeInTrainerCorrectStory = (args: {
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: ColumnOperationTask
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
  Template: ComponentType<TaskComponentProps<ColumnOperationTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: ColumnOperationTask
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
