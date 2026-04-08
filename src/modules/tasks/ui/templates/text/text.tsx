import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { MathInput } from '@/ui/math-input/math-input'

import { setMathInputRef } from '../../../lib/set-math-input-ref'
import type { TaskComponentProps } from '../../../model/types'
import { TaskSolutionOrControl } from '../../common/task-solution/task-solution-or-control'

import styles from './text.module.scss'

const TextTemplate = ({
  task,
  deps,
  answer,
  onChange,
  mathInput,
}: TaskComponentProps<'text'>) => {
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
            onMathFieldChanged={onChange}
            className={styles.input}
          />
        }
      />
    </>
  )
}

export default TextTemplate

/**
 * Type: text / formula
 *
 * Structure:
 * - description.content: standard translated string or math expression (e.g., "23 \approx")
 * - answerInput.text: placeholder for the result
 *
 * Solution:
 * - Found in fields.number or fields.answer. For formulas, the calculated result is in fields.number.
 *
 * Example Object:
 * {
 *   "fields": { "number": 60000 },
 *   "description": {
 *     "content": { "eng": "Write the number sixty thousand in numerals.", ... },
 *     "type": "text"
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
 *   "difficulty": "x1",
 *   "result": "none",
 *   "fields": {
 *     "difficulty": "x1",
 *     "number": 60000
 *   },
 *   "title": null,
 *   "description": {
 *     "with_audio": true,
 *     "content": {
 *       "with_audio_player": false,
 *       "aze": "Altmış min ədədini rəqəmlərlə yazın.",
 *       "kgz": "Алтымыш миң санын цифра менен жазыңыз.",
 *       "uzb": "Oltmish ming sonini raqamlar bilan yozing.",
 *       "eng": "Write the number sixty thousand in numerals.",
 *       "rus": "Запишите цифрами число шестьдесят тысяч.",
 *       "kaz": "Алпыс мың санын цифрмен жазыңыз.",
 *       "arjd": "",
 *       "arsa": "",
 *       "areg": "اكتب العدد «ستون ألفًا» بالصيغة القياسية",
 *       "module_name": "Elixir.Helpers.Translation"
 *     },
 *     "type": "text"
 *   },
 *   "type": "Elixir.Task_4_1_1",
 *   "position": 0,
 *   "id": "55aff81c-71ba-41a5-aebd-01650c71bc1d"
 * }
 *
 * Solution Object:
 * {
 *   "answer": "60000",
 *   "content": "",
 *   "type": "text"
 * }
 */
