import { render } from '@testing-library/react'
import type { ComponentType } from 'react'
import { vi } from 'vitest'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  makeDeps,
  makeTranslation,
} from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import type { EquationTask } from '../types.task'

export { makeDeps, makeTranslation }

export const makeTemplateProps = (
  task: EquationTask,
  overrides: Partial<TaskComponentProps<EquationTask>> = {},
): TaskComponentProps<EquationTask> => ({
  task,
  deps: makeDeps(),
  answer: '',
  onChange: vi.fn(),
  mathInput: { current: new Map() },
  ...overrides,
})

export const renderTemplate = (
  Template: ComponentType<TaskComponentProps<EquationTask>>,
  task: EquationTask,
  overrides: Partial<TaskComponentProps<EquationTask>> = {},
) => render(<Template {...makeTemplateProps(task, overrides)} />)

export const makeSolution = (answerRus: string) => ({
  type: 'formula' as const,
  answer: makeTranslation(answerRus),
  content: makeTranslation('Потому что.'),
})
