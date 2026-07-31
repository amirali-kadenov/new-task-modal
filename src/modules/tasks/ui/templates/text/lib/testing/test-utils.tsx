import { render } from '@testing-library/react'
import type { ComponentType } from 'react'
import { vi } from 'vitest'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  makeDeps,
  makeTranslation,
} from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import type { TextTask } from '../types.task'

export { makeDeps, makeTranslation }

export const makeTemplateProps = (
  task: TextTask,
  overrides: Partial<TaskComponentProps<TextTask>> = {},
): TaskComponentProps<TextTask> => ({
  task,
  deps: makeDeps(),
  answer: '',
  onChange: vi.fn(),
  mathInput: { current: new Map() },
  ...overrides,
})

export const renderTemplate = (
  Template: ComponentType<TaskComponentProps<TextTask>>,
  task: TextTask,
  overrides: Partial<TaskComponentProps<TextTask>> = {},
) => render(<Template {...makeTemplateProps(task, overrides)} />)

/** Активный solution для smoke-теста solution-ветки. */
export const makeSolution = (answerRus: string) => ({
  type: 'text' as const,
  answer: makeTranslation(answerRus),
  content: makeTranslation('Потому что.'),
})
