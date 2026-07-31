import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTestTemplate } from '../../lib/classify-test-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { TestTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { TestPlain as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../text/lib/testing/mocks/math-formula'),
)

const task = { ...(fixture as unknown as TestTask), solution: null }

describe('test.plain', () => {
  it('фикстура классифицируется в test.plain', () => {
    expect(classifyTestTemplate(task)).toBe('test.plain')
  })

  it('вопрос + 4 radio options', () => {
    renderTemplate(Template, {
      ...task,
      description: { ...task.description, questionAlign: 'left' },
    })

    const question =
      typeof task.description.question === 'string'
        ? task.description.question
        : (task.description.question as { rus?: string } | null)?.rus ?? ''
    const firstVariant = task.description.variants?.[0]
    const firstLabel =
      typeof firstVariant === 'string'
        ? firstVariant
        : (firstVariant as { rus?: string } | undefined)?.rus ?? ''

    expect(screen.getByTestId('test-question')).toHaveTextContent(question)
    expect(screen.getByTestId('test-question')).toHaveStyle({
      textAlign: 'left',
    })
    expect(screen.getAllByRole('radio')).toHaveLength(4)
    expect(screen.getByText(firstLabel)).toBeInTheDocument()
  })

  it('выбор варианта вызывает onChange с буквой', () => {
    const onChange = vi.fn()
    renderTemplate(Template, task, { onChange })

    const firstVariant = task.description.variants?.[0]
    const firstLabel =
      typeof firstVariant === 'string'
        ? firstVariant
        : (firstVariant as { rus?: string } | undefined)?.rus ?? ''

    fireEvent.click(screen.getByLabelText(firstLabel))
    expect(onChange).toHaveBeenCalledWith('A')
  })

  it('solution-ветка показывает правильный ответ', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('B') })

    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
    const correct = screen.getByDisplayValue('B')
    expect(correct).toBeChecked()
    expect(correct).toBeDisabled()
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled()
    }
  })

  it('SVG-варианты рендерятся как svg, не как текст', () => {
    const svgA =
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="10"/></svg>'
    const svgB =
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="20" height="20"/></svg>'
    const svgTask: TestTask = {
      ...task,
      description: {
        ...task.description,
        variants: [
          svgA,
          svgB,
        ] as unknown as TestTask['description']['variants'],
        question: null as unknown as TestTask['description']['question'],
      },
      title: {
        ...(typeof task.title === 'object' ? task.title : {}),
        rus: 'У какой окружности закрашено больше частей?',
      } as TestTask['title'],
    }

    const { container } = renderTemplate(Template, svgTask)

    expect(container.querySelectorAll('svg')).toHaveLength(2)
    expect(container).not.toHaveTextContent('<svg')
    expect(screen.getByLabelText('A')).toBeInTheDocument()
    expect(screen.getByLabelText('B')).toBeInTheDocument()
  })
})
