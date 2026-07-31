import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyAnswerCellTemplate } from '../../lib/classify-answer-cell-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { AnswerCellTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { AnswerCellAfter as Template } from '.'

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

describe('answerCell.after', () => {
  it('фикстура классифицируется в answerCell.after', () => {
    expect(classifyAnswerCellTemplate(task)).toBe('answerCell.after')
  })

  it('один input + суффикс', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()
    expect(screen.getByTestId('text-suffix')).toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('20000') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
