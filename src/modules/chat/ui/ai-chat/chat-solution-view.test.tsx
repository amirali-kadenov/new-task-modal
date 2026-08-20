import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeSolution } from '@/modules/tasks/ui/templates/complex/lib/testing/test-utils'
import type { ComplexTask } from '@/modules/tasks/ui/templates/complex/lib/types.task'
import { makeDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import type { Task } from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'

import answerCellGroups from '../../../tasks/ui/templates/answer-cell/ui/after/data/groups.json'
import groups from '../../../tasks/ui/templates/complex/ui/after-equation/data/groups.json'
import formulaGroups from '../../../tasks/ui/templates/formula/ui/plain/data/groups.json'

import { ChatSolutionView } from './chat-solution-view'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../tasks/ui/templates/text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../tasks/ui/templates/text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () =>
    import('../../../tasks/ui/templates/text/lib/testing/mocks/math-formula'),
)

const complex5 = (groups as Array<{ group: string; task: ComplexTask }>).find(
  (g) => g.group === 'complex_5',
)

describe('ChatSolutionView: complex-type condition', () => {
  it('renders "Условие" with the equation for a complex-type task (no solution yet)', () => {
    expect(complex5).toBeDefined()
    const task = {
      ...complex5!.task,
      solution: null,
    } as unknown as Task<TaskDescriptionType>

    render(<ChatSolutionView task={task} deps={makeDeps()} answer="" />)

    expect(screen.getByText('Условие')).toBeInTheDocument()
    // task.title renders once, under "Условие" — not duplicated elsewhere.
    expect(
      screen.getByText('Выразите в указанной единице измерения.'),
    ).toBeInTheDocument()
    const mathTexts = screen.getAllByTestId('math-text')
    const joined = mathTexts.map((el) => el.textContent ?? '').join(' ')
    expect(joined).toMatch(/дм/)
    expect(joined).toMatch(/см/)
  })

  it('fills the answer into the condition when a solution is present', () => {
    expect(complex5).toBeDefined()
    const task = {
      ...complex5!.task,
      solution: makeSolution('4000'),
    } as unknown as Task<TaskDescriptionType>

    render(<ChatSolutionView task={task} deps={makeDeps()} answer="4000" />)

    expect(screen.getByText('Условие')).toBeInTheDocument()
    expect(screen.getAllByText(/4000/).length).toBeGreaterThan(0)
  })
})

describe('ChatSolutionView: formula-type', () => {
  it('renders "22 \\approx" condition and "20" answer without leaking raw LaTeX (formula_2, chat regression for Block E bug 3)', () => {
    const formula2 = (
      formulaGroups as unknown as Array<{ group: string; task: unknown }>
    ).find((g) => g.group === 'formula_2')
    expect(formula2).toBeDefined()

    const task = formula2!.task as Task<TaskDescriptionType>

    render(<ChatSolutionView task={task} deps={makeDeps()} answer="20" />)

    // Condition renders through the mocked MathText, unwrapped/unmangled.
    const mathTexts = screen.getAllByTestId('math-text')
    const joined = mathTexts.map((el) => el.textContent ?? '').join(' ')
    expect(joined).toMatch(/22 \\approx/)
    // No double-wrapped delimiters anywhere in the rendered output.
    expect(joined).not.toMatch(/\\\(\\\(/)
    expect(joined).not.toMatch(/\\\)\\\)/)

    // Correct answer ("20") reaches the answer panel intact.
    expect(screen.getByText('Верный ответ:')).toBeInTheDocument()
    expect(screen.getAllByText(/20/).length).toBeGreaterThan(0)
  })
})

describe('ChatSolutionView: answerCell-type condition unit adornment', () => {
  it('renders the answerInput.after unit next to the answer (answerCell_10)', () => {
    const answerCell10 = (
      answerCellGroups as Array<{ group: string; task: unknown }>
    ).find((g) => g.group === 'answerCell_10')
    expect(answerCell10).toBeDefined()

    const task = answerCell10!.task as Task<TaskDescriptionType>

    render(<ChatSolutionView task={task} deps={makeDeps()} answer="124214" />)

    expect(screen.getByTestId('answer-cell-row')).toBeInTheDocument()
    const suffix = screen.getByTestId('text-suffix')
    expect(suffix).toHaveTextContent('л')
  })

  it('appends the unit to "Ваш ответ"/"Верный ответ" too, not just the condition row', () => {
    const answerCell10 = (
      answerCellGroups as Array<{ group: string; task: unknown }>
    ).find((g) => g.group === 'answerCell_10')
    expect(answerCell10).toBeDefined()

    const task = answerCell10!.task as Task<TaskDescriptionType>

    render(<ChatSolutionView task={task} deps={makeDeps()} answer="124214" />)

    expect(screen.getByText('124214')).toBeInTheDocument()
    expect(screen.getByText('\\(131\\)')).toBeInTheDocument()
    // Separate sibling node, not concatenated into the MathFormula/MathText
    // string (Cyrillic text inside `\(...\)` renders italicized/broken).
    const units = screen.getAllByTestId('answer-unit')
    expect(units).toHaveLength(2)
    for (const unit of units) {
      expect(unit).toHaveTextContent('л')
    }
  })
})
