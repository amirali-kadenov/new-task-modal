import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'

import type { TextTask } from '../types.task'

import { OpenInTrainerCatalog } from './open-in-trainer-catalog'
import {
  getAllTasksForGrade,
  RenderTemplateAllTasks,
  type AllTasksFile,
  type TemplateAllTaskFixture,
} from './render-template-all-tasks'
import type {
  TemplateGroupFixture,
  TemplateGroupTaskRef,
} from './render-template-groups'
import { RenderTemplateGroups } from './render-template-groups'
import { TextTemplateStory, withoutSolution } from './text-template-story'
import { TextTemplateTrainer } from './text-template-trainer'
import { TrainerLaunchLinks, type TrainerLaunch } from './trainer-launch-links'

/** Значение control «все группы» для AllGroups. */
export const ALL_GROUPS = 'all'

export interface TextTemplateStoryArgs {
  group: string
  taskId?: string
  /** Grade/class filter for Tasks gallery (default 4). */
  grade?: number
}

/** Storybook meta args: component props + story-only controls. */
export type TextTemplateStoryMetaArgs = TaskComponentProps<TextTask> &
  TextTemplateStoryArgs

const taskIdFromType = (elixirType: string | undefined | null): string => {
  if (!elixirType) return ''
  const prefix = 'Elixir.Task_'
  if (elixirType.startsWith(prefix)) return elixirType.slice(prefix.length)
  return elixirType.replace(/^Elixir\./, '')
}

/** Tasks list for a group; falls back to sample task when `tasks` is missing. */
export const getGroupTaskRefs = (
  fixture: TemplateGroupFixture | undefined,
): TemplateGroupTaskRef[] => {
  if (!fixture) return []
  const raw = fixture.tasks?.length
    ? fixture.tasks
    : (() => {
        const id = taskIdFromType(fixture.task?.type)
        if (id && fixture.launch) {
          return [{ id, launch: fixture.launch }]
        }
        return []
      })()

  const seen = new Set<string>()
  const unique: TemplateGroupTaskRef[] = []
  for (const ref of raw) {
    if (!ref.id || seen.has(ref.id)) continue
    seen.add(ref.id)
    unique.push(ref)
  }
  return unique
}

export const pickGroup = (
  groups: TemplateGroupFixture[],
  groupId: string,
): TemplateGroupFixture | undefined => {
  if (groupId === ALL_GROUPS) {
    return groups[0]
  }
  return groups.find((g) => g.group === groupId)
}

export const pickTask = (
  groups: TemplateGroupFixture[],
  groupId: string,
  fallback: TextTask,
): TextTask => pickGroup(groups, groupId)?.task ?? fallback

export const pickLaunch = (
  groups: TemplateGroupFixture[],
  groupId: string,
): TrainerLaunch | undefined => pickGroup(groups, groupId)?.launch

export const pickTaskLaunch = (
  groups: TemplateGroupFixture[],
  groupId: string,
  taskId?: string,
): TrainerLaunch | undefined => {
  const fixture = pickGroup(groups, groupId)
  const refs = getGroupTaskRefs(fixture)
  if (!refs.length) return fixture?.launch
  const match = taskId ? refs.find((t) => t.id === taskId) : undefined
  return match?.launch ?? refs[0]?.launch ?? fixture?.launch
}

export const filterGroups = (
  groups: TemplateGroupFixture[],
  groupId: string,
): TemplateGroupFixture[] => {
  if (groupId === ALL_GROUPS) return groups
  return groups.filter((g) => g.group === groupId)
}

export const getGroupControlOptions = (groups: TemplateGroupFixture[]) => {
  const groupIds = groups.map((g) => g.group)
  return {
    groupIds,
    defaultGroup: groupIds[0] ?? ALL_GROUPS,
    allOptions: [ALL_GROUPS, ...groupIds],
  }
}

/** Controls for OpenInTrainer: group + taskId (4_1_1, …). */
export const getOpenInTrainerControls = (groups: TemplateGroupFixture[]) => {
  const groupIds = groups.map((g) => g.group)
  const defaultGroup = groupIds[0] ?? ''
  const defaultRefs = getGroupTaskRefs(pickGroup(groups, defaultGroup))
  const allTaskIds = [
    ...new Set(groups.flatMap((g) => getGroupTaskRefs(g).map((t) => t.id))),
  ].filter(Boolean)

  return {
    groupIds,
    defaultGroup,
    defaultTaskId: defaultRefs[0]?.id ?? '',
    allTaskIds,
  }
}

