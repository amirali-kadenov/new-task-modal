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

  it('"Ваш ответ" не содержит служебные \\( \\) из wire-формата бэкенда', () => {
    renderTemplate(
      Template,
      { ...task, solution: makeSolution('100;;274') },
      { answer: '\\(124;;17\\)' },
    )

    const userAnswer = screen.getByTestId('user-answer-highlight')
    expect(userAnswer).not.toHaveTextContent(/[\\()]/)
    expect(userAnswer).toHaveTextContent(/124/)
    expect(userAnswer).toHaveTextContent(/17/)
  })

  it('прячет строку с correct-ответом при "\\(\\)"-плейсхолдере (как реально шлёт Task_4_6_2_22 — solution.answer всегда `Latex.exp("")`, а не a1/a2)', () => {
    renderTemplate(Template, {
      ...task,
      solution: makeSolution('\\(\\)'),
    })

    expect(screen.queryByTestId('answer-cell-row')).not.toBeInTheDocument()
    expect(screen.queryByText(/Правильный ответ/)).not.toBeInTheDocument()
  })
})
