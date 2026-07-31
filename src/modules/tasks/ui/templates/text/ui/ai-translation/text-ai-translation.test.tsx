import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Translation } from '@/types/api/task'

import { classifyTextTemplate } from '../../lib/classify-text-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { TextTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { TextAiTranslation as Template } from '.'

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

describe('text.aiTranslation', () => {
  it('фикстура классифицируется в text.aiTranslation', () => {
    expect(classifyTextTemplate(task)).toBe('text.aiTranslation')
  })

  it('один input, answerInput показан как суффикс', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()

    const suffix = screen.getByTestId('text-suffix')
    expect(suffix).toHaveTextContent(
      new RegExp((task.answerInput as Translation).rus),
    )
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('b + 20') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it('solution показывает суффикс из answerInput рядом с ответом', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('c + 23') })

    expect(screen.getByTestId('text-suffix')).toHaveTextContent(
      new RegExp((task.answerInput as Translation).rus),
    )
    expect(screen.getAllByTestId('math-formula').some((el) => el.textContent === 'c + 23')).toBe(true)
  })
})
