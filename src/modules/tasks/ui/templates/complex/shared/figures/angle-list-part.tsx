import type { ReactNode } from 'react'

import type { ComplexAngleListPart } from '../../lib/types.task'
import styles from '../complex.module.scss'

import { PROTRACTOR_DATA_URL } from './protractor-image'

interface Props {
  part: ComplexAngleListPart
}

const deg2rad = (deg: number) => (deg * Math.PI) / 180

/** Snap.svg-compatible cos/sin (degrees). */
const snapCos = (deg: number) => Math.cos(deg2rad(deg))
const snapSin = (deg: number) => Math.sin(deg2rad(deg))

type AngleItem = NonNullable<ComplexAngleListPart['list']>[number]

const DegreeCurve = ({
  currentDegree,
  degreeLength,
  startDegree,
  qDegree,
  degreeFromZero,
}: {
  currentDegree: number
  degreeLength: number
  startDegree: number
  qDegree: number
  degreeFromZero: number
}) => {
  if (currentDegree === 360) {
    return (
      <ellipse
        cx={0}
        cy={0}
        rx={degreeLength}
        ry={15}
        stroke="black"
        fill="transparent"
      />
    )
  }

  if (currentDegree === 90) {
    return (
      <path
        d={`M${degreeLength},0 L${degreeLength},${-degreeLength} L${0},${-degreeLength}`}
        stroke="black"
        fill="transparent"
        transform={`rotate(${-startDegree} 0 0)`}
      />
    )
  }

  return (
    <path
      d={`
        M${snapCos(startDegree) * degreeLength},${snapSin(startDegree) * -degreeLength}
        Q${snapCos(qDegree) * (degreeLength + 3)},${snapSin(qDegree) * (-degreeLength - 3)}
        ${snapCos(degreeFromZero) * degreeLength},${snapSin(degreeFromZero) * -degreeLength}
      `}
      stroke="black"
      fill="transparent"
    />
  )
}

const Ray = () => (
  <g>
    <line x1={0} y1={0} x2={200} y2={0} stroke="black" />
    <path d="M185,-5 L200,0 L185,5z" fill="black" />
  </g>
)

/** Room past ray tips / protractor rim so SVG viewBox does not clip arrows. */
const EDGE_PAD = 16

/** Display-only angle rays; optional protractor PNG (legacy AngleList parity). */
export const AngleListPart = ({ part }: Props) => {
  const angles: AngleItem[] = part.list ?? []
  const length = 200
  const height = 200
  const sumDeg = angles.reduce((acc, a) => acc + (a.degree ?? 0), 0)
  const showProtractor = Boolean(part.showProtractor)
  const startX = sumDeg > 90 || showProtractor ? length : 25
  const imageWidth = length + startX
  const paperWidth = imageWidth + EDGE_PAD
  const startY = height
  const contentHeight =
    height + ((angles[0]?.degree ?? 0) < 0 || sumDeg > 180 ? startY : 25)
  const paperHeight = contentHeight + EDGE_PAD
  const degreeLength = 30

  const rays = angles.reduce<{
    list: {
      angle: AngleItem
      index: number
      startDegree: number
      currentDegree: number
      degreeFromZero: number
      qDegree: number
    }[]
    cumulative: number
  }>(
    (acc, angle, index) => {
      const startDegree = acc.cumulative
      const currentDegree = angle.degree ?? 0
      const cumulative = acc.cumulative + currentDegree
      const degreeFromZero =
        (currentDegree === 360 ? 180 : currentDegree) + startDegree
      const qDegree = (degreeFromZero + startDegree) / 2
      return {
        cumulative,
        list: [
          ...acc.list,
          { angle, index, startDegree, currentDegree, degreeFromZero, qDegree },
        ],
      }
    },
    { list: [], cumulative: 0 },
  ).list

  const overlays: ReactNode[] = []

  for (const {
    angle,
    index,
    startDegree,
    currentDegree,
    degreeFromZero,
    qDegree,
  } of rays) {
    overlays.push(
      <g key={`ray-${index}`} transform={`rotate(${-degreeFromZero} 0 0)`}>
        <Ray />
      </g>,
    )

    if (angle.isCurveVisible && currentDegree !== 0) {
      overlays.push(
        <DegreeCurve
          key={`curve-${index}`}
          currentDegree={currentDegree}
          degreeLength={degreeLength}
          startDegree={startDegree}
          qDegree={qDegree}
          degreeFromZero={degreeFromZero}
        />,
      )
    }

    if (
      angle.isTextVisible &&
      currentDegree !== 0 &&
      currentDegree !== 90 &&
      angle.text
    ) {
      overlays.push(
        <text
          key={`text-${index}`}
          x={snapCos(qDegree) * (degreeLength + 20)}
          y={snapSin(qDegree) * (-degreeLength - 20)}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {angle.text}
        </text>,
      )
    }

    if (angle.dot) {
      overlays.push(
        <g key={`dot-${index}`} transform={`rotate(${-degreeFromZero} 0 0)`}>
          <circle cx={length - 30} cy={0} r={3} fill="black" />
          {angle.dot.letter ? (
            <text
              x={length - 30}
              y={20}
              textAnchor="middle"
              transform={`rotate(${degreeFromZero} ${length - 30} 0)`}
            >
              {angle.dot.letter}
            </text>
          ) : null}
        </g>,
      )
    }
  }

  return (
    <svg
      className={styles.angleListSvg}
      data-figure-type="50"
      width="100%"
      viewBox={`0 0 ${paperWidth} ${paperHeight}`}
    >
      <g transform={`translate(${startX},${startY})`}>
        {showProtractor ? (
          <image
            href={PROTRACTOR_DATA_URL}
            x={-startX}
            y={-startY - 3}
            width={imageWidth}
            height={contentHeight}
            preserveAspectRatio="none"
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

        {overlays}
      </g>
    </svg>
  )
}
