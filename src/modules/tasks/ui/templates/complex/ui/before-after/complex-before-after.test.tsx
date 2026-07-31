import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyComplexTemplate } from '../../lib/classify-complex-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { ComplexTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { ComplexBeforeAfter as Template } from '.'

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

describe('complex.beforeAfter', () => {
  it('фикстура классифицируется в complex.beforeAfter', () => {
    expect(classifyComplexTemplate(task)).toBe('complex.beforeAfter')
  })

  it('prefix + input + suffix; NumberLine рендерится', () => {
    renderTemplate(Template, task)

    expect(screen.getByTestId('math-input')).toBeInTheDocument()
    expect(screen.getByTestId('text-prefix')).toBeInTheDocument()
    expect(screen.getByTestId('text-suffix')).toBeInTheDocument()
    expect(document.querySelector('[data-figure-type]')).toBeTruthy()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('3') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
