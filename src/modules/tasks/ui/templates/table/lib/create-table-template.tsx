import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { TableSolution } from '../shared/table-solution'
import styles from '../shared/table.module.scss'

import {
  getCellClassName,
  getInputClassName,
  getTableClassName,
} from './get-table-classnames'
import { TableStaticCellContent } from './render-table-cell-content'
import type { TableTask } from './types.task'

interface TableTemplateConfig {
  /** templateId, e.g. `table.plain`. */
  id: string
}

/** Table grid with dynamic `answercell` MathInputs. */
export const createTableTemplate = ({ id }: TableTemplateConfig) => {
  const TableTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<TableTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <TableSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          templateId={id}
        />
      )
    }

    const table = task.description.table
    if (!table) {
      return (
        <div
          className={styles.container}
          data-template-id={id}
          data-mode="input"
        >
          <TaskTitle title={task.title} deps={deps} />
          <TaskDescription
            task={task as unknown as Task<'table'>}
            deps={deps}
          />
        </div>
      )
    }

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const { bindRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
    })

    const answerValues = splitMultiAnswer(answer, separator)
    let inputIndex = 0

    return (
      <div className={styles.container} data-template-id={id} data-mode="input">
        <TaskTitle title={task.title} deps={deps} />
        <TaskDescription task={task as unknown as Task<'table'>} deps={deps} />

        <div className={styles.tableWrapper}>
          <table
            className={getTableClassName({
              id,
              mode: 'input',
              removeBorders: table.removeBorders,
              removePadding: table.removePadding,
            })}
            style={{
              width:
                id === 'table.list' ||
                id === 'table.mixed' ||
                id === 'table.inline'
                  ? '100%'
                  : table.width,
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
                      id === 'table.grid'
                        ? rowIndex < table.rows.length - 1
                        : id === 'table.multiRow' || id === 'table.multiRowSvg'
                          ? rowIndex === 0
                          : false

                    return (
                      <td
                        key={cellIndex}
                        className={getCellClassName({
                          id,
                          mode: 'input',
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
                          <MathInput
                            id={`table-input-${currentInputIndex}`}
                            ref={bindRef(`table-input-${currentInputIndex}`)}
                            formula={answerValues[currentInputIndex] ?? ''}
                            onMathFieldChanged={handleChange}
                            className={getInputClassName({ id, mode: 'input' })}
                          />
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
      </div>
    )
  }

  TableTemplate.displayName = id

  return TableTemplate
}
