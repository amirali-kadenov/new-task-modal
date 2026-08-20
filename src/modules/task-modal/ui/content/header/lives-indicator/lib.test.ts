import { describe, expect, it } from 'vitest'

import type { Task } from '@/types/api/task'

import { getLivesCount } from './lib'

const task = (id: string, isPenalty = false): Task =>
  ({ id, isPenalty }) as unknown as Task

describe('getLivesCount', () => {
  it('returns 3 for a non-penalty task, regardless of tasks list', () => {
    const activeTask = task('t1')
    expect(getLivesCount({ activeTask, tasks: [activeTask] })).toBe(3)
  })

  it('returns 2 when the next task is not a penalty task', () => {
    const tasks = [task('t1'), task('t2', true), task('t3')]
    expect(getLivesCount({ activeTask: tasks[1], tasks })).toBe(2)
  })

  it('returns 2 when the penalty task is the last task overall', () => {
    const tasks = [task('t1'), task('t2', true)]
    expect(getLivesCount({ activeTask: tasks[1], tasks })).toBe(1 + 1)
  })

  it('returns 1 when the next task is also a penalty task', () => {
    const tasks = [task('t1'), task('t2', true), task('t3', true), task('t4')]
    expect(getLivesCount({ activeTask: tasks[1], tasks })).toBe(1)
  })

  it('regression: a freshly-inserted penalty task not at index 0, followed by another penalty task, must return 1', () => {
    // Mirrors the reported bug: a legacy id-lookup against a stale tasks
    // array (missing this freshly-inserted task) fell back to index 0 and
    // read the wrong neighbor. Here the correct, live `tasks` array is used
    // directly, so the lookup must find the real neighbor and return 1.
    const tasks = [
      task('original-1'),
      task('original-2'),
      task('penalty-1', true),
      task('penalty-2', true),
      task('original-3'),
    ]
    const activeTask = tasks[2]
    expect(getLivesCount({ activeTask, tasks })).toBe(1)
  })
})
