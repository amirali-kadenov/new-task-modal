import { describe, expect, it } from 'vitest'

import {
  getGroupTaskRefs,
  pickTaskLaunch,
  type TemplateGroupFixture,
  type TrainerLaunch,
} from '@/modules/tasks/ui/templates/text/lib/storybook'

const launchA: TrainerLaunch = {
  grade: 4,
  chapterId: '100',
  lessonId: '200',
  taskIndex: 0,
}

const launchB: TrainerLaunch = {
  grade: 4,
  chapterId: '100',
  lessonId: '201',
  taskIndex: 3,
}

const groups: TemplateGroupFixture[] = [
  {
    group: 'g1',
    launch: launchA,
    task: { type: 'Elixir.Task_4_1_1' } as TemplateGroupFixture['task'],
    tasks: [
      { id: '4_1_1', launch: launchA },
      { id: '4_1_3', launch: launchB },
    ],
  },
  {
    group: 'g2',
    launch: launchA,
    task: { type: 'Elixir.Task_9_9_9' } as TemplateGroupFixture['task'],
    // no tasks[] — fallback from sample task type + group launch
  },
]

describe('getGroupTaskRefs', () => {
  it('returns unique task refs from tasks array', () => {
    const refs = getGroupTaskRefs(groups[0])
    expect(refs.map((r) => r.id)).toEqual(['4_1_1', '4_1_3'])
  })

  it('falls back to sample task type when tasks is missing', () => {
    const refs = getGroupTaskRefs(groups[1])
    expect(refs).toEqual([{ id: '9_9_9', launch: launchA }])
  })

  it('returns empty list for undefined fixture', () => {
    expect(getGroupTaskRefs(undefined)).toEqual([])
  })
})

describe('pickTaskLaunch', () => {
  it('returns launch for the selected taskId', () => {
    expect(pickTaskLaunch(groups, 'g1', '4_1_3')).toEqual(launchB)
  })

  it('falls back to first task launch when taskId missing', () => {
    expect(pickTaskLaunch(groups, 'g1')).toEqual(launchA)
  })

  it('falls back to group.launch when no task refs', () => {
    const empty: TemplateGroupFixture[] = [
      {
        group: 'empty',
        launch: launchB,
        task: {} as TemplateGroupFixture['task'],
      },
    ]
    expect(pickTaskLaunch(empty, 'empty')).toEqual(launchB)
  })
})
