import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyAnswerCellTemplate } from '../../../lib/classify-answer-cell-template'
import { makeSolution, renderTemplate } from '../../../lib/testing/test-utils'
import type { AnswerCellTask } from '../../../lib/types.task'

import fixture from './data/task.json'

import { AnswerCellMultiInlineN2Plain as Template } from '.'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../../text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../../text/lib/testing/mocks/math-formula'),
)

const task = { ...(fixture as unknown as AnswerCellTask), solution: null }

describe('answerCell.multi.inline.n2.plain', () => {
  it('фикстура классифицируется в answerCell.multi.inline.n2.plain', () => {
    expect(classifyAnswerCellTemplate(task)).toBe(
      'answerCell.multi.inline.n2.plain',
    )
  })

  it('два MathInput в interleave-row', () => {
    renderTemplate(Template, task)

    expect(screen.getByTestId('answer-cell-row')).toHaveAttribute(
      'data-cell-count',
      '2',
    )
    expect(screen.getAllByTestId('math-input')).toHaveLength(2)
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, {
      ...task,
      solution: makeSolution('100;;274'),
    })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
