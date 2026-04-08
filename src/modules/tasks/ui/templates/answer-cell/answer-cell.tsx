import { MathInput } from '@/ui/math-input/math-input'
import { MathText } from '@/ui/math-text/math-text'

import { getMultipleInputHandlers } from '../../../lib/get-multiple-input-handlers'
import type { TaskComponentProps } from '../../../model/types'
import { TaskDescription } from '../../common/task-description/ui/task-description'
import { TaskSolution } from '../../common/task-solution/task-solution'

import styles from './answer-cell.module.scss'

const ANSWER_CELL = 'answercell'

// console.log('ANSWER CELL IS LOADED')

export const AnswerCellTemplate = ({
  task,
  deps,
  answer,
  mathInput,
  onChange,
}: TaskComponentProps<'answerCell'>) => {
  const content = deps.global.translateTasks(task.description.content)

  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator

  const { setRef, handleChange } = getMultipleInputHandlers({
    onChange,
    separator,
    mathInput,
  })

  // content follows this pattern - "separator {sign} separator", where sign can be +-*/

  const parts = content.split(ANSWER_CELL)
  const sign = parts.filter((item) => item !== '')[0]
  const [answer1, answer2] = answer.split(separator)

  const resolvedAnswer = answer.split(separator).join(sign)
  const correctAnswer = task.solution?.answer.split(separator).join(sign) ?? ''

  return (
    <div className={styles.container}>
      <TaskDescription task={task} deps={deps} />

      {task.solution ? (
        <TaskSolution
          solution={task.solution}
          answer={resolvedAnswer}
          correctAnswer={correctAnswer}
          deps={deps}
        />
      ) : (
        <div className={styles.inputs}>
          <MathInput
            ref={setRef}
            formula={answer1 ?? ''}
            onMathFieldChanged={handleChange}
          />

          <MathText className={styles.sign}>{sign}</MathText>

          <MathInput
            ref={setRef}
            formula={answer2 ?? ''}
            onMathFieldChanged={handleChange}
          />
        </div>
      )}
    </div>
  )
}

export default AnswerCellTemplate

/**
 * Type: answerCell
 *
 * Structure:
 * - description.content: Interactive pattern (e.g., "answercell + answercell").
 * - answerInput: Keyed inputs like input1, input2.
 *
 * Solution:
 * - Expected values for each cell are stored in fields.number1, fields.number2, etc.
 *
 * Example Object:
 * {
 *   "fields": { "number1": 52127, "number2": 63206 },
 *   "description": {
 *     "content": "answercell + answercell",
 *     "type": "answerCell"
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
 *     "input2": { "type": 10 },
 *     "input1": { "type": 10 },
 *     "inline": false,
 *     "type": 20
 *   },
 *   "fields": {
 *     "number2": 63206,
 *     "number1": 52127
 *   },
 *   "title": {
 *     "aze": "Verilmiş ifadəni ədədlərlə yazın:",
 *     "eng": "Write the given expression in numbers:",
 *     "rus": "Запишите данное выражение цифрами:",
 *     "areg": "عبّر عن التعبير اللفظي التالي بالتعبير العددي:"
 *   },
 *   "description": {
 *     "type": "answerCell",
 *     "content": "answercell + answercell",
 *     "textBefore": {
 *       "aze": "Əlli i̇ki̇ min yüz iyirmi yeddi̇ üstəgəl altmış üç min i̇ki̇ yüz altı",
 *       "eng": "Fifty-two thousand one hundred twenty-seven plus sixty-three thousand two hundred six"
 *     }
 *   },
 *   "type": "Elixir.Task_4_1_70",
 *   "position": 21,
 *   "id": "add8ee98-f6c8-4ab9-9b5b-ca424adb79c1"
 * }
 *
 * Solution Object:
 * {
 *   "answer": "52127;63206",
 *   "content": {
 *     "aze": "52127 + 63206",
 *     "eng": "52127 + 63206"
 *   },
 *   "type": "text"
 * }
 */
