import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { MathInput } from '@/ui/math-input/math-input'

import { getMultipleInputHandlers } from '../../../lib/get-multiple-input-handlers'
import type { TaskComponentProps } from '../../../model/types'
import { TaskSolutionOrControl } from '../../common/task-solution/task-solution-or-control'

import styles from './multi-input.module.scss'

const MultiInputTemplate = ({
  task,
  deps,
  answer,
  onChange,
  mathInput,
}: TaskComponentProps<'answerCell'>) => {
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const { setRef, handleChange } = getMultipleInputHandlers({
    onChange,
    separator,
    mathInput,
  })

  const answerValues = answer.split(separator)

  // Extract inputs from answerInput
  // They are usually like input1, input2...
  const inputEntries = Object.entries(task.answerInput || {})
    .filter(([key]) => key.startsWith('input'))
    .sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className={styles.container}>
      <TaskDescription task={task} deps={deps} />

      <TaskSolutionOrControl
        task={task}
        answer={answer}
        deps={deps}
        control={
          <div className={styles.inputs}>
            {inputEntries.map(([key, config], index) => {
              const label = deps.global.translateTasks(config.before)
              return (
                <div key={key} className={styles.field}>
                  {label && <span className={styles.label}>{label}</span>}
                  <MathInput
                    id={key}
                    ref={setRef}
                    formula={answerValues[index] ?? ''}
                    onMathFieldChanged={handleChange}
                    className={styles.input}
                  />
                </div>
              )
            })}
          </div>
        }
      />
    </div>
  )
}

export default MultiInputTemplate

/**
 * Type: multi-input
 *
 * Structure:
 * - answerInput: multiple keyed inputs (input1, input2, etc.)
 *
 * Solution:
 * - Found in fields.number1, fields.number2, etc. (mapped to corresponding input keys)
 *
 * Example Object:
 * {
 *   "fields": { "number1": 10, "number2": 2 },
 *   "answerInput": {
 *     "input1": { "before": { "eng": "Quotient", ... } },
 *     "input2": { "before": { "eng": "Remainder", ... } }
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
 *     "input2": {
 *       "before": { "aze": "qalıq:", "eng": "remainder:", "rus": "остаток:" },
 *       "type": 10
 *     },
 *     "input1": {
 *       "before": { "aze": "qismət:", "eng": "quotient:", "rus": "частное:" },
 *       "type": 10
 *     },
 *     "inline": true,
 *     "type": 20
 *   },
 *   "fields": {
 *     "number1": 4567,
 *     "number2": 123
 *   },
 *   "type": "Elixir.Task_4_9_12",
 *   "position": 0,
 *   "id": "cf9c8e3d-503c-40c9-864e-28e5a47efb9d"
 * }
 *
 * Solution Object:
 * {
 *   "answer": "37;16",
 *   "parts": [
 *     {
 *       "type": 10,
 *       "content": {
 *         "aze": "\\begin{array}{l|l} 4567 & 123 \\\\ \\cline{2-2} 369 & 37 \\\\ \\hline \\phantom{0}877 & \\\\ \\phantom{0}861 & \\\\ \\hline \\phantom{00}16 & \\end{array}",
 *         "eng": "\\begin{array}{l|l} 4567 & 123 \\\\ \\cline{2-2} 369 & 37 \\\\ \\hline \\phantom{0}877 & \\\\ \\phantom{0}861 & \\\\ \\hline \\phantom{00}16 & \\end{array}"
 *       },
 *       "center": true
 *     }
 *   ],
 *   "type": "complex"
 * }
 */
