import { beforeEach, describe, expect, it } from 'vitest'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import taskPlain from '@/modules/tasks/ui/templates/text/ui/plain/data/task.json'

import { applyTrainerState } from './apply-trainer-state'

const task = taskPlain as unknown as TextTask

beforeEach(() => {
  useStore.setState({
    state: null,
    answer: '',
    prevAnswer: null,
    isTaskLoaded: false,
    isAnswerChanged: false,
    isTransitioning: false,
    availableTasks: null,
  })
})

describe('applyTrainerState', () => {
  it('idle leaves session after reset without wrong/solution flags', () => {
    applyTrainerState('idle', task)

    const store = useStore.getState()
    expect(store.state?.activeTask).toBeTruthy()
    expect(store.state?.checkUserAnswerResult).toBeFalsy()
    expect(store.answer).toBe('')
    expect(store.state?.activeTask?.solution).toBeNull()
  })

  it('canvasChat behaves like idle for store flags', () => {
    applyTrainerState('canvasChat', task)

    const store = useStore.getState()
    expect(store.state?.checkUserAnswerResult).toBeFalsy()
    expect(store.answer).toBe('')
  })

  it('wrong sets GiveAttempt, clears solution, keeps wrong answer', () => {
    applyTrainerState('wrong', task)

    const store = useStore.getState()
    expect(store.state?.checkUserAnswerResult).toBe(10)
    expect(store.state?.activeTask?.solution).toBeNull()
    expect(store.state?.activeTask?.attemptsCount).toBe(1)
    expect(store.state?.activeTask?.result).toBe('none')
    expect(store.answer).toBeTruthy()
    expect(store.answer).not.toBe('60000')
    expect(store.answer.endsWith('1')).toBe(true)
    expect(store.prevAnswer).toBe(store.answer)
  })

  it('solution sets ShowSolution, attaches solution, attemptsCount 3', () => {
    applyTrainerState('solution', task)

    const store = useStore.getState()
    expect(store.state?.checkUserAnswerResult).toBe(20)
    expect(store.state?.activeTask?.solution).toBeTruthy()
    expect(store.state?.activeTask?.attemptsCount).toBe(3)
    expect(store.state?.activeTask?.result).toBe('error')
    expect(store.answer).toBeTruthy()
    expect(store.answer).not.toBe('60000')
  })
})
