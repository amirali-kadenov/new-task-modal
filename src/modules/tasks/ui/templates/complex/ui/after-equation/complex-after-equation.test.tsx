import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyComplexTemplate } from '../../lib/classify-complex-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { ComplexTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { ComplexAfterEquation as Template } from '.'

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

const task = { ...(fixture as unknown as ComplexTask), solution: null }

describe('complex.after.equation', () => {
  it('фикстура классифицируется в complex.after.equation', () => {
    expect(classifyComplexTemplate(task)).toBe('complex.after.equation')
  })

  it('equation MathInput; нижний суффикс скрыт', () => {
    renderTemplate(Template, task)

    expect(screen.getByTestId('complex-equation-part')).toBeInTheDocument()
    expect(screen.getByTestId('math-input')).toBeInTheDocument()
    expect(screen.queryByTestId('text-suffix')).not.toBeInTheDocument()
  })

  it('solution-ветка заполняет answercell', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('4000') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
    expect(screen.getByTestId('complex-equation-part')).toHaveTextContent(
      /4000/,
    )
  })
})
