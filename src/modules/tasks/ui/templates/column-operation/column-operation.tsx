import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { MathInput } from '@/ui/math-input/math-input'

import { setMathInputRef } from '../../../lib/set-math-input-ref'
import type { TaskComponentProps } from '../../../model/types'
import { TaskSolutionOrControl } from '../../common/task-solution/task-solution-or-control'

import styles from './column-operation.module.scss'

const ColumnOperationTemplate = ({
  task,
  deps,
  answer,
  onChange: setAnswer,
  mathInput,
}: TaskComponentProps<'columnOperation'>) => {
  return (
    <>
      <TaskDescription task={task} deps={deps} />

      <TaskSolutionOrControl
        task={task}
        answer={answer}
        deps={deps}
        control={
          <MathInput
            ref={(ref) => setMathInputRef(ref, mathInput)}
            formula={answer}
            onMathFieldChanged={setAnswer}
            className={styles.input}
          />
        }
      />
    </>
  )
}

export default ColumnOperationTemplate

/**
 * Type: columnOperation
 *
 * Structure:
 * - description.content: LaTeX block (\begin{array}) representing vertical arithmetic.
 *
 * Solution:
 * - Result of the operation on operands fields.number1 and fields.number2.
 *
 * Example Object:
 * {
 *   "fields": { "number1": 71208, "number2": 4 },
 *   "description": {
 *     "content": "\\begin{array}{c}\\phantom{99}71208\\\\[-6pt]\\underline{{}^{{}^{{}^{+}}}\\smash{\\phantom{99999}4}}\\\\[-6pt]\\end{array}",
 *     "type": "columnOperation"
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
 *     "before": "",
 *     "after": "",
 *     "text": " ",
 *     "down": "",
 *     "up": "",
 *     "type": 10
 *   },
 *   "fields": {
 *     "number2": 4,
 *     "number1": 71208
 *   },
 *   "title": {
 *     "aze": "Hesablayın (cavabda yalnız sonda tapılan qiyməti daxil edin):",
 *     "eng": "Calculate (enter only the final value as your answer):"
 *   },
 *   "description": {
 *     "content": "\\begin{array}{c}\n\\phantom{99}71208\\\\[-6pt]\n\\underline{\n  {}^{{}^{{}^{+}}}\n  \\smash{\\phantom{99999}4}\n}\\\\[-6pt]\n\n\n\\end{array}\n",
 *     "type": "columnOperation"
 *   },
 *   "type": "Elixir.Task_4_1_28",
 *   "position": 0,
 *   "id": "347cf7b0-c866-4f13-a0a5-b7243ae3cf1e"
 * }
 *
 * Solution Object:
 * {
 *   "answer": "71212",
 *   "parts": [
 *     {
 *       "type": 10,
 *       "content": {
 *         "aze": "\\begin{array}{c} 71208 \\\\ + \\\\ \\phantom{0000}4 \\\\ \\hline 71212 \\end{array}",
 *         "eng": "\\begin{array}{c} 71208 \\\\ + \\\\ \\phantom{0000}4 \\\\ \\hline 71212 \\end{array}"
 *       },
 *       "center": true
 *     }
 *   ],
 *   "type": "complex"
 * }
 */
