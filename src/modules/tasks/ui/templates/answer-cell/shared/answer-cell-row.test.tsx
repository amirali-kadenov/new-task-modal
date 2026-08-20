import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeDeps, makeTranslation } from '../lib/testing/test-utils'
import type { AnswerCellTaskDescription } from '../lib/types.task'

import { AnswerCellRow } from './answer-cell-row'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../text/lib/testing/mocks/math-text'),
)

describe('AnswerCellRow', () => {
  it('показывает единицу измерения после пустого math-острова (реальный API-контент)', () => {
    const description: AnswerCellTaskDescription = {
      type: 'answerCell',
      content: makeTranslation(
        '68 л - 55315 мл = \\( \\ \\) answercell \\( \\ \\) мл',
      ),
    }

    render(
      <AnswerCellRow
        description={description}
        deps={makeDeps()}
        answer=""
        mode="input"
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByTestId('math-input')).toBeInTheDocument()

    const segments = screen.getAllByTestId('math-text')
    expect(segments.some((el) => el.textContent?.trim() === 'мл')).toBe(true)
    expect(segments.every((el) => !el.textContent?.includes('\\('))).toBe(true)
  })
})