interface SharedArgs {
  Template: ComponentType<TaskComponentProps<TextTask>>
  groups: TemplateGroupFixture[]
  fallbackTask: TextTask
  group: string
  /** Main template title for Data links, e.g. `Templates/Text/before`. */
  rootTitle?: string
  trainerOptions?: import('./make-trainer-props').MakeTrainerPropsOptions
  forceCalcOpen?: boolean
  /** Pad description/title so task container overflows (calc hide story). */
  longContent?: boolean
}

/** Long fixture text to force task-container scroll / calc overflow. */
export const LONG_TASK_PARAGRAPH = 'Длинный текст задачи для overflow. '.repeat(
  60,
)

export const withLongTaskContent = (task: TextTask): TextTask => {
  const desc = task.description as
    | { type?: string; content?: unknown; with_audio?: boolean }
    | undefined
  if (!desc) {
    return { ...task, title: LONG_TASK_PARAGRAPH }
  }
  if (typeof desc.content === 'string') {
    return {
      ...task,
      title: LONG_TASK_PARAGRAPH,
      description: {
        ...desc,
        content: LONG_TASK_PARAGRAPH,
      } as TextTask['description'],
    }
  }
  if (desc.content && typeof desc.content === 'object') {
    const content = desc.content as Record<string, unknown>
    return {
      ...task,
      title: LONG_TASK_PARAGRAPH,
      description: {
        ...desc,
        content: {
          ...content,
          rus: LONG_TASK_PARAGRAPH,
          kaz: LONG_TASK_PARAGRAPH,
          eng: LONG_TASK_PARAGRAPH,
        },
      } as TextTask['description'],
    }
  }
  return { ...task, title: LONG_TASK_PARAGRAPH }
}

export const renderDefaultStory = ({
  Template,
  groups,
  fallbackTask,
  group,
}: SharedArgs) => {
  const launch = pickLaunch(groups, group)
  const task = pickTask(groups, group, fallbackTask)
  return (
    <div>
      <TrainerLaunchLinks launch={launch} />
      <TextTemplateStory Template={Template} task={withoutSolution(task)} />
    </div>
  )
}

export const renderWithSolutionStory = ({
  Template,
  groups,
  fallbackTask,
  group,
}: SharedArgs) => {
  const task = pickTask(groups, group, fallbackTask)
  const launch = pickLaunch(groups, group)
  if (!task.solution) {
    return (
      <div style={{ color: '#b91c1c', fontSize: 13 }}>
        Missing <code>task.solution</code> for selected group — regenerate
        groups with <code>generate-text-template-groups.mjs</code>.
      </div>
    )
  }
  return (
    <div>
      <TrainerLaunchLinks launch={launch} />
      <TextTemplateStory Template={Template} task={task} />
    </div>
  )
}

/**
 * Live-тренажёр (header + actions + калькулятор).
 * Передаёт фикстуру с `solution` для локального checkAnswer;
 * store инициализируется без solution (режим ввода).
 */
export const renderInTrainerStory = ({
  Template,
  groups,
  fallbackTask,
  group,
  trainerOptions,
  forceCalcOpen,
  longContent,
}: SharedArgs) => {
  const launch = pickLaunch(groups, group)
  const picked = pickTask(groups, group, fallbackTask)
  const task = longContent ? withLongTaskContent(picked) : picked
  return (
    <div>
      <TrainerLaunchLinks launch={launch} />
      <TextTemplateTrainer
        Template={Template}
        task={task}
        trainerOptions={trainerOptions}
        forceCalcOpen={forceCalcOpen}
      />
    </div>
  )
}

export const renderAllGroupsStory = ({
  Template,
  groups,
  group,
  rootTitle,
}: Omit<SharedArgs, 'fallbackTask'>) => (
  <RenderTemplateGroups
    Template={Template}
    groups={filterGroups(groups, group)}
    rootTitle={rootTitle}
  />
)

