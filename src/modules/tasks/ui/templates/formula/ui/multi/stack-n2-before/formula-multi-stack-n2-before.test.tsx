import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyFormulaTemplate } from '../../../lib/classify-formula-template'
import { makeSolution, renderTemplate } from '../../../lib/testing/test-utils'
import type { FormulaTask } from '../../../lib/types.task'

import fixture from './data/task.json'

import { FormulaMultiStackN2Before as Template } from '.'

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

const task = { ...(fixture as unknown as FormulaTask), solution: null }

describe('formula.multi.stack.n2.before', () => {
  it('фикстура классифицируется в formula.multi.stack.n2.before', () => {
    expect(classifyFormulaTemplate(task)).toBe(
      'formula.multi.stack.n2.before',
    )
  })

  it('2 input столбиком с before', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(2)
    expect(screen.getByTestId('text-inputs').dataset.layout).toBe('stack')
    expect(screen.getAllByTestId('text-prefix').length).toBeGreaterThan(0)
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('9;;1') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
    expect(screen.getByTestId('text-inputs').dataset.layout).toBe('stack')
  })
})
