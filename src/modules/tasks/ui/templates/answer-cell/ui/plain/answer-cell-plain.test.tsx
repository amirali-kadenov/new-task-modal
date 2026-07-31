import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyAnswerCellTemplate } from '../../lib/classify-answer-cell-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { AnswerCellTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { AnswerCellPlain as Template } from '.'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../text/lib/testing/mocks/math-formula'),
)

const task = { ...(fixture as unknown as AnswerCellTask), solution: null }

describe('answerCell.plain', () => {
  it('фикстура классифицируется в answerCell.plain', () => {
    expect(classifyAnswerCellTemplate(task)).toBe('answerCell.plain')
  })

  it('один MathInput в interleave-row', () => {
    renderTemplate(Template, task)

    expect(screen.getByTestId('answer-cell-row')).toHaveAttribute(
      'data-cell-count',
      '1',
    )
    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()
    expect(screen.queryByTestId('text-suffix')).not.toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('16627') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