export const renderAllTasksStory = ({
  Template,
  tasks,
  grade,
  rootTitle,
}: {
  Template: ComponentType<TaskComponentProps<TextTask>>
  tasks: TemplateAllTaskFixture[] | AllTasksFile
  grade?: number
  rootTitle?: string
}) => {
  // Storybook Testing runner may set STORYBOOK_TEST_GRADE for catalog smoke.
  const envGrade = (() => {
    try {
      const raw = process.env.STORYBOOK_TEST_GRADE
      if (raw == null || raw === '' || raw === 'all') return undefined
      const n = Number(raw)
      return Number.isFinite(n) ? n : undefined
    } catch {
      return undefined
    }
  })()
  const resolvedGrade = envGrade ?? grade
  const list = Array.isArray(tasks)
    ? tasks
    : getAllTasksForGrade(tasks, resolvedGrade)
  return (
    <RenderTemplateAllTasks
      Template={Template}
      tasks={list}
      rootTitle={rootTitle}
      grade={resolvedGrade}
    />
  )
}

const openRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '8px 0',
  flexWrap: 'wrap',
} as const

const OpenInTrainerView = ({
  groups,
  group,
  taskId,
  rootTitle,
}: {
  groups: TemplateGroupFixture[]
  group: string
  taskId?: string
  rootTitle?: string
}) => {
  const [selectedGroup, setSelectedGroup] = useState(group)

  useEffect(() => {
    setSelectedGroup(group)
  }, [group])

  const fixture = pickGroup(groups, selectedGroup)
  const refs = getGroupTaskRefs(fixture)
  const refIdsKey = refs.map((t) => t.id).join('|')
  const [selectedTaskId, setSelectedTaskId] = useState(
    () =>
      (taskId && refs.some((t) => t.id === taskId) ? taskId : undefined) ??
      refs[0]?.id ??
      '',
  )

  useEffect(() => {
    const next =
      (taskId && refs.some((t) => t.id === taskId) ? taskId : undefined) ??
      refs[0]?.id ??
      ''
    setSelectedTaskId((prev) => (refs.some((t) => t.id === prev) ? prev : next))
    // refs rebuilt each render — depend on stable key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, taskId, refIdsKey])

  const effectiveTaskId =
    (selectedTaskId && refs.some((t) => t.id === selectedTaskId)
      ? selectedTaskId
      : undefined) ?? refs[0]?.id

  const launch = pickTaskLaunch(groups, selectedGroup, effectiveTaskId)

  const selectGroup = (nextGroup: string) => {
    setSelectedGroup(nextGroup)
    const nextRefs = getGroupTaskRefs(pickGroup(groups, nextGroup))
    setSelectedTaskId(nextRefs[0]?.id ?? '')
  }

  const selectTask = (nextGroup: string, nextTaskId: string) => {
    setSelectedGroup(nextGroup)
    setSelectedTaskId(nextTaskId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: '#374151',
        }}
      >
        <span>Задача</span>
        <select
          value={effectiveTaskId ?? ''}
          disabled={!refs.length}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          style={{
            fontSize: 13,
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid #d1d5db',
            background: '#fff',
            minWidth: 140,
          }}
        >
          {refs.map((t) => (
            <option key={t.id} value={t.id}>
              {t.id}
            </option>
          ))}
        </select>
      </label>

      <div style={openRowStyle}>
        <code>{selectedGroup}</code>
        {fixture?.count != null ? (
          <span style={{ color: '#6b7280' }}>({fixture.count})</span>
        ) : null}
        {effectiveTaskId ? (
          <code style={{ color: '#374151' }}>{effectiveTaskId}</code>
        ) : null}
        {launch ? (
          <TrainerLaunchLinks launch={launch} />
        ) : (
          <span style={{ color: '#b91c1c', fontSize: 13 }}>
            Нет координат запуска
          </span>
        )}
      </div>

      <OpenInTrainerCatalog
        groups={groups}
        rootTitle={rootTitle}
        selectedGroup={selectedGroup}
        selectedTaskId={effectiveTaskId}
        onSelectTask={selectTask}
        onSelectGroup={selectGroup}
      />
    </div>
  )
}

/**
 * Новый / старый тренажёр for a selected structural group + taskId (4_1_1, …).
 * Use Storybook controls from `getOpenInTrainerControls`.
 */
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
}) => {
  const selectedGroup = group || groups[0]?.group || ''
  return (
    <OpenInTrainerView
      groups={groups}
      group={selectedGroup}
      taskId={taskId}
      rootTitle={rootTitle}
    />
  )
}
