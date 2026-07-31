import type { ComplexCoordinatePlanePart } from '../../lib/types.task'
import styles from '../complex.module.scss'

import { PlaneAxes, PlaneDot, PlaneFigure } from './coordinate-plane/plane-figures'
import {
  planeLength,
  type PlaneOptions,
  type PlanePoint,
} from './coordinate-plane/plane-math'

interface Props {
  part: ComplexCoordinatePlanePart
}

const toOptions = (part: ComplexCoordinatePlanePart): PlaneOptions => ({
  minPosition: part.minPosition ?? -5,
  maxPosition: part.maxPosition ?? 5,
  tickStep: part.tickStep ?? 1,
  stepSize: part.stepSize ?? 20,
  showAxis: part.showAxis !== false,
  showCells: part.showCells !== false,
  tickStepXMultiply: part.tickStepXMultiply ?? 1,
  tickStepYMultiply: part.tickStepYMultiply ?? 1,
  xAxisLabel: part.xAxisLabel ?? 'x',
  yAxisLabel: part.yAxisLabel ?? 'y',
  reduceHeight: part.reduceHeight,
})

/** Display-only CoordinatePlane (no click / draw for grade 4). */
export const CoordinatePlanePart = ({ part }: Props) => {
  const options = toOptions(part)
  const length = planeLength(options)
  const reduce = options.reduceHeight ?? 0
  const height = Math.max(40, length - reduce)

  const points = Array.isArray(part.points)
    ? (part.points as PlanePoint[]).filter(
        (p) => typeof p?.x === 'number' && typeof p?.y === 'number',
      )
    : []
  const figures = Array.isArray(part.figures)
    ? (part.figures as Record<string, unknown>[])
    : []

  return (
    <svg
      className={styles.planeSvg}
      data-figure-type="110"
      width="100%"
      viewBox={`0 0 ${length} ${height}`}
    >
      <PlaneAxes options={options} />
      {figures.map((figure, index) => (
        <PlaneFigure key={`fig-${index}`} options={options} figure={figure} />
      ))}
      {points.map((point, index) => (
        <PlaneDot key={`pt-${index}`} options={options} point={point} />
      ))}
    </svg>
  )
}
