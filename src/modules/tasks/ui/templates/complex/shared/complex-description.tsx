import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import { FigureType } from '../lib/figure-types'
import { normalizeComplexPart } from '../lib/normalize-complex-part'
import type {
  ComplexAngleListPart,
  ComplexCoordinatePlanePart,
  ComplexImagePart,
  ComplexNumberLinePart,
  ComplexPart,
  ComplexTablePart,
  ComplexTaskDescription,
  ComplexTextPart,
} from '../lib/types.task'

import styles from './complex.module.scss'
import { AngleListPart } from './figures/angle-list-part'
import { CoordinatePlanePart } from './figures/coordinate-plane-part'
import { EquationPart } from './figures/equation-part'
import { ImagePart } from './figures/image-part'
import { NumberLinePart } from './figures/number-line-part'
import {
  type ComplexTableAnswerBindings,
  TablePart,
} from './figures/table-part'
import { TextPart } from './figures/text-part'

interface Props {
  description: ComplexTaskDescription
  deps: TaskModalDependencies
  /** Interactive table answercells (when bottom input is hidden). */
  tableAnswerBindings?: ComplexTableAnswerBindings | null
  /** Solution: fill table answercells with correct values. */
  tableSolutionAnswers?: string[] | null
  /** complex.after.equation: centered equation row + fixed input width. */
  equationLayout?: boolean
}

const renderPart = (
  raw: ComplexPart,
  deps: TaskModalDependencies,
  index: number,
  tableAnswerBindings: ComplexTableAnswerBindings | null | undefined,
  tableSolutionAnswers: string[] | null | undefined,
  nextSolutionIndex: (() => number) | undefined,
  equationLayout: boolean | undefined,
) => {
  const part = normalizeComplexPart(
    raw as unknown as Record<string, unknown>,
  ) as ComplexPart
  const type = Number(part.type)

  switch (type) {
    case FigureType.Text:
      return <TextPart key={index} part={part as ComplexTextPart} deps={deps} />
    case FigureType.Image:
      return (
        <ImagePart key={index} part={part as ComplexImagePart} deps={deps} />
      )
    case FigureType.NumberLine:
      return <NumberLinePart key={index} part={part as ComplexNumberLinePart} />
    case FigureType.AngleList:
      return <AngleListPart key={index} part={part as ComplexAngleListPart} />
    case FigureType.CoordinatePlane:
      return (
        <CoordinatePlanePart
          key={index}
          part={part as ComplexCoordinatePlanePart}
          deps={deps}
        />
      )
    case FigureType.Table:
      return equationLayout ? (
        <EquationPart
          key={index}
          part={part as ComplexTablePart}
          deps={deps}
          answerBindings={tableAnswerBindings}
          solutionAnswers={tableSolutionAnswers}
          nextSolutionIndex={nextSolutionIndex}
        />
      ) : (
        <TablePart
          key={index}
          part={part as ComplexTablePart}
          deps={deps}
          answerBindings={tableAnswerBindings}
          solutionAnswers={tableSolutionAnswers}
          nextSolutionIndex={nextSolutionIndex}
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

export const ComplexDescription = ({
  description,
  deps,
  tableAnswerBindings,
  tableSolutionAnswers,
  equationLayout,
}: Props) => {
  const parts = description.parts ?? []
  let solutionInputCounter = 0
  const nextSolutionIndex = tableSolutionAnswers
    ? () => solutionInputCounter++
    : undefined

  return (
    <div className={styles.parts} data-testid="complex-description">
      {parts.map((part, index) =>
        renderPart(
          part,
          deps,
          index,
          tableAnswerBindings,
          tableSolutionAnswers,
          nextSolutionIndex,
          equationLayout,
        ),
      )}
    </div>
  )
}
