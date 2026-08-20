import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import {
  getCellClassName,
  getInputClassName,
  getTableClassName,
} from '../lib/get-table-classnames'
import { TableStaticCellContent } from '../lib/render-table-cell-content'
import type { TableTask } from '../lib/types.task'

import styles from './table.module.scss'

interface Props {
  task: TableTask
  deps: TaskModalDependencies
  answer: string
  solution: NonNullable<TableTask['solution']>
  /** templateId, e.g. `table.inline` — for CSS scoping via data-template-id. */
  templateId?: string
}

export const TableSolution = ({
  task,
  deps,
  answer,
  solution,
  templateId,
}: Props) => {
  const table = task.description.table

  if (!table) {
    return (
      <>
        <TaskTitle title={task.title} deps={deps} />
        <TaskDescription
          task={task as unknown as Task<'table'>}
          deps={deps}
        />
        <SolutionExplanation solution={solution} deps={deps} />
      </>
    )
  }

  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const correctValues = getCorrectAnswerFromSolution(
    solution,
    (value) => deps.global.translateTasks(value),
  ).split(separator)
  const userValues = answer.split(separator)

  let inputIndex = 0

  return (
    <div
      className={styles.container}
      data-template-id={templateId}
      data-mode="solution"
    >
      <TaskTitle title={task.title} deps={deps} />
      <TaskDescription
        task={task as unknown as Task<'table'>}
        deps={deps}
      />

      <SolutionAnswerPanel
        userAnswer={userValues.join(' ; ')}
        correctAnswer={correctValues.join(' ; ')}
        deps={deps}
      />

      <div className={styles.tableWrapper}>
        <table
          className={getTableClassName({
            id: templateId ?? 'table.plain',
            mode: 'solution',
            removeBorders: table.removeBorders,
            removePadding: table.removePadding,
          })}
          style={{
            width: templateId === 'table.mixed' ? '100%' : table.width,
          }}
          data-testid="task-table"
        >
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.cells.map((cell, cellIndex) => {
                  const isInput = cell === 'answercell'
                  const content =
                    typeof cell === 'string'
                      ? cell
                      : deps.global.translateTasks(cell)

                  const currentInputIndex = isInput ? inputIndex++ : -1

                  const isHeaderRow =
                    templateId === 'table.grid'
                      ? rowIndex < table.rows.length - 1
                      : templateId === 'table.multiRow' ||
                          templateId === 'table.multiRowSvg'
                        ? rowIndex === 0
                        : false

                  return (
                    <td
                      key={cellIndex}
                      className={getCellClassName({
                        id: templateId ?? 'table.plain',
                        mode: 'solution',
                        isInput,
                        isFirstCell: cellIndex === 0,
                        isLastCell: cellIndex === row.cells.length - 1,
                        isHeaderRow,
                        isLastRow: rowIndex === table.rows.length - 1,
                      })}
                      colSpan={row.colspan_list?.[cellIndex] || 1}
                      rowSpan={row.rowspan_list?.[cellIndex] || 1}
                    >
                      {isInput ? (
                        <MathText
                          className={getInputClassName({
                            id: templateId ?? 'table.plain',
                            mode: 'solution',
                          })}
                        >
                          {correctValues[currentInputIndex] ?? ''}
                        </MathText>
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

      <SolutionExplanation solution={solution} deps={deps} />
    </div>
  )
}
