import clsx from 'clsx'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { TableStaticCellContent } from '@/modules/tasks/ui/templates/table/lib/render-table-cell-content'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import { MathText } from '@/ui/math-text/math-text'

import type { ComplexTablePart } from '../../lib/types.task'

import styles from './equation-part.module.scss'
import type { ComplexTableAnswerBindings } from './table-part'

interface Props {
  part: ComplexTablePart
  deps: TaskModalDependencies
  answerBindings?: ComplexTableAnswerBindings | null
  solutionAnswers?: string[] | null
  nextSolutionIndex?: () => number
}

/**
 * complex.after.equation only (complex_5 etc.): an equation row like
 * "N дм³ = [input] см³". Backend still encodes it as a Table part
 * (`type: 120`, see `../../lib/classify-complex-template.ts`), but there's
 * nothing tabular about it — a plain flex row avoids fighting `<table>`
 * layout for what's really inline text + one input.
 */
export const EquationPart = ({
  part,
  deps,
  answerBindings,
  solutionAnswers,
  nextSolutionIndex,
}: Props) => {
  const rows = part.rows ?? []
  const answerValues = answerBindings
    ? splitMultiAnswer(answerBindings.answer, answerBindings.separator)
    : []
  const isSolutionMode = Boolean(solutionAnswers)

  return (
    <div
      className={styles.wrapper}
      data-figure-type="120"
      data-testid="complex-equation-part"
    >
      {rows.map((row, rowIndex) => (
        <div
          className={clsx(styles.row, isSolutionMode && styles.rowSolution)}
          key={rowIndex}
        >
          {(row.cells ?? []).map((cell, cellIndex) => {
            const isInput = cell === 'answercell'
            const content =
              typeof cell === 'string'
                ? cell
                : deps.global.translateTasks(cell as Translation)

            const currentInputIndex =
              isInput && answerBindings ? answerBindings.nextInputIndex() : -1
            const inputId = `complex-equation-input-${currentInputIndex}`

            const solutionIndex =
              isInput && solutionAnswers && nextSolutionIndex
                ? nextSolutionIndex()
                : -1
            const solutionValue =
              solutionIndex >= 0 ? (solutionAnswers?.[solutionIndex] ?? '') : ''

            if (isInput && answerBindings && currentInputIndex >= 0) {
              return (
                <MathInput
                  key={cellIndex}
                  id={inputId}
                  ref={answerBindings.bindRef(inputId)}
                  formula={answerValues[currentInputIndex] ?? ''}
                  onMathFieldChanged={answerBindings.handleChange}
                  className={styles.input}
                />
              )
            }

            if (isInput && solutionAnswers) {
              return <MathText key={cellIndex}>{solutionValue}</MathText>
            }

            if (isInput) {
              return (
                <span
                  key={cellIndex}
                  data-testid="complex-table-answercell-empty"
                />
              )
            }

            return <TableStaticCellContent key={cellIndex} content={content} />
          })}
        </div>
      ))}
    </div>
  )
}
