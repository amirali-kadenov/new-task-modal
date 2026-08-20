import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyComplexTemplate } from '../../../lib/classify-complex-template'
import { makeSolution, renderTemplate } from '../../../lib/testing/test-utils'
import type { ComplexTask } from '../../../lib/types.task'

import fixture from './data/task.json'

import { ComplexMultiStackN2BeforeAfter as Template } from '.'

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

const task = { ...(fixture as unknown as ComplexTask), solution: null }

describe('complex.multi.stack.n2.beforeAfter', () => {
  it('фикстура классифицируется в complex.multi.stack.n2.beforeAfter', () => {
    expect(classifyComplexTemplate(task)).toBe(
      'complex.multi.stack.n2.beforeAfter',
    )
  })

  it('два input + prefix/suffix; AngleList рендерится', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(2)
    expect(screen.getAllByTestId('text-prefix').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('text-suffix').length).toBeGreaterThan(0)
    expect(
      screen.getByTestId('complex-coordinate-plane-part'),
    ).toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, {
      ...task,
      solution: makeSolution('40;;50'),
    })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
