import { clsx } from 'clsx'

import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { MathInput } from '@/ui/math-input/math-input'
import { MathText } from '@/ui/math-text/math-text'

import { getMultipleInputHandlers } from '../../../lib/get-multiple-input-handlers'
import type { TaskComponentProps } from '../../../model/types'
import { TaskSolutionOrControl } from '../../common/task-solution/task-solution-or-control'

import styles from './table.module.scss'

const TableTemplate = ({
  task,
  deps,
  answer,
  onChange,
  mathInput,
}: TaskComponentProps<'table'>) => {
  const table = task.description.table
  if (!table) return <TaskDescription task={task} deps={deps} />

  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const { setRef, handleChange } = getMultipleInputHandlers({
    onChange,
    separator,
    mathInput,
  })

  const answerValues = answer.split(separator)
  let inputIndex = 0

  return (
    <div className={styles.container}>
      <TaskDescription task={task} deps={deps} />

      <TaskSolutionOrControl
        task={task}
        answer={answer}
        deps={deps}
        control={
          <div className={styles.tableWrapper}>
            <table className={styles.table} style={{ width: table.width }}>
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

                      return (
                        <td
                          key={cellIndex}
                          className={clsx(
                            styles.cell,
                            isInput && styles.inputCell,
                          )}
                          colSpan={row.colspan_list?.[cellIndex] || 1}
                          rowSpan={row.rowspan_list?.[cellIndex] || 1}
                        >
                          {isInput ? (
                            <MathInput
                              id={`table-input-${currentInputIndex}`}
                              ref={setRef}
                              formula={answerValues[currentInputIndex] ?? ''}
                              onMathFieldChanged={handleChange}
                              className={styles.input}
                            />
                          ) : (
                            <MathText>{content}</MathText>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      />
    </div>
  )
}

export default TableTemplate

/**
 * Type: table
 *
 * Structure:
 * - description.table: Object containing rows and cells, some of which are 'answercell' (placeholders for inputs).
 *
 * Solution:
 * - Values mapped to table inputs, usually listed in fields (number1, number2, etc.) in the order they appear in the table.
 *
 * Example Object:
 * {
 *   "fields": { "number1": 4, "number2": 4, "number3": 3 },
 *   "description": {
 *     "table": {
 *       "rows": [
 *         { "cells": [ { "eng": "Header", ... }, "answercell" ] }
 *       ]
 *     },
 *     "type": "table"
 *   }
 * }
 *
 * Full Task Object:
 * {
 *   "attemptsCount": null,
 *   "isPrimary": true,
 *   "hasVideoUrl": true,
 *   "isPenalty": false,
 *   "answerInput": {
 *     "svg": "",
 *     "type": 15
 *   },
 *   "fields": {
 *     "number5": 6,
 *     "number4": 4,
 *     "number3": 3
 *   },
 *   "title": { "eng": "Fill in the table.", "rus": "Заполните таблицу." },
 *   "description": {
 *     "type": "table",
 *     "table": {
 *       "width": "100%",
 *       "rows": [
 *         {
 *           "cells": [
 *             { "aze": "Siniflər", "eng": "Class" },
 *             { "aze": "I sinif", "eng": "I - class" }
 *           ]
 *         },
 *         {
 *           "cells": [
 *             { "aze": "Mərtəbələr", "eng": "Places" },
 *             "answercell"
 *           ]
 *         }
 *       ]
 *     }
 *   },
 *   "type": "Elixir.Task_4_1_56",
 *   "position": 21,
 *   "id": "835a7a76-d74e-4c83-b7fa-d4812a488bc6"
 * }
 *
 * Solution Object:
 * {
 *   "answer": "4;4",
 *   "parts": [
 *     {
 *       "type": 10,
 *       "content": {
 *         "aze": "Qırx dörd min üç yüz qırx dörd ədədi rəqəmlərlə bu cür yazılır: 44344.\nBeləliklə, 44344 ədədində 4 onminlik, 4 minlik, 3 yüzlük, 4 onluq və 4 təklik var.",
 *         "eng": "The number forty-four thousand three hundred forty-four is written in numerals as 44344.\nTherefore, the number 44344 contains 4 ten-thousands, 4 thousands, 3 hundreds, 4 tens, and 4 ones."
 *       }
 *     },
 *     {
 *       "type": 120,
 *       "rows": [
 *         {
 *           "parts": ["Mərtəbə", "Onluq minlik", "Minlik", "Yüzlük", "Onluq", "Birlik"],
 *           "type": "row"
 *         },
 *         {
 *           "parts": ["Rəqəm", "4", "4", "3", "4", "4"],
 *           "type": "row"
 *         }
 *       ]
 *     }
 *   ],
 *   "type": "complex"
 * }
 */
