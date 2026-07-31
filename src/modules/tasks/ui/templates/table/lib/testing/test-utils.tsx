import { render } from '@testing-library/react'
import type { ComponentType } from 'react'
import { vi } from 'vitest'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  makeDeps,
  makeTranslation,
} from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import type { TableTask } from '../types.task'

export { makeDeps, makeTranslation }

export const makeTemplateProps = (
  task: TableTask,
  overrides: Partial<TaskComponentProps<TableTask>> = {},
): TaskComponentProps<TableTask> => ({
  task,
  deps: makeDeps(),
  answer: '',
  onChange: vi.fn(),
  mathInput: { current: new Map() },
  ...overrides,
})

export const renderTemplate = (
  Template: ComponentType<TaskComponentProps<TableTask>>,
  task: TableTask,
  overrides: Partial<TaskComponentProps<TableTask>> = {},
) => render(<Template {...makeTemplateProps(task, overrides)} />)

export const makeSolution = (answerRus: string) => ({
  type: 'table' as const,
  answer: makeTranslation(answerRus),
  content: makeTranslation('Потому что.'),
})

export const countAnswerCells = (task: TableTask): number => {
  let count = 0
  for (const row of task.description.table?.rows ?? []) {
    for (const cell of row.cells ?? []) {
      if (cell === 'answercell') count += 1
    }
  }
  return count
}
