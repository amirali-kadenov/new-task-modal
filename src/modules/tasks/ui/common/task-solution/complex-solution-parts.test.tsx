import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import {
  SolutionFigureType,
  type ComplexSolutionPart,
} from '../../../lib/solution-types'

import { ComplexSolutionParts } from './complex-solution-parts'

describe('ComplexSolutionParts CoordinatePlane', () => {
  it('renders a real coordinate plane preview instead of the unavailable placeholder', () => {
    const parts: ComplexSolutionPart[] = [
      {
        type: SolutionFigureType.CoordinatePlane,
        minPosition: -2,
        maxPosition: 2,
        stepSize: 20,
        tickStep: 1,
        points: [{ x: 1, y: 1 }],
      },
    ]

    render(<ComplexSolutionParts parts={parts} deps={makeTaskModalDeps()} />)

    expect(
      screen.getByTestId('complex-coordinate-plane-part'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/not available in new modal/i),
    ).not.toBeInTheDocument()
  })
})
