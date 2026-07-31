import clsx from 'clsx'

import type { Translation } from '@/types/api/api'
import { MathText } from '@/ui/math-text/math-text'

import {
  SolutionFigureType,
  type ComplexSolutionPart,
} from '../../../lib/solution-types'
import type { TaskModalDependencies } from '../../../task-modal/model/types/props'

import { SolutionContentText } from './solution-content-text'
import { SolutionTable } from './solution-table'

import s from './complex-solution-parts.module.scss'

interface Props {
  parts: ComplexSolutionPart[]
  deps: TaskModalDependencies
}

const renderContent = (
  content: Translation | string,
  deps: TaskModalDependencies,
) => {
  const text =
    typeof content === 'string'
      ? content
      : deps.global.translateTasks(content)

  return <SolutionContentText content={text} formulaClassName={s.formula} />
}

const MultipleChoicePart = ({
  part,
  deps,
}: {
  part: ComplexSolutionPart
  deps: TaskModalDependencies
}) => (
  <div className={s.multipleChoice}>
    {(part.variants ?? []).map((variant, index) => {
      const isCorrect = variant.isCorrect || variant.correct
      const label =
        typeof variant.text === 'string'
          ? variant.text
          : variant.text
            ? deps.global.translateTasks(variant.text)
            : ''

      return (
        <div
          key={index}
          className={clsx(s.variant, isCorrect && s.variantCorrect)}
        >
          {variant.image ? (
            <div
              className={s.variantImage}
              dangerouslySetInnerHTML={{ __html: variant.image }}
            />
          ) : (
            <MathText>{label}</MathText>
          )}
        </div>
      )
    })}
  </div>
)

export const ComplexSolutionParts = ({ parts, deps }: Props) => (
  <div className={s.container}>
    {parts.map((part, index) => {
      switch (part.type) {
        case SolutionFigureType.Text:
          return (
            <div
              key={index}
              className={clsx(s.textPart, part.center && s.center)}
            >
              {part.content && renderContent(part.content, deps)}
            </div>
          )

        case SolutionFigureType.MultipleChoice:
          return <MultipleChoicePart key={index} part={part} deps={deps} />

        case SolutionFigureType.Table:
          return part.rows ? (
            <SolutionTable
              key={index}
              rows={part.rows}
              width={part.width}
              deps={deps}
            />
          ) : null

        case SolutionFigureType.Html:
          return part.content ? (
            <div
              key={index}
              className={s.htmlPart}
              dangerouslySetInnerHTML={{
                __html:
                  typeof part.content === 'string'
                    ? part.content
                    : deps.global.translateTasks(part.content),
              }}
            />
          ) : null

        case SolutionFigureType.CoordinatePlane:
          return (
            <p key={index} className={s.unsupported}>
              Coordinate plane (solution preview not available in new modal)
            </p>
          )

        default:
          return null
      }
    })}
  </div>
)
