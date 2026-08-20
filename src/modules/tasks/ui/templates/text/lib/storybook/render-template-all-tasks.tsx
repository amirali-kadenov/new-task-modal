import type { ComponentType } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'

import type { TextTask } from '../types.task'

import { CatalogUpdateSnapshotsButton } from './catalog-update-snapshots-button'
import { TaskSectionTestPanel } from './task-section-test-panel'
import { TaskVerifiedCheckbox } from './task-verified-checkbox'
import { TextTemplateStory, withoutSolution } from './text-template-story'
import { TrainerLaunchLinks, type TrainerLaunch } from './trainer-launch-links'

export interface TemplateAllTaskFixture {
  id: string
  group: string
  launch?: TrainerLaunch
  task: TextTask
}

/** On-disk shape of `data/all-tasks.json` (multi-grade) or legacy flat list. */
export type AllTasksFile =
  | TemplateAllTaskFixture[]
  | {
      defaultGrade?: number
      grades?: number[]
      byGrade?: Record<string, TemplateAllTaskFixture[]>
    }

export const DEFAULT_ALL_TASKS_GRADE = 4

export const normalizeAllTasksFile = (
  data: AllTasksFile | null | undefined,
): {
  defaultGrade: number
  grades: number[]
  byGrade: Record<string, TemplateAllTaskFixture[]>
} => {
  if (Array.isArray(data)) {
    const grade = data[0]?.launch?.grade ?? DEFAULT_ALL_TASKS_GRADE
    return {
      defaultGrade: grade,
      grades: data.length ? [grade] : [DEFAULT_ALL_TASKS_GRADE],
      byGrade: data.length ? { [String(grade)]: data } : {},
    }
  }

  const byGrade = data?.byGrade ?? {}
  const grades = data?.grades?.length
    ? [...data.grades].sort((a, b) => a - b)
    : Object.keys(byGrade)
        .map(Number)
        .filter((n) => Number.isFinite(n))
        .sort((a, b) => a - b)

  const defaultGrade =
    data?.defaultGrade != null && grades.includes(data.defaultGrade)
      ? data.defaultGrade
      : grades.includes(DEFAULT_ALL_TASKS_GRADE)
        ? DEFAULT_ALL_TASKS_GRADE
        : (grades[0] ?? DEFAULT_ALL_TASKS_GRADE)

  return { defaultGrade, grades, byGrade }
}

export const getAllTasksForGrade = (
  data: AllTasksFile | null | undefined,
  grade: number = DEFAULT_ALL_TASKS_GRADE,
): TemplateAllTaskFixture[] => {
  const { byGrade } = normalizeAllTasksFile(data)
  return byGrade[String(grade)] ?? []
}

interface Props {
  Template: ComponentType<TaskComponentProps<TextTask>>
  tasks: TemplateAllTaskFixture[]
  /** Main template title, e.g. `Templates/Text/before`. */
  rootTitle?: string
  /** Active grade for Data links. */
  grade?: number
}

const variantLabelStyle = {
  margin: '0 0 8px',
  fontSize: 12,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
}

/** Renders every task fixture with Default + WithSolution variants. */
export const RenderTemplateAllTasks = ({
  Template,
  tasks,
  rootTitle,
}: Props) => {
  if (!tasks.length) {
    return (
      <div style={{ color: '#b91c1c', fontSize: 13 }}>
        No tasks in <code>all-tasks.json</code> — regenerate with template
        fixture scripts.
      </div>
    )
  }

  return (
    <div>
      <CatalogUpdateSnapshotsButton rootTitle={rootTitle} scope="allTasks" />
      {tasks.map(({ id, group, launch, task }, index) => (
        <section
          key={id}
          data-task={id}
          data-group={group}
          style={{
            marginBottom: 48,
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: 32,
          }}
        >
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
            {index + 1}. <code>{id}</code>
            <span style={{ marginLeft: 8, color: '#6b7280', fontWeight: 400 }}>
              {group}
            </span>
          </h3>

          <div data-visual-hide="">
            <TaskVerifiedCheckbox rootTitle={rootTitle} taskId={id} />
            <TrainerLaunchLinks launch={launch} />
          </div>

          <div data-visual-target="default" style={{ marginBottom: 20 }}>
            <div style={variantLabelStyle}>Default</div>
            <TextTemplateStory
              Template={Template}
              task={withoutSolution(task)}
            />
          </div>

          <div data-visual-target="solution" style={{ marginBottom: 20 }}>
            <div style={variantLabelStyle}>WithSolution</div>
            {task.solution ? (
              <TextTemplateStory Template={Template} task={task} />
            ) : (
              <div style={{ color: '#b91c1c', fontSize: 13 }}>
                Missing <code>task.solution</code> for <code>{id}</code>.
              </div>
            )}
          </div>

          <div data-visual-hide="">
            <TaskSectionTestPanel
              Template={Template}
              task={task}
              sectionKey={`all-tasks:${id}`}
              rootTitle={rootTitle}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
