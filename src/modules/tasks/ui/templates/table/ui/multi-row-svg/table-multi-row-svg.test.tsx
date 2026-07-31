import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTableTemplate } from '../../lib/classify-table-template'
import {
  countAnswerCells,
  makeSolution,
  renderTemplate,
} from '../../lib/testing/test-utils'
import type { TableTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { TableMultiRowSvg as Template } from '.'

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

const task = { ...(fixture as unknown as TableTask), solution: null }

describe('table.multiRowSvg', () => {
  it('фикстура классифицируется в table.multiRowSvg', () => {
    expect(classifyTableTemplate(task)).toBe('table.multiRowSvg')
  })

  it('рендерит MathInput по числу answercell', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(
      countAnswerCells(task),
    )
  })

  it('SVG-ячейка рендерится как HTML, не как текст', () => {
    const { container } = renderTemplate(Template, task)

    expect(screen.getAllByTestId('table-html-cell').length).toBeGreaterThan(0)
    expect(container.querySelector('svg')).toBeTruthy()
    expect(screen.queryByText(/<svg version/)).not.toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, {
      ...task,
      solution: makeSolution('24;;13;;40'),
    })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })
})
