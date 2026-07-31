import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTableTemplate } from '../../lib/classify-table-template'
import {
  countAnswerCells,
  makeSolution,
  makeTranslation,
  renderTemplate,
} from '../../lib/testing/test-utils'
import type { TableTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { TablePlain as Template } from '.'

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

const svgMarkup =
  '<svg version="1.1" width="50px" height="50px" viewBox="0 0 150 150"><circle cx="75" cy="75" r="70"/></svg>'

describe('table.plain', () => {
  it('фикстура классифицируется в table.plain', () => {
    expect(classifyTableTemplate(task)).toBe('table.plain')
  })

  it('рендерит MathInput по числу answercell', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(
      countAnswerCells(task),
    )
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('35404') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it('SVG-ячейка рендерится как HTML, не как текст', () => {
    const withSvg: TableTask = {
      ...task,
      description: {
        ...task.description,
        table: {
          ...task.description.table!,
          removeBorders: false,
          rows: [
            {
              cells: [
                makeTranslation('Велосипедное колесо'),
                makeTranslation('Радиус'),
              ],
            },
            {
              cells: [svgMarkup, 'answercell'],
            },
          ],
        },
      },
    }

    const { container } = renderTemplate(Template, withSvg)

    expect(screen.getByTestId('table-html-cell')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeTruthy()
    expect(screen.queryByText(/<svg version/)).not.toBeInTheDocument()
  })

  it('removeBorders вешает модификатор на table', () => {
    const borderless: TableTask = {
      ...task,
      description: {
        ...task.description,
        table: {
          ...task.description.table!,
          removeBorders: true,
          removePadding: true,
          rows: [
            {
              cells: ['10000 · 4 = ', 'answercell'],
            },
          ],
        },
      },
    }

    renderTemplate(Template, borderless)

    const table = screen.getByTestId('task-table')
    expect(table.className).toMatch(/tableRemoveBorders/)
    expect(table.className).toMatch(/tableRemovePadding/)
  })
})
