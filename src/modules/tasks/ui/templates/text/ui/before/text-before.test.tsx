import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTextTemplate } from '../../lib/classify-text-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { TextTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { TextBefore as Template } from '.'

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

describe('text.before', () => {
  it('фикстура классифицируется в text.before', () => {
    expect(classifyTextTemplate(task)).toBe('text.before')
  })

  it('один input с префиксом, без суффикса', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('text-suffix')).not.toBeInTheDocument()

    const prefix = screen.getByTestId('text-prefix')
    expect(prefix.textContent?.trim()).not.toBe('')
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('42') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it('solution показывает префикс рядом с ответом', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('42') })

    expect(screen.getByTestId('text-prefix')).toHaveTextContent(/x/)
    expect(screen.getAllByTestId('math-formula').some((el) => el.textContent === '42')).toBe(true)
  })
})
