import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import type { ComplexCoordinatePlanePart } from '../../lib/types.task'
import styles from '../complex.module.scss'

import {
  PlaneAxes,
  PlaneDot,
  PlaneFigure,
} from './coordinate-plane/plane-figures'
import {
  fitOptionsToContent,
  planeLength,
  type PlaneOptions,
  type PlanePoint,
} from './coordinate-plane/plane-math'

interface Props {
  part: ComplexCoordinatePlanePart
  deps: TaskModalDependencies
  /**
   * Size the canvas to what is drawn instead of the declared coordinate field.
   *
   * Off by default: `planeLength` reproduces Matheducator pixel-for-pixel and
   * that parity is covered by a test. With it on, a figure spanning half a
   * unit inside a field declared -10..10 no longer sits in a large empty grid.
   */
  fitToContent?: boolean
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
export const CoordinatePlanePart = ({ part, deps, fitToContent = false }: Props) => {
  const declared = toOptions(part)
  const translate = (value: unknown) => deps.global.translateTasks(value)

  const points = Array.isArray(part.points)
    ? (part.points as PlanePoint[]).filter(
        (p) => typeof p?.x === 'number' && typeof p?.y === 'number',
      )
    : []
  const figures = Array.isArray(part.figures)
    ? (part.figures as Record<string, unknown>[])
    : []

  const options = fitToContent
    ? fitOptionsToContent(declared, points, figures)
    : declared
  const length = planeLength(options)
  const reduce = options.reduceHeight ?? 0
  const height = Math.max(40, length - reduce)

  return (
    <svg
      className={styles.planeSvg}
      data-figure-type="110"
      data-testid="complex-coordinate-plane-part"
      width={length}
      height={height}
      viewBox={`0 0 ${length} ${height}`}
    >
      <PlaneAxes options={options} />
      {figures.map((figure, index) => (
        <PlaneFigure
          key={`fig-${index}`}
          options={options}
          figure={figure}
          translate={translate}
        />
      ))}
      {points.map((point, index) => (
        <PlaneDot key={`pt-${index}`} options={options} point={point} />
      ))}
    </svg>
  )
}
