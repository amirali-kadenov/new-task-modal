import type { ComplexAngleListPart } from '../../lib/types.task'
import styles from '../complex.module.scss'

interface Props {
  part: ComplexAngleListPart
}

const deg2rad = (deg: number) => (deg * Math.PI) / 180

/** Display-only angle rays (simplified protractor as SVG semicircle). */
export const AngleListPart = ({ part }: Props) => {
  const angles = part.list ?? []
  const length = 200
  const height = 200
  const sumDeg = angles.reduce((acc, a) => acc + (a.degree ?? 0), 0)
  const showProtractor = Boolean(part.showProtractor)
  const startX = sumDeg > 90 || showProtractor ? length : 25
  const paperWidth = length + startX
  const startY = height
  const paperHeight =
    height + ((angles[0]?.degree ?? 0) < 0 || sumDeg > 180 ? startY : 25)

  const ray = (degreeFromZero: number) => {
    const rad = deg2rad(-degreeFromZero)
    const x2 = Math.cos(rad) * length
    const y2 = Math.sin(rad) * length
    return { x2, y2 }
  }

  let cumulative = 0
  const rays = angles.map((angle, index) => {
    const startDegree = cumulative
    const currentDegree = angle.degree ?? 0
    cumulative += currentDegree
    const degreeFromZero =
      (currentDegree === 360 ? 180 : currentDegree) + startDegree
    return { angle, index, startDegree, currentDegree, degreeFromZero }
  })

  return (
    <svg
      className={styles.angleListSvg}
      data-figure-type="50"
      width={paperWidth}
      height={paperHeight}
      viewBox={`0 0 ${paperWidth} ${paperHeight}`}
    >
      <g transform={`translate(${startX},${startY})`}>
        {showProtractor ? (
          <path
            d={`M${-length},0 A${length},${length} 0 0 1 ${length},0`}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth={2}
          />
        ) : null}

        {part.centerPointLetter ? (
          <>
            <circle cx={0} cy={0} r={3} fill="black" />
            <text x={0} y={20} textAnchor="middle" fontSize={14}>
              {part.centerPointLetter}
            </text>
          </>
        ) : null}

        {/* base ray along +x */}
        <line x1={0} y1={0} x2={length} y2={0} stroke="black" />
        <path
          d={`M${length - 15},-5 L${length},0 L${length - 15},5z`}
          fill="black"
        />

        {rays.map(({ degreeFromZero, index }) => {
          const { x2, y2 } = ray(degreeFromZero)
          return (
            <g key={index}>
              <line x1={0} y1={0} x2={x2} y2={y2} stroke="black" />
              <path
                d={`M${-15},-5 L0,0 L${-15},5z`}
                fill="black"
                transform={`translate(${x2},${y2}) rotate(${-degreeFromZero})`}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
