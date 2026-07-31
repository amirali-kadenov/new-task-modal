import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyColumnOperationTemplate } from '../../lib/classify-column-operation-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { ColumnOperationTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { ColumnOperationPlain as Template } from '.'

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

const task = { ...(fixture as unknown as ColumnOperationTask), solution: null }

describe('columnOperation.plain', () => {
  it('фикстура классифицируется в columnOperation.plain', () => {
    expect(classifyColumnOperationTemplate(task)).toBe('columnOperation.plain')
  })

  it('один input без подписей', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()
    expect(screen.queryByTestId('text-suffix')).not.toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('84632') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
