import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import { FigureType } from '../lib/figure-types'
import { normalizeComplexPart } from '../lib/normalize-complex-part'
import type {
  ComplexAngleListPart,
  ComplexCoordinatePlanePart,
  ComplexImagePart,
  ComplexNumberLinePart,
  ComplexPart,
  ComplexTaskDescription,
  ComplexTextPart,
} from '../lib/types.task'
import styles from './complex.module.scss'

import { AngleListPart } from './figures/angle-list-part'
import { CoordinatePlanePart } from './figures/coordinate-plane-part'
import { ImagePart } from './figures/image-part'
import { NumberLinePart } from './figures/number-line-part'
import { TextPart } from './figures/text-part'

interface Props {
  description: ComplexTaskDescription
  deps: TaskModalDependencies
}

const renderPart = (raw: ComplexPart, deps: TaskModalDependencies, index: number) => {
  const part = normalizeComplexPart(
    raw as unknown as Record<string, unknown>,
  ) as ComplexPart
  const type = Number(part.type)

  switch (type) {
    case FigureType.Text:
      return (
        <TextPart
          key={index}
          part={part as ComplexTextPart}
          deps={deps}
        />
      )
    case FigureType.Image:
      return (
        <ImagePart
          key={index}
          part={part as ComplexImagePart}
          deps={deps}
        />
      )
    case FigureType.NumberLine:
      return (
        <NumberLinePart
          key={index}
          part={part as ComplexNumberLinePart}
        />
      )
    case FigureType.AngleList:
      return (
        <AngleListPart
          key={index}
          part={part as ComplexAngleListPart}
        />
      )
    case FigureType.CoordinatePlane:
      return (
        <CoordinatePlanePart
          key={index}
          part={part as ComplexCoordinatePlanePart}
        />
      )
    default:
      return (
        <p key={index} className={styles.unsupported}>
          Unsupported figure type {type}
        </p>
      )
  }
}

export const ComplexDescription = ({ description, deps }: Props) => {
  const parts = description.parts ?? []

  return (
    <div className={styles.parts} data-testid="complex-description">
      {parts.map((part, index) => renderPart(part, deps, index))}
    </div>
  )
}
