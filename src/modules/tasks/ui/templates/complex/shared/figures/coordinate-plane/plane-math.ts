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

/**
 * Bounding box of everything actually drawn, in plane units.
 *
 * The backend declares `minPosition`/`maxPosition` for the whole coordinate
 * field, and that field is often much larger than the figure it carries. A
 * segment spanning 0..1 inside a field declared -10..10 ends up as a thin line
 * in a large empty grid.
 *
 * Returns `null` when nothing is drawn, so callers keep the declared field.
 */
export const contentBounds = (
  points: PlanePoint[],
  figures: Record<string, unknown>[],
): { minX: number; maxX: number; minY: number; maxY: number } | null => {
  const xs: number[] = []
  const ys: number[] = []
  const add = (x: unknown, y: unknown) => {
    if (typeof x === 'number' && Number.isFinite(x)) xs.push(x)
    if (typeof y === 'number' && Number.isFinite(y)) ys.push(y)
  }

  for (const p of points) add(p.x, p.y)

  for (const f of figures) {
    const type = Number(f.type)
    const пары = (key: string) => {
      const list = f[key]
      if (!Array.isArray(list)) return
      for (const p of list) if (p && typeof p === 'object') add((p as PlanePoint).x, (p as PlanePoint).y)
    }
    пары('points')
    пары('answerPoints')
    add(f.x, f.y)
    add(f.x1, f.y1)
    add(f.x2, f.y2)
    if (type === PlaneFigureType.Circle) {
      const r = Number(f.radius ?? f.r)
      const cx = Number(f.x)
      const cy = Number(f.y)
      if (Number.isFinite(r) && Number.isFinite(cx) && Number.isFinite(cy)) {
        add(cx - r, cy - r)
        add(cx + r, cy + r)
      }
    }
  }

  if (!xs.length || !ys.length) return null
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

/**
 * Options narrowed to what is actually drawn, with one cell of air around it.
 *
 * Off by default: `planeLength` reproduces Matheducator pixel-for-pixel, and
 * that parity is covered by a test. Pass `fitToContent` to opt in.
 */
export const fitOptionsToContent = (
  options: PlaneOptions,
  points: PlanePoint[],
  figures: Record<string, unknown>[],
): PlaneOptions => {
  const b = contentBounds(points, figures)
  if (!b) return options

  const air = options.tickStep
  const min = Math.max(options.minPosition, Math.min(b.minX, b.minY) - air)
  const max = Math.min(options.maxPosition, Math.max(b.maxX, b.maxY) + air)
  if (!(max > min)) return options

  return { ...options, minPosition: min, maxPosition: max }
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
