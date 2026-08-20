import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LongDivisionSteps } from './long-division-steps'

vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../text/lib/testing/mocks/math-formula'),
)

describe('LongDivisionSteps', () => {
  it('renders just the corner (no step rows) when the dividend is smaller than the divisor', () => {
    render(<LongDivisionSteps dividend={3} divisor={7} />)

    const values = screen
      .getAllByTestId('math-formula')
      .map((el) => el.textContent)
    // dividend, divisor, quotient(0) — no bring-down/subtract/remainder rows
    expect(values).toEqual(['3', '7', '0'])
  })

  it('renders the reference case (78466 / 2, exact) with remainder shown even when 0', () => {
    render(<LongDivisionSteps dividend={78466} divisor={2} />)

    const values = screen
      .getAllByTestId('math-formula')
      .map((el) => el.textContent)

    expect(values).toEqual([
      // dividend, divisor, quotient
      '78466',
      '2',
      '39233',
      // per step: [bring-down (if any), subtrahend]
      '6', // step 0: no bring-down, just subtract
      '18',
      '18',
      '04',
      '4',
      '06',
      '6',
      '06',
      '6',
      // remainder — shown even though it's exact (0)
      '0',
    ])
  })

  it('renders the production case (86809 / 2) with a nonzero remainder', () => {
    render(<LongDivisionSteps dividend={86809} divisor={2} />)

    const values = screen
      .getAllByTestId('math-formula')
      .map((el) => el.textContent)

    expect(values).toEqual([
      '86809',
      '2',
      '43404',
      '8', // step 0: no bring-down, just subtract
      '06',
      '6',
      '08',
      '8',
      '00',
      '0',
      '09',
      '8',
      '1',
    ])
  })

  it('indents each step by its digit position', () => {
    render(<LongDivisionSteps dividend={78466} divisor={2} />)

    const groups = screen.getAllByTestId('long-division-step-group')
    const margins = groups.map((el) => el.style.marginLeft)
    expect(margins).toEqual(['0ch', '1ch', '2ch', '3ch', '4ch'])
  })

  it('does not throw for a single-digit dividend', () => {
    expect(() =>
      render(<LongDivisionSteps dividend={9} divisor={2} />),
    ).not.toThrow()
  })
})
