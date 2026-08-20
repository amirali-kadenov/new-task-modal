import clsx from 'clsx'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { TableStaticCellContent } from '@/modules/tasks/ui/templates/table/lib/render-table-cell-content'
import tableStyles from '@/modules/tasks/ui/templates/table/shared/table.module.scss'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import type { MathInputRef } from '@/ui/math-input/types'
import { MathText } from '@/ui/math-text/math-text'

import type { ComplexTablePart } from '../../lib/types.task'

export interface ComplexTableAnswerBindings {
  answer: string
  separator: string
  bindRef: (id: string) => (ref: MathInputRef | null) => void
  handleChange: () => void
  /** Shared counter across all table parts in one description. */
  nextInputIndex: () => number
}

interface Props {
  part: ComplexTablePart
  deps: TaskModalDependencies
  /** When set, `answercell` cells become MathInputs (legacy TaskTable parity). */
  answerBindings?: ComplexTableAnswerBindings | null
  /** Solution mode: fill answercells with correct values (table-solution parity). */
  solutionAnswers?: string[] | null
  /** Shared counter across table parts in one description (solution mode). */
  nextSolutionIndex?: () => number
}

export const TablePart = ({
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
  const tableWidth = part.width || '100%'

  return (
    <div
      className={tableStyles.tableWrapper}
      data-figure-type="120"
      data-testid="complex-table-part"
    >
      <table
        className={clsx(
          tableStyles.table,
          part.removeBorders && tableStyles.tableRemoveBorders,
          part.removePadding && tableStyles.tableRemovePadding,
        )}
        style={{ width: tableWidth }}
        data-testid="task-table"
      >
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {(row.cells ?? []).map((cell, cellIndex) => {
                const isInput = cell === 'answercell'
                const content =
                  typeof cell === 'string'
                    ? cell
                    : deps.global.translateTasks(cell as Translation)

                const currentInputIndex =
                  isInput && answerBindings
                    ? answerBindings.nextInputIndex()
                    : -1
                const inputId = `complex-table-input-${currentInputIndex}`

                const solutionIndex =
                  isInput && solutionAnswers && nextSolutionIndex
                    ? nextSolutionIndex()
                    : -1
                const solutionValue =
                  solutionIndex >= 0
                    ? (solutionAnswers?.[solutionIndex] ?? '')
                    : ''

                return (
                  <td
                    key={cellIndex}
                    className={clsx(
                      tableStyles.cell,
                      isInput && tableStyles.inputCell,
                    )}
                    colSpan={row.colspan_list?.[cellIndex] || 1}
                    rowSpan={row.rowspan_list?.[cellIndex] || 1}
                  >
                    {isInput && answerBindings && currentInputIndex >= 0 ? (
                      <MathInput
                        id={inputId}
                        ref={answerBindings.bindRef(inputId)}
                        formula={answerValues[currentInputIndex] ?? ''}
                        onMathFieldChanged={answerBindings.handleChange}
                        className={tableStyles.input}
                      />
                    ) : isInput && solutionAnswers ? (
                      <MathText className={tableStyles.input}>
                        {solutionValue}
                      </MathText>
                    ) : isInput ? (
                      <span data-testid="complex-table-answercell-empty" />
                    ) : (
                      <TableStaticCellContent content={content} />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** True when any complex part is a table that contains `answercell`. */
export const complexDescriptionHasTableAnswerCells = (
  parts:
    | Array<{ type?: number; rows?: Array<{ cells?: unknown[] }> }>
    | undefined,
): boolean => {
  if (!parts?.length) return false
  return parts.some((part) => {
    if (Number(part.type) !== 120) return false
    return (part.rows ?? []).some((row) =>
      (row.cells ?? []).some((cell) => cell === 'answercell'),
    )
  })
}
