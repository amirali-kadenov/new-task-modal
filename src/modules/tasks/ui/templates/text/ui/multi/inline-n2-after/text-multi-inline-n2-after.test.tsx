import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTextTemplate } from '../../../lib/classify-text-template'
import { makeSolution, renderTemplate } from '../../../lib/testing/test-utils'
import type { TextTask } from '../../../lib/types.task'

import fixture from './data/task.json'

import { TextMultiInlineN2After as Template } from '.'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../lib/testing/mocks/math-formula'),
)

const task = { ...(fixture as unknown as TextTask), solution: null }

describe('text.multi.inline.n2.after', () => {
  it('фикстура классифицируется в text.multi.inline.n2.after', () => {
    expect(classifyTextTemplate(task)).toBe('text.multi.inline.n2.after')
  })

  it('2 input в одну строку с суффиксами', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(2)
    expect(screen.getByTestId('text-inputs').dataset.layout).toBe('inline')
    expect(screen.getAllByTestId('text-suffix').length).toBeGreaterThan(0)
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('1;2') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
    expect(screen.getByTestId('text-inputs').dataset.layout).toBe('inline')
    expect(screen.getAllByTestId('text-suffix').length).toBeGreaterThan(0)
  })
})
