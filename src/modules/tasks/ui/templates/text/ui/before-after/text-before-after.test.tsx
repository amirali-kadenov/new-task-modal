import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTextTemplate } from '../../lib/classify-text-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { TextTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { TextBeforeAfter as Template } from '.'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../lib/testing/mocks/math-formula'),
)

const task = { ...(fixture as unknown as TextTask), solution: null }

describe('text.beforeAfter', () => {
  it('фикстура классифицируется в text.beforeAfter', () => {
    expect(classifyTextTemplate(task)).toBe('text.beforeAfter')
  })

  it('один input (before/after layout)', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('42') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it('solution показывает ответ рядом с layout', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('6') })

    expect(screen.getAllByTestId('math-formula').some((el) => el.textContent === '6')).toBe(true)
  })
})
