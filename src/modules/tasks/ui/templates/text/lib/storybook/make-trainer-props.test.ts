import { beforeEach, describe, expect, it } from 'vitest'

import {
  makeTrainerProps,
  resetTrainerSession,
} from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

const baseTask = {
  id: 'task-trainer-1',
  type: 'Elixir.Task_4_1_1',
  title: 'Trainer test',
  description: {
    type: 'text',
    with_audio: false,
    content: '2+2',
  },
  answerInput: {
    type: 10,
    before: '',
    after: '',
    text: '',
    down: '',
    up: '',
    svg: '',
  },
  fields: {},
  solution: {
    type: 'text',
    content: '',
    answer: '4',
  },
} as TextTask

beforeEach(() => {
  resetTrainerSession(baseTask)
})

describe('makeTrainerProps video / hints', () => {
  it('getVideoExplanation returns fixture video fields', async () => {
    const task = {
      ...baseTask,
      videoId: 'fixture-id',
      videoUrl: 'https://cdn.example/fixture',
      videoUrlAsTranslation: { kaz: 'https://cdn.example/k' },
      locatedCountry: 'KZ',
    } as TextTask & {
      videoId: string
      videoUrl: string
      videoUrlAsTranslation: { kaz: string }
      locatedCountry: string
    }

    const props = makeTrainerProps(task)
    const video = await props.deps.api.getVideoExplanation(task as never)

    expect(video.videoId).toBe('fixture-id')
    expect(video.videoUrl).toBe('https://cdn.example/fixture')
    expect(video.videoUrlAsTranslation).toEqual({
      kaz: 'https://cdn.example/k',
    })
    expect(video.locatedCountry).toBe('KZ')
  })

  it('getVideoExplanation falls back when fixture has no video', async () => {
    const props = makeTrainerProps(baseTask)
    const video = await props.deps.api.getVideoExplanation(baseTask as never)

    expect(video.videoId).toBe('174g9gLVGqA')
    expect(video.videoUrl).toContain('youtube.com/embed/174g9gLVGqA')
  })

  it('checkAnswer always returns null hints by default', async () => {
    const props = makeTrainerProps(baseTask)
    const api = props.deps.api

    const attempt1 = await api.checkAnswer({
      ...baseTask,
      answer: 'wrong',
    } as never)
    expect(attempt1.hint1).toBeNull()
    expect(attempt1.hint2).toBeNull()
    expect(attempt1.result).toBe(10)

    const attempt2 = await api.checkAnswer({
      ...baseTask,
      answer: 'wrong',
    } as never)
    expect(attempt2.hint1).toBeNull()
    expect(attempt2.hint2).toBeNull()
    expect(attempt2.result).toBe(10)

    const attempt3 = await api.checkAnswer({
      ...baseTask,
      answer: 'wrong',
    } as never)
    expect(attempt3.hint1).toBeNull()
    expect(attempt3.hint2).toBeNull()
    expect(attempt3.result).toBe(20)
    expect(attempt3.solution).toEqual(baseTask.solution)
  })

  it('checkAnswer returns story hints when withHints is set', async () => {
    resetTrainerSession(baseTask, '', { withHints: true })
    const props = makeTrainerProps(baseTask, { withHints: true })
    const api = props.deps.api

    const attempt1 = await api.checkAnswer({
      ...baseTask,
      answer: 'wrong',
    } as never)
    expect(attempt1.hint1).toBe('Storybook подсказка 1')
    expect(attempt1.hint2).toBeNull()

    const attempt2 = await api.checkAnswer({
      ...baseTask,
      answer: 'wrong',
    } as never)
    expect(attempt2.hint1).toBeNull()
    expect(attempt2.hint2).toBe('Storybook подсказка 2')
  })

  it('getLessonById returns theory when withTheory is set', async () => {
    const empty = await makeTrainerProps(baseTask).deps.api.getLessonById(
      1,
      'rus',
    )
    expect(empty.theory).toEqual([])

    const withTheory = await makeTrainerProps(baseTask, {
      withTheory: true,
    }).deps.api.getLessonById(1, 'rus')
    expect(withTheory.theory).toHaveLength(1)
    expect(withTheory.theory[0].type).toBe('video_url')
    expect(withTheory.theory[0].content.rus).toContain('TrnrStory01')
  })
})
