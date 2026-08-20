import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { makeDeps, makeTranslation } from '../../lib/testing/test-utils'
import type { ComplexCoordinatePlanePart } from '../../lib/types.task'

import { planeLength, PlaneFigureType } from './coordinate-plane/plane-math'
import { CoordinatePlanePart } from './coordinate-plane-part'

describe('CoordinatePlanePart Text labels', () => {
  it('uses fixed plane pixel size (ME parity, not width 100%)', () => {
    const part = {
      type: 110,
      showAxis: false,
      showCells: false,
      minPosition: -2,
      maxPosition: 2,
      stepSize: 30,
      tickStep: 1,
      reduceHeight: 1,
      figures: [],
    } as ComplexCoordinatePlanePart

    const length = planeLength({
      minPosition: -2,
      maxPosition: 2,
      tickStep: 1,
      stepSize: 30,
      showAxis: false,
      showCells: false,
      tickStepXMultiply: 1,
      tickStepYMultiply: 1,
      xAxisLabel: 'x',
      yAxisLabel: 'y',
    })
    const height = Math.max(40, length - 1)

    render(<CoordinatePlanePart part={part} deps={makeDeps()} />)
    const svg = screen.getByTestId('complex-coordinate-plane-part')

    expect(svg).toHaveAttribute('width', String(length))
    expect(svg).toHaveAttribute('height', String(height))
    expect(svg).not.toHaveAttribute('width', '100%')
  })

  it('renders Translation side lengths with units (ME parity)', () => {
    const part = {
      type: 110,
      showAxis: false,
      showCells: false,
      minPosition: -4,
      maxPosition: 4,
      stepSize: 20,
      tickStep: 1,
      figures: [
        {
          type: PlaneFigureType.Polygon,
          points: [
            { x: -1, y: 3 },
            { x: 1, y: 3 },
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 3, y: -2 },
            { x: -1, y: -2 },
          ],
        },
        {
          type: PlaneFigureType.Text,
          x: -2,
          y: 0.5,
          text: makeTranslation('50 см'),
        },
        {
          type: PlaneFigureType.Text,
          x: 0,
          y: 3.5,
          text: makeTranslation('20 см'),
        },
        {
          type: PlaneFigureType.Text,
          x: 4,
          y: -0.5,
          text: makeTranslation('30 см'),
        },
        {
          type: PlaneFigureType.Text,
          x: 1,
          y: -2.5,
          text: makeTranslation('40 см'),
        },
      ],
    } as ComplexCoordinatePlanePart

    render(<CoordinatePlanePart part={part} deps={makeDeps()} />)

    expect(screen.getByText('50 см')).toBeInTheDocument()
    expect(screen.getByText('20 см')).toBeInTheDocument()
    expect(screen.getByText('30 см')).toBeInTheDocument()
    expect(screen.getByText('40 см')).toBeInTheDocument()
  })

  it('does not drop labels when Translation has rus (not ru)', () => {
    const part = {
      type: 110,
      showAxis: false,
      showCells: false,
      minPosition: -3,
      maxPosition: 3,
      stepSize: 20,
      tickStep: 1,
      figures: [
        {
          type: PlaneFigureType.Text,
          x: 0,
          y: 0,
          text: makeTranslation('6см'),
        },
      ],
    } as ComplexCoordinatePlanePart

    render(<CoordinatePlanePart part={part} deps={makeDeps()} />)

    expect(
      screen.getByTestId('complex-coordinate-plane-part'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('6см')).toHaveLength(1)
  })
})
