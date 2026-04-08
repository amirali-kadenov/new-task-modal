import { RadioButtonGroup } from '@/ui/radio-button/radio-button-group'

import type { TaskComponentProps } from '../../../model/types'
import { TaskDescription } from '../../common/task-description/ui/task-description'

import { TestSolution } from './solution'
import styles from './test.module.scss'

const getRadioValue = (index: number) => String.fromCharCode(65 + index)
// console.log('TEST IS LOADED')

export const TestTemplate = ({
  task,
  deps,
  answer,
  onChange: setAnswer,
}: TaskComponentProps<'test'>) => {
  const options = task.description.variants.map((option, index) => ({
    value: getRadioValue(index),
    label: deps.global.translateTasks(option),
  }))

  return (
    <div className={styles.container}>
      <TaskDescription task={task} deps={deps} />

      {task.solution ? (
        <TestSolution
          solution={task.solution}
          answer={answer}
          deps={deps}
          options={options}
        />
      ) : (
        <RadioButtonGroup
          className={styles.radioGroup}
          name={String(task.id)}
          options={options}
          value={answer}
          onChange={setAnswer}
        />
      )}
    </div>
  )
}

export default TestTemplate

/**
 * Type: test
 *
 * Structure:
 * - description.variants: Provides an array of translated text choices.
 * - description.question: The prompt/question.
 *
 * Solution:
 * - The index of the correct variant is determined by matching fields.number against the values in fields.variants.
 *
 * Example Object:
 * {
 *   "fields": { "variants": [20008, 40009, 10001, 80000], "number": 80000 },
 *   "description": {
 *     "variants": [ { "eng": "twenty thousand", ... }, ... ],
 *     "question": { "eng": "Select the correct name of the number 80000.", ... },
 *     "type": "test"
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
 *     "variants": [
 *       90000,
 *       30000,
 *       80000,
 *       10000
 *     ],
 *     "number": 80000
 *   },
 *   "title": null,
 *   "description": {
 *     "withAudioOnVariants": true,
 *     "withAudio": true,
 *     "variantsWidth": 150,
 *     "variantsCenter": false,
 *     "variants": [
 *       {
 *         "aze": "doxsan min",
 *         "kgz": "токсон миң",
 *         "uzb": "to'qson ming",
 *         "eng": "ninety thousand",
 *         "rus": "девяносто тысяч",
 *         "kaz": "тоқсан мың",
 *         "areg": "تسعون ألفًا",
 *         "module_name": "Elixir.Helpers.Translation"
 *       },
 *       {
 *         "aze": "otuz min",
 *         "kgz": "отуз миң",
 *         "uzb": "o'ttiz ming",
 *         "eng": "thirty thousand",
 *         "rus": "тридцать тысяч",
 *         "kaz": "отыз мың",
 *         "areg": "ثلاثون ألفًا",
 *         "module_name": "Elixir.Helpers.Translation"
 *       },
 *       {
 *         "aze": "səksən min",
 *         "kgz": "сексен миң",
 *         "uzb": "sakson ming",
 *         "eng": "eighty thousand",
 *         "rus": "восемьдесят тысяч",
 *         "kaz": "сексен мың",
 *         "areg": "ثمانون ألفًا",
 *         "module_name": "Elixir.Helpers.Translation"
 *       },
 *       {
 *         "aze": "on min",
 *         "kgz": "он миң",
 *         "uzb": "o'n ming",
 *         "eng": "ten thousand",
 *         "rus": "десять тысяч",
 *         "kaz": "он мың",
 *         "areg": "عشرة آلاف",
 *         "module_name": "Elixir.Helpers.Translation"
 *       }
 *     ],
 *     "type": "test",
 *     "question": {
 *       "aze": "80000 ədədinin sözlərlə düzgün yazılışını seçin:",
 *       "kgz": "80000 санынын туура окулушун көрсөтүңүз.",
 *       "uzb": "80000 sonining to'g'ri o'qilishini ko'rsating.",
 *       "eng": "Select the correct name of the number 80000.",
 *       "rus": "Укажите правильное чтение числа 80000.",
 *       "kaz": "80000 санының дұрыс аталуын көрсетіңіз.",
 *       "areg": "اختر الصيغة اللفظية التي تعبر عن العدد 80000.",
 *       "module_name": "Elixir.Helpers.Translation"
 *     }
 *   },
 *   "type": "Elixir.Task_4_1_2",
 *   "position": 10,
 *   "id": "cb591909-1fef-4647-b13c-2be3adbcf9ab"
 * }
 *
 * Solution Object:
 * {
 *   "answer": "",
 *   "parts": [
 *     {
 *       "type": 10,
 *       "content": {
 *         "aze": "80000 ədədinin sözlərlə düzgün yazılışı:",
 *         "eng": "Correct reading of numbers 80000:"
 *       },
 *       "center": true
 *     },
 *     {
 *       "type": 180,
 *       "variants": [
 *         {
 *           "aze": "səkkiz min",
 *           "correct": false
 *         },
 *         {
 *           "aze": "doxsan min",
 *           "correct": false
 *         },
 *         {
 *           "aze": "səksən min",
 *           "correct": true
 *         },
 *         {
 *           "aze": "yetmiş min",
 *           "correct": false
 *         }
 *       ]
 *     }
 *   ],
 *   "type": "complex"
 * }
 */
