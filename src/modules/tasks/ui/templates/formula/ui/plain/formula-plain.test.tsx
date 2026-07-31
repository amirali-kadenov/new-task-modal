import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyFormulaTemplate } from '../../lib/classify-formula-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { FormulaTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { FormulaPlain as Template } from '.'

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

const task = { ...(fixture as unknown as FormulaTask), solution: null }

describe('formula.plain', () => {
  it('фикстура классифицируется в formula.plain', () => {
    expect(classifyFormulaTemplate(task)).toBe('formula.plain')
  })

  it('формула рядом с одним input, без подписей', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()
    expect(screen.queryByTestId('text-suffix')).not.toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('10003') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
