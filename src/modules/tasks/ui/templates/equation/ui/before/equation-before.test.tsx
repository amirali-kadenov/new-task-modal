import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyEquationTemplate } from '../../shared/lib/classify-equation-template'
import {
  makeSolution,
  renderTemplate,
} from '../../shared/lib/testing/test-utils'
import type { EquationTask } from '../../shared/lib/types.task'

import fixture from './data/task.json'

import { EquationBefore as Template } from '.'

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

const task = { ...(fixture as unknown as EquationTask), solution: null }

describe('equation.before', () => {
  it('фикстура классифицируется в equation.before', () => {
    expect(classifyEquationTemplate(task)).toBe('equation.before')
  })

  it('content + before + один input', () => {
    renderTemplate(Template, task)

    const content =
      typeof task.description.content === 'string'
        ? task.description.content
        : (task.description.content as { rus?: string }).rus ?? ''
    const before =
      typeof task.answerInput?.before === 'string'
        ? task.answerInput.before
        : ((task.answerInput?.before as { rus?: string } | undefined)?.rus ??
          '')

    expect(screen.getByTestId('equation-content')).toHaveTextContent(content)
    expect(screen.getByTestId('equation-before')).toHaveTextContent(before)
    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('equation-after')).not.toBeInTheDocument()
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('1722') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
    expect(screen.getByTestId('equation-answer-row')).toHaveTextContent('1722')
  })
})
