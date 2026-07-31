import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTextTemplate } from '../../lib/classify-text-template'
import {
  makeSolution,
  makeTranslation,
  renderTemplate,
} from '../../lib/testing/test-utils'
import type { TextTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { TextPlain as Template } from '.'

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

describe('text.plain', () => {
  it('фикстура классифицируется в text.plain', () => {
    expect(classifyTextTemplate(task)).toBe('text.plain')
  })

  it('один input без подписей', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()
    expect(screen.queryByTestId('text-suffix')).not.toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('70000') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it('размечает голый LaTeX ответа делимитерами (text_18)', () => {
    renderTemplate(Template, {
      ...task,
      solution: makeSolution('(y+a)\\cdot 58'),
    })

    expect(
      screen
        .getAllByTestId('math-text')
        .some((el) => el.textContent === '\\((y+a)\\cdot 58\\)'),
    ).toBe(true)
  })

  it('не оборачивает смешанный текст решения в math-formula', () => {
    const solution = {
      ...makeSolution('481'),
      content: makeTranslation(
        'Рабочий изготовил \\(z\\) коробок.\\(\\\\\\)Здесь \\(z\\) = 37.',
      ),
    }

    renderTemplate(Template, { ...task, solution })

    expect(screen.queryByTestId('math-formula')).not.toBeInTheDocument()
    expect(screen.getByText(/Рабочий изготовил/)).toBeInTheDocument()
    expect(screen.getByText(/Здесь \\\(z\\\) = 37\./)).toBeInTheDocument()
    expect(screen.queryByText('\\(\\\\\\)')).not.toBeInTheDocument()
  })
})
