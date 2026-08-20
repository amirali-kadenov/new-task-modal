import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTextTemplate } from '../../lib/classify-text-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { TextTask } from '../../lib/types.task'

import fixture from './data/task.json'

import { TextAfter as Template } from '.'

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

describe('text.after', () => {
  it('фикстура классифицируется в text.after', () => {
    expect(classifyTextTemplate(task)).toBe('text.after')
  })

  it('один input с суффиксом, без префикса', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.queryByTestId('text-prefix')).not.toBeInTheDocument()

    const suffix = screen.getByTestId('text-suffix')
    expect(suffix.textContent?.trim()).not.toBe('')
  })

  it('normalizeBareMath оборачивает bare unit^n в суффиксе', () => {
    renderTemplate(Template, {
      ...task,
      answerInput: {
        ...(task.answerInput as object),
        after: {
          with_audio_player: false,
          rus: 'мм^2',
          kaz: 'мм^2',
          eng: 'mm^2',
          aze: '',
          arsa: '',
          areg: '',
          kgz: '',
          uzb: '',
          module_name: 'Elixir.Helpers.Translation',
        },
      },
    } as TextTask)

    expect(screen.getByTestId('text-suffix')).toHaveTextContent(
      /\\\(\\mathrm\{мм\}\^\{2\}\\\)/,
    )
  })

  it('solution-ветка вместо режима ввода', () => {
    const fixtureTask = fixture as unknown as TextTask
    renderTemplate(Template, {
      ...task,
      solution: fixtureTask.solution ?? makeSolution('1333'),
    })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it('solution показывает суффикс рядом с ответом', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('1333') })

    expect(screen.getByTestId('text-suffix')).toBeInTheDocument()
    expect(
      screen
        .getAllByTestId('math-formula')
        .some((el) => el.textContent === '1333'),
    ).toBe(true)
  })
})
