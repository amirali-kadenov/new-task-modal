import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyComparisonTemplate } from '../../lib/classify-comparison-template'
import { makeSolution, makeTranslation, renderTemplate } from '../../lib/testing/test-utils'
import type { ComparisonTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { ComparisonPlain as Template } from '.'

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

const task = { ...(fixture as unknown as ComparisonTask), solution: null }

describe('comparison.plain', () => {
  it('фикстура классифицируется в comparison.plain', () => {
    expect(classifyComparisonTemplate(task)).toBe('comparison.plain')
  })

  it('first | input | second', () => {
    renderTemplate(Template, task)

    expect(screen.getByTestId('comparison-row')).toBeInTheDocument()
    expect(screen.getByTestId('comparison-first')).toHaveTextContent(
      String(task.description.first),
    )
    expect(screen.getByTestId('comparison-second')).toHaveTextContent(
      String(task.description.second),
    )
    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
  })

  it('Translation sides форматируются', () => {
    renderTemplate(Template, {
      ...task,
      description: {
        ...task.description,
        first: makeTranslation('9000065'),
        second: makeTranslation('9000056'),
      },
    })

    expect(screen.getByTestId('comparison-first')).toHaveTextContent('9000065')
    expect(screen.getByTestId('comparison-second')).toHaveTextContent(
      '9000056',
    )
  })

  it('единицы в math-островах через mathrm', () => {
    renderTemplate(Template, {
      ...task,
      description: {
        ...task.description,
        first: makeTranslation('3 \\(см^3\\)'),
        second: makeTranslation('3000 \\(мм^3\\)'),
      },
    })

    expect(screen.getByTestId('comparison-first')).toHaveTextContent(
      '3 \\(\\mathrm{см}^{3}\\)',
    )
    expect(screen.getByTestId('comparison-second')).toHaveTextContent(
      '3000 \\(\\mathrm{мм}^{3}\\)',
    )
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('>') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
