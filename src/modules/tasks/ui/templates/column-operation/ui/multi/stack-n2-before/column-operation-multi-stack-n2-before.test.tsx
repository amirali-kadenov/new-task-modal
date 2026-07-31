import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyColumnOperationTemplate } from '../../../lib/classify-column-operation-template'
import { makeSolution, renderTemplate } from '../../../lib/testing/test-utils'
import type { ColumnOperationTask } from '../../../lib/types.task'

import fixture from './data/task.json'

import { ColumnOperationMultiStackN2Before as Template } from '.'

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

const task = { ...(fixture as unknown as ColumnOperationTask), solution: null }

describe('columnOperation.multi.stack.n2.before', () => {
  it('фикстура классифицируется в multi.stack.n2.before', () => {
    expect(classifyColumnOperationTemplate(task)).toBe(
      'columnOperation.multi.stack.n2.before',
    )
  })

  it('2 input столбиком с before', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(2)
    expect(screen.getByTestId('text-inputs').dataset.layout).toBe('stack')
    expect(screen.getAllByTestId('text-prefix').length).toBeGreaterThan(0)
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('1;;2') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
    expect(screen.getByTestId('text-inputs').dataset.layout).toBe('stack')
  })
})
