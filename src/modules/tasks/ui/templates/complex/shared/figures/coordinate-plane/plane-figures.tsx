import type { ReactNode } from 'react'

import {
  fromPointToDot,
  getAxisX,
  planeLength,
  PlaneFigureType,
  type PlaneOptions,
  type PlanePoint,
} from './plane-math'

const asPoint = (value: unknown): PlanePoint | null => {
  if (!value || typeof value !== 'object') return null
  const p = value as Record<string, unknown>
  if (typeof p.x !== 'number' || typeof p.y !== 'number') return null
  return p as PlanePoint
}

const letterOf = (point: PlanePoint) =>
  typeof point.letter === 'string' ? point.letter : ''

interface DotProps {
  options: PlaneOptions
  point: PlanePoint
}

export const PlaneDot = ({ options, point }: DotProps) => {
  const { x, y } = fromPointToDot(options, point.x, point.y)
  const offsetX = 12 * (point.x >= 0 ? 1 : -1)
  const offsetY = 12 * (point.y >= 0 ? 1 : -1)
  const fill = point.color || 'green'
  const radius = point.radius === 0 ? 0 : (point.radius ?? 4)
  const letter = letterOf(point)

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke={point.borderColor || fill}
        strokeWidth={point.borderColor ? 1 : 0}
      />
      {point.showOnlyLetter && letter ? (
        <text
          x={x + offsetX}
          y={y - offsetY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
        >
          {letter}
        </text>
      ) : null}
      {point.showCoordinate && letter ? (
        <text
          x={x + offsetX}
          y={y - offsetY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
        >
          {`${letter}(${point.x};${point.y})`}
        </text>
      ) : null}
    </g>
  )
}

interface AxesProps {
  options: PlaneOptions
}

export const PlaneAxes = ({ options }: AxesProps) => {
  const {
    minPosition,
    maxPosition,
    tickStep,
    stepSize,
    showAxis,
    showCells,
    tickStepXMultiply,
    tickStepYMultiply,
    xAxisLabel,
    yAxisLabel,
  } = options
  const length = planeLength(options)
  const mid = length / 2
  const arrowLength = stepSize / 2

  const ticks: number[] = []
  for (let i = minPosition; i <= maxPosition; i += tickStep) {
    ticks.push(i)
  }

  const gridLines = showCells
    ? ticks.map((i) => {
        const x = getAxisX(options, i)
        return (
          <g key={`grid-${i}`}>
            <line
              x1={x}
              y1={-mid}
              x2={x}
              y2={mid}
              stroke="lightgrey"
            />
          </g>
        )
      })
    : null

  const axisContent = showAxis ? (
    <>
      <line x1={0} y1={0} x2={length} y2={0} stroke="black" />
      <path
        d={`M${arrowLength},-5 L0,0 L${arrowLength},5z`}
        fill="black"
      />
      <path
        d={`M${length - arrowLength},-5 L${length},0 L${length - arrowLength},5z`}
        fill="black"
        transform={`rotate(180 ${length - arrowLength / 2} 0)`}
      />
      {ticks.map((i) => {
        if (i === 0) return null
        const x = getAxisX(options, i)
        return (
          <line key={`tick-${i}`} x1={x} y1={-6} x2={x} y2={6} stroke="black" />
        )
      })}
    </>
  ) : null

  return (
    <g>
      {/* X axis at mid-Y */}
      <g transform={`translate(0,${mid})`}>
        {gridLines}
        {axisContent}
        {showAxis
          ? ticks.map((i) => {
              if (i === 0) return null
              const x = getAxisX(options, i)
              return (
                <text
                  key={`xn-${i}`}
                  x={x}
                  y={15}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                >
                  {i * tickStepXMultiply}
                </text>
              )
            })
          : null}
        {showAxis ? (
          <>
            <text
              x={mid - 10}
              y={10}
              textAnchor="middle"
              dominantBaseline="central"
            >
              0
            </text>
            <text x={length} y={-15} textAnchor="end">
              {xAxisLabel}
            </text>
          </>
        ) : null}
      </g>

      {/* Y axis: rotate -90 around mid */}
      <g transform={`translate(0,${mid}) rotate(-90)`}>
        {showCells
          ? ticks.map((i) => {
              const x = getAxisX(options, i)
              return (
                <line
                  key={`ygrid-${i}`}
                  x1={x}
                  y1={-mid}
                  x2={x}
                  y2={mid}
                  stroke="lightgrey"
                />
              )
            })
          : null}
        {axisContent}
        {showAxis
          ? ticks.map((i) => {
              if (i === 0) return null
              const x = getAxisX(options, i)
              return (
                <text
                  key={`yn-${i}`}
                  x={x}
                  y={-15}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  transform={`rotate(90 ${x} -15)`}
                >
                  {i * tickStepYMultiply}
                </text>
              )
            })
          : null}
        {showAxis ? (
          <text
            x={0}
            y={0}
            transform={`rotate(90) translate(10,${-length + 15})`}
          >
            {yAxisLabel}
          </text>
        ) : null}
      </g>
    </g>
  )
}

interface FigureProps {
  options: PlaneOptions
  figure: Record<string, unknown>
}

export const PlaneFigure = ({ options, figure }: FigureProps): ReactNode => {
  const type = Number(figure.type)

  switch (type) {
    case PlaneFigureType.Point: {
      const point = asPoint({ ...figure, ...(figure.point as object) })
      return point ? <PlaneDot options={options} point={point} /> : null
    }
    case PlaneFigureType.LineSegment: {
      const point1 = asPoint(figure.point1)
      const point2 = asPoint(figure.point2)
      if (!point1 || !point2) return null
      const d1 = fromPointToDot(options, point1.x, point1.y)
      const d2 = fromPointToDot(options, point2.x, point2.y)
      const color = (figure.lineColor as string) || 'black'
      const showLetters = Boolean(figure.showDotLetters)
      const radius =
        typeof figure.dotRadius === 'number' ? figure.dotRadius : undefined
      return (
        <g>
          <PlaneDot
            options={options}
            point={{
              ...point1,
              color,
              radius,
              showOnlyLetter: showLetters,
            }}
          />
          <PlaneDot
            options={options}
            point={{
              ...point2,
              color,
              radius,
              showOnlyLetter: showLetters,
            }}
          />
          <line
            x1={d1.x}
            y1={d1.y}
            x2={d2.x}
            y2={d2.y}
            stroke={color}
            strokeDasharray={figure.dashed ? '5 5' : undefined}
          />
        </g>
      )
    }
    case PlaneFigureType.Line: {
      const point1 = asPoint(figure.point1)
      const point2 = asPoint(figure.point2)
      if (!point1 || !point2) return null
      const d1 = fromPointToDot(options, point1.x, point1.y)
      const d2 = fromPointToDot(options, point2.x, point2.y)
      return (
        <line
          x1={d1.x}
          y1={d1.y}
          x2={d2.x}
          y2={d2.y}
          stroke="green"
          strokeDasharray={figure.dashed ? '5' : undefined}
        />
      )
    }
    case PlaneFigureType.Polygon: {
      const points = Array.isArray(figure.points)
        ? (figure.points as unknown[]).map(asPoint).filter(Boolean)
        : []
      if (points.length < 2) return null
      const poly = points
        .map((p) => {
          const d = fromPointToDot(options, p!.x, p!.y)
          return `${d.x},${d.y}`
        })
        .join(' ')
      return (
        <g>
          <polygon
            points={poly}
            stroke={(figure.borderColor as string) || 'black'}
            fill={(figure.fill as string) || 'none'}
          />
          {figure.showPointsLetter
            ? points.map((p, i) => (
                <PlaneDot
                  key={i}
                  options={options}
                  point={{ ...p!, showOnlyLetter: true, radius: 1 }}
                />
              ))
            : null}
        </g>
      )
    }
    case PlaneFigureType.Circle: {
      const center = asPoint(figure.centerPoint)
      if (!center || typeof figure.radius !== 'number') return null
      const d = fromPointToDot(options, center.x, center.y)
      return (
        <circle
          cx={d.x}
          cy={d.y}
          r={figure.radius * options.stepSize}
          stroke={(figure.strokeColor as string) || 'black'}
          fill={(figure.innerColor as string) || 'transparent'}
          strokeDasharray={figure.dashed ? '5' : undefined}
        />
      )
    }
    case PlaneFigureType.Vector: {
      const point1 = asPoint(figure.point1)
      const point2 = asPoint(figure.point2)
      if (!point1 || !point2) return null
      const d1 = fromPointToDot(options, point1.x, point1.y)
      const d2 = fromPointToDot(options, point2.x, point2.y)
      const color = (figure.color as string) || 'black'
      const center = { x: (d1.x + d2.x) / 2, y: (d1.y + d2.y) / 2 }
      const degree =
        (Math.atan((d2.y - center.y) / (d2.x - center.x || 1)) * 180) /
        Math.PI
      const flip = d1.x > d2.x ? 1 : -1
      return (
        <g stroke={color} fill={color}>
          <circle
            cx={d1.x}
            cy={d1.y}
            r={typeof figure.dotRadius === 'number' ? figure.dotRadius : 4}
          />
          <line
            x1={d1.x}
            y1={d1.y}
            x2={d2.x}
            y2={d2.y}
            strokeDasharray={figure.dashed ? '5' : undefined}
          />
          <path
            d={`M${15 * flip},-5 L0,0 L${15 * flip},5z`}
            transform={`translate(${d2.x},${d2.y}) rotate(${degree})`}
          />
          {typeof figure.label === 'string' ? (
            <text x={center.x} y={center.y - 2} fill={color}>
              {figure.label}
            </text>
          ) : null}
        </g>
      )
    }
    case PlaneFigureType.Text: {
      const x = typeof figure.x === 'number' ? figure.x : 0
      const y = typeof figure.y === 'number' ? figure.y : 0
      const d = fromPointToDot(options, x, y)
      const raw = figure.text
      const label =
        typeof raw === 'string'
          ? raw
          : raw && typeof raw === 'object' && 'ru' in (raw as object)
            ? String((raw as { ru?: string }).ru ?? '')
            : ''
      if (!label) return null
      return (
        <text
          x={d.x}
          y={d.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={(figure.fontSize as number) || 18}
          transform={
            figure.degree
              ? `rotate(${figure.degree} ${d.x} ${d.y})`
              : undefined
          }
        >
          {label}
        </text>
      )
    }
    case PlaneFigureType.EllipticalArc: {
      const center = asPoint(figure.centerPoint)
      const mPoint = asPoint(figure.mPoint)
      const endPoint = asPoint(figure.endPoint)
      if (!center || !mPoint || !endPoint) return null
      if (typeof figure.rx !== 'number' || typeof figure.ry !== 'number')
        return null
      const centerDot = fromPointToDot(options, center.x, center.y)
      const mDot = fromPointToDot(options, mPoint.x, mPoint.y)
      const endDot = fromPointToDot(options, endPoint.x, endPoint.y)
      const rx = figure.rx * options.stepSize
      const ry = figure.ry * options.stepSize
      const fill = (figure.fill as string) || 'none'
      const start =
        fill === 'transparent'
          ? `M${mDot.x} ${mDot.y}`
          : `M${centerDot.x} ${centerDot.y} L${mDot.x} ${mDot.y}`
      const d = `${start} A${rx} ${ry} ${figure.xAxisRotation ?? 0} ${figure.largeArcFlag ?? 0} ${figure.sweepFlag ?? 0} ${endDot.x} ${endDot.y}`
      return (
        <g>
          <path
            d={d}
            stroke={(figure.borderColor as string) || 'black'}
            strokeWidth={(figure.strokeWidth as number) || 1}
            fill={fill}
            strokeDasharray={figure.dashed ? '5' : undefined}
            transform={
              figure.rotateDegree
                ? `rotate(${figure.rotateDegree} ${centerDot.x} ${centerDot.y})`
                : undefined
            }
          />
          {figure.showDots ? (
            <>
              <PlaneDot
                options={options}
                point={{
                  ...mPoint,
                  radius: 3,
                  color: 'black',
                  showOnlyLetter: Boolean(mPoint.letter),
                }}
              />
              <PlaneDot
                options={options}
                point={{
                  ...endPoint,
                  radius: 3,
                  color: 'black',
                  showOnlyLetter: Boolean(endPoint.letter),
                }}
              />
            </>
          ) : null}
        </g>
      )
    }
    default:
      return null
  }
}
