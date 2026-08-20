import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyComplexTemplate } from '../../lib/classify-complex-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { ComplexTask } from '../../lib/types.task'
import { ComplexAfterEquation as Template } from '../../ui/after-equation'
import groups from '../../ui/after-equation/data/groups.json'

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

const complex5 = (groups as Array<{ group: string; task: ComplexTask }>).find(
  (g) => g.group === 'complex_5',
)

describe('complex_5 equation table', () => {
  it('classifies as complex.after.equation', () => {
    expect(complex5).toBeDefined()
    expect(classifyComplexTemplate(complex5!.task)).toBe(
      'complex.after.equation',
    )
  })

  it('renders unit labels and equation MathInput when isAnswerCellHidden', () => {
    expect(complex5).toBeDefined()
    const task = {
      ...complex5!.task,
      solution: null,
    } as ComplexTask

    renderTemplate(Template, task)

    expect(screen.getByTestId('complex-equation-part')).toBeInTheDocument()
    expect(screen.getByTestId('math-input')).toBeInTheDocument()
    expect(screen.queryByTestId('text-suffix')).not.toBeInTheDocument()

    const mathTexts = screen.getAllByTestId('math-text')
    const joined = mathTexts.map((el) => el.textContent ?? '').join(' ')
    expect(joined).toMatch(/дм/)
    expect(joined).toMatch(/см/)
    expect(joined).not.toMatch(/\\\(\\s*\\\)/)

    // Equation row is plain flex markup, not a <table>.
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByTestId('math-input').className).toMatch(/input/)
  })

  it('fills answercell with correct answer in solution (not empty span)', () => {
    expect(complex5).toBeDefined()
    const task = {
      ...complex5!.task,
      solution: makeSolution('4000'),
    } as ComplexTask

    renderTemplate(Template, task)

    expect(screen.getByTestId('complex-equation-part')).toBeInTheDocument()
    expect(
      screen.queryByTestId('complex-table-answercell-empty'),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()

    const part = screen.getByTestId('complex-equation-part')
    expect(part).toHaveTextContent(/4000/)
    expect(part).toHaveTextContent(/дм/)
    expect(part).toHaveTextContent(/см/)
  })
})
