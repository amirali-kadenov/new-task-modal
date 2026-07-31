import { within } from 'storybook/test'

import { useAiChatStore } from '@/modules/chat/ui/ai-chat/model/ai-chat-store'
import type { TemplateGroupFixture } from '@/modules/tasks/ui/templates/text/lib/storybook'
import {
  pickTask,
  resetTrainerSession,
  runPlayCanvasAndChatInTrainer,
  runPlayCorrectAnswerInTrainer,
  runPlayWrongAnswerInTrainer,
} from '@/modules/tasks/ui/templates/text/lib/storybook'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import type { TrainerPlaygroundArgs } from '../ui/trainer-playground'

import { getTrainerVariant } from './trainer-variants'

export type TrainerSuiteId = 'trainer' | 'canvasChat' | 'all'

export type TrainerCaseId = 'correctAnswer' | 'wrongAnswer' | 'canvasAndChat'

export type TrainerCaseStatus = 'pending' | 'running' | 'pass' | 'fail'

export type TrainerCaseResult = {
  id: TrainerCaseId
  label: string
  status: TrainerCaseStatus
  error?: string
}

export type SuiteRunContext = {
  canvasElement: HTMLElement
  args: TrainerPlaygroundArgs
  onCaseUpdate?: (result: TrainerCaseResult) => void
}

const CHECK_BUTTON_NAME = 'Проверить'

const CASE_META: Record<
  TrainerCaseId,
  { label: string; suites: TrainerSuiteId[] }
> = {
  correctAnswer: {
    label: 'Верный ответ',
    suites: ['trainer', 'all'],
  },
  wrongAnswer: {
    label: 'Неверный ответ',
    suites: ['trainer', 'all'],
  },
  canvasAndChat: {
    label: 'Доска и чат',
    suites: ['canvasChat', 'all'],
  },
}

export const TRAINER_SUITE_OPTIONS: {
  id: TrainerSuiteId
  label: string
}[] = [
  { id: 'trainer', label: 'Тренажёр (ответы)' },
  { id: 'canvasChat', label: 'Доска и чат' },
  { id: 'all', label: 'Все' },
]

export const casesForSuite = (suite: TrainerSuiteId): TrainerCaseId[] => {
  if (suite === 'trainer') return ['correctAnswer', 'wrongAnswer']
  if (suite === 'canvasChat') return ['canvasAndChat']
  return ['correctAnswer', 'wrongAnswer', 'canvasAndChat']
}

export const initialCaseResults = (
  suite: TrainerSuiteId,
): TrainerCaseResult[] =>
  casesForSuite(suite).map((id) => ({
    id,
    label: CASE_META[id].label,
    status: 'pending',
  }))

const playFixtures = (args: TrainerPlaygroundArgs) => {
  const variant = getTrainerVariant(args.variantKey)
  const groups = variant.groups as unknown as TemplateGroupFixture[]
  const fallbackTask = variant.fallbackTask as TextTask
  return { groups, fallbackTask }
}

const remountIdle = async (context: SuiteRunContext) => {
  const { groups, fallbackTask } = playFixtures(context.args)
  const task = pickTask(groups, context.args.group, fallbackTask)
  resetTrainerSession(task)
  useAiChatStore.getState().reset(task.id)
  const canvas = within(context.canvasElement)
  await canvas.findByRole('button', { name: CHECK_BUTTON_NAME })
}

const runCase = async (
  id: TrainerCaseId,
  context: SuiteRunContext,
): Promise<void> => {
  const { groups, fallbackTask } = playFixtures(context.args)
  const playArgs = { group: context.args.group }

  if (id === 'correctAnswer') {
    await runPlayCorrectAnswerInTrainer({ groups, fallbackTask })({
      canvasElement: context.canvasElement,
      args: playArgs,
    })
    return
  }

  if (id === 'wrongAnswer') {
    await runPlayWrongAnswerInTrainer({ groups, fallbackTask })({
      canvasElement: context.canvasElement,
      args: playArgs,
    })
    return
  }

  const task = pickTask(groups, context.args.group, fallbackTask)
  useAiChatStore.getState().reset(task.id)
  await runPlayCanvasAndChatInTrainer({
    canvasElement: context.canvasElement,
  })
}

/**
 * Run a suite of trainer interaction cases sequentially.
 * Reports per-case status via `onCaseUpdate`.
 */
export const runTrainerSuite = async (
  suite: TrainerSuiteId,
  context: SuiteRunContext,
): Promise<TrainerCaseResult[]> => {
  const caseIds = casesForSuite(suite)
  const results: TrainerCaseResult[] = caseIds.map((id) => ({
    id,
    label: CASE_META[id].label,
    status: 'pending' as const,
  }))

  const emit = (index: number, patch: Partial<TrainerCaseResult>) => {
    results[index] = { ...results[index], ...patch }
    context.onCaseUpdate?.(results[index])
  }

  for (let i = 0; i < caseIds.length; i += 1) {
    const id = caseIds[i]
    emit(i, { status: 'running', error: undefined })
    try {
      if (i > 0) {
        await remountIdle(context)
      }
      await runCase(id, context)
      emit(i, { status: 'pass', error: undefined })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      emit(i, { status: 'fail', error: message })
    }
  }

  return results
}

/** Convenience alias for the canvas/chat suite. */
export const runCanvasChatSuite = (context: SuiteRunContext) =>
  runTrainerSuite('canvasChat', context)
