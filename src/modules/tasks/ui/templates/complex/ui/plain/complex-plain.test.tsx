import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyComplexTemplate } from '../../lib/classify-complex-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { ComplexTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { ComplexPlain as Template } from '.'

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

describe('complex.plain', () => {
  it('фикстура классифицируется в complex.plain', () => {
    expect(classifyComplexTemplate(task)).toBe('complex.plain')
  })

  it('parts + один input без adornments', () => {
    renderTemplate(Template, task)

    expect(screen.getByTestId('complex-description')).toBeInTheDocument()
    expect(screen.getByTestId('math-input')).toBeInTheDocument()
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()
    expect(screen.queryByTestId('text-suffix')).not.toBeInTheDocument()
    expect(document.querySelector('[data-figure-type]')).toBeTruthy()
  })

  it('text-only parts: выражение и input в одной строке', () => {
    renderTemplate(Template, task)

    const row = screen.getByTestId('complex-expression-row')
    expect(row).toHaveAttribute('data-layout', 'inline')
    expect(row).toContainElement(screen.getByTestId('complex-description'))
    expect(row).toContainElement(screen.getByTestId('math-input'))
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('4') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()

    const row = screen.getByTestId('complex-expression-row')
    expect(row).toHaveAttribute('data-layout', 'inline')
    expect(row).toContainElement(screen.getByTestId('complex-description'))
  })
})
