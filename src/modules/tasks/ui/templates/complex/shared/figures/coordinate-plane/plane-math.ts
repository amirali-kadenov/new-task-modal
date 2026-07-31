/** Drawing-figure type ids used inside CoordinatePlane `figures[]`. */
export const PlaneFigureType = {
  Point: 10,
  Line: 20,
  LineSegment: 30,
  Polygon: 50,
  Circle: 60,
  Vector: 80,
  Text: 100,
  EllipticalArc: 110,
} as const

export type PlaneOptions = {
  minPosition: number
  maxPosition: number
  tickStep: number
  stepSize: number
  showAxis: boolean
  showCells: boolean
  tickStepXMultiply: number
  tickStepYMultiply: number
  xAxisLabel: string
  yAxisLabel: string
  reduceHeight?: number
}

export type PlanePoint = {
  x: number
  y: number
  letter?: string
  color?: string
  radius?: number
  borderColor?: string
  showOnlyLetter?: boolean
  showCoordinate?: boolean
  showDashes?: boolean
}

export const cellSize = (options: PlaneOptions) =>
  options.stepSize / options.tickStep

export const tickStartX = (options: PlaneOptions) => options.stepSize

export const planeLength = (options: PlaneOptions) => {
  const divisionsQuantity =
    (options.maxPosition - options.minPosition) / options.tickStep
  return options.stepSize * (divisionsQuantity + 1) + tickStartX(options)
}

export const getAxisX = (options: PlaneOptions, xPosition: number) =>
  tickStartX(options) +
  (options.stepSize * (xPosition - options.minPosition)) / options.tickStep

/** Math point → SVG pixel (matches Matheducator DotPointConverter.fromPointToDot). */
export const fromPointToDot = (
  options: PlaneOptions,
  pointX: number,
  pointY: number,
) => {
  const size = cellSize(options)
  const start = tickStartX(options)
  return {
    x: (pointX - options.minPosition) * size + start,
    y: (options.maxPosition - pointY) * size + start,
  }
}
