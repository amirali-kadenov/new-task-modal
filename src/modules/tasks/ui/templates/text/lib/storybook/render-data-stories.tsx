import { useEffect, useState } from 'react'

import type { TextTask } from '../types.task'

import {
  getGroupTaskRefs,
  pickGroup,
  pickTaskLaunch,
} from './create-text-template-stories'
import { JsonDataList, JsonDataView } from './json-data-view'
import {
  getAllTasksForGrade,
  normalizeAllTasksFile,
  type AllTasksFile,
  type TemplateAllTaskFixture,
} from './render-template-all-tasks'
import type { TemplateGroupFixture } from './render-template-groups'
import { StoryDataLinks, templateStoryTitles } from './storybook-links'
import { TrainerLaunchLinks } from './trainer-launch-links'

const taskIdFromType = (elixirType: string | undefined | null): string => {
  if (!elixirType) return ''
  const prefix = 'Elixir.Task_'
  if (elixirType.startsWith(prefix)) return elixirType.slice(prefix.length)
  return elixirType.replace(/^Elixir\./, '')
}

export type DataStoriesRootProps = {
  rootTitle: string
  groups: TemplateGroupFixture[]
  allTasks: AllTasksFile
  fallbackTask: TextTask
}

const OneTaskView = ({
  rootTitle,
  groups,
  allTasks,
  fallbackTask,
  grade,
  group,
  taskId,
}: DataStoriesRootProps & {
  grade: number
  group: string
  taskId?: string
}) => {
  const titles = templateStoryTitles(rootTitle)
  const fixture = pickGroup(groups, group)
  const refs = getGroupTaskRefs(fixture)
  const gradeTasks = getAllTasksForGrade(allTasks, grade)
  const [selectedTaskId, setSelectedTaskId] = useState(
    () =>
      (taskId &&
      (refs.some((t) => t.id === taskId) ||
        gradeTasks.some((t) => t.id === taskId))
        ? taskId
        : undefined) ??
      refs[0]?.id ??
      gradeTasks.find((t) => t.group === group)?.id ??
      gradeTasks[0]?.id ??
      '',
  )

  useEffect(() => {
    const next =
      (taskId &&
      (refs.some((t) => t.id === taskId) ||
        gradeTasks.some((t) => t.id === taskId))
        ? taskId
        : undefined) ??
      refs[0]?.id ??
      gradeTasks.find((t) => t.group === group)?.id ??
      gradeTasks[0]?.id ??
      ''
    setSelectedTaskId(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, taskId, grade])

  const allTask: TemplateAllTaskFixture | undefined =
    gradeTasks.find((t) => t.id === selectedTaskId) ??
    gradeTasks.find((t) => t.group === group)

  const task: TextTask = allTask?.task ?? fixture?.task ?? fallbackTask
  const launch =
    pickTaskLaunch(groups, group, selectedTaskId) ??
    allTask?.launch ??
    fixture?.launch
  const effectiveId = selectedTaskId || allTask?.id || taskIdFromType(task.type)

  const taskOptions =
    refs.length > 0
      ? refs.map((t) => t.id)
      : gradeTasks.filter((t) => t.group === group).map((t) => t.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          fontSize: 13,
        }}
      >
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>Задача</span>
          <select
            value={effectiveId}
            disabled={!taskOptions.length}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            style={{ fontSize: 13, padding: '4px 8px', minWidth: 140 }}
          >
            {taskOptions.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <code>{group}</code>
        <code>{effectiveId}</code>
      </div>

      <TrainerLaunchLinks launch={launch} />
      <StoryDataLinks
        links={[
          {
            label: 'Default',
            title: titles.root,
            name: 'Default',
            args: { group },
          },
          {
            label: 'WithSolution',
            title: titles.root,
            name: 'WithSolution',
            args: { group },
          },
          {
            label: 'Trainer / InTrainer',
            title: titles.trainer,
            name: 'InTrainer',
            args: { group },
          },
          {
            label: 'Trainer / OpenInTrainer',
            title: titles.trainer,
            name: 'OpenInTrainer',
            args: { group, taskId: effectiveId },
          },
        ]}
      />

      <JsonDataView
        context={{
          id: effectiveId,
          group,
          grade,
          launch,
        }}
        task={task}
      />
    </div>
  )
}

export const renderDataOneTaskStory = ({
  rootTitle,
  groups,
  allTasks,
  fallbackTask,
  grade = 4,
  group,
  taskId,
}: DataStoriesRootProps & {
  grade?: number
  group?: string
  taskId?: string
}) => {
  const groupIds = groups.map((g) => g.group)
  const selectedGroup =
    group && groupIds.includes(group) ? group : (groupIds[0] ?? '')

  return (
    <OneTaskView
      key={`${grade}:${selectedGroup}:${taskId ?? ''}`}
      rootTitle={rootTitle}
      groups={groups}
      allTasks={allTasks}
      fallbackTask={fallbackTask}
      grade={grade}
      group={selectedGroup}
      taskId={taskId}
    />
  )
}

export const renderDataAllGroupsStory = ({
  rootTitle,
  groups,
}: Pick<DataStoriesRootProps, 'rootTitle' | 'groups'>) => {
  const titles = templateStoryTitles(rootTitle)
  return (
    <div>
      <StoryDataLinks
        links={[
          {
            label: 'Groups / All',
            title: titles.allGroups,
            name: 'All',
          },
        ]}
      />
      <JsonDataList
        items={groups.map((g, index) => ({
          key: g.group,
          index: index + 1,
          label: g.group,
          context: {
            group: g.group,
            grade: g.launch?.grade ?? 4,
            launch: g.launch,
            id: taskIdFromType(g.task.type),
          },
          task: g.task,
        }))}
      />
    </div>
  )
}

export const renderDataAllTasksStory = ({
  rootTitle,
  allTasks,
  grade = 4,
}: Pick<DataStoriesRootProps, 'rootTitle' | 'allTasks'> & {
  grade?: number
}) => {
  const titles = templateStoryTitles(rootTitle)
  const tasks = getAllTasksForGrade(allTasks, grade)
  const normalized = normalizeAllTasksFile(allTasks)

  return (
    <div>
      <StoryDataLinks
        links={[
          {
            label: 'Tasks / All',
            title: titles.allTasks,
            name: 'All',
            args: { grade },
          },
        ]}
      >
        <span style={{ fontSize: 12, color: '#6b7280' }}>
          grade {grade}
          {normalized.grades.length > 1
            ? ` · available: ${normalized.grades.join(', ')}`
            : null}
        </span>
      </StoryDataLinks>
      {!tasks.length ? (
        <div style={{ color: '#b91c1c', fontSize: 13 }}>
          No tasks for grade {grade}
        </div>
      ) : (
        <JsonDataList
          items={tasks.map((t, index) => ({
            key: t.id,
            index: index + 1,
            label: t.id,
            context: {
              id: t.id,
              group: t.group,
              grade,
              launch: t.launch,
            },
            task: t.task,
          }))}
        />
      )}
    </div>
  )
}
