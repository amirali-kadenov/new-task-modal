import {
  TaskSolution,
  type TaskSolutionProps,
} from '../../common/task-solution/task-solution'

interface Props extends Omit<TaskSolutionProps, 'correctAnswer'> {
  options: {
    label: string
    value: string
  }[]
}

export const TestSolution = ({ solution, answer, deps, options }: Props) => {
  const answerOption = options.find((option) => option.value === answer)
  const correctAnswerOption = options.find(
    (option) => option.value === solution.answer,
  )
  return (
    <TaskSolution
      solution={solution}
      answer={answerOption?.label ?? ''}
      correctAnswer={correctAnswerOption?.label ?? ''}
      deps={deps}
    />
  )
}

/**
 * Type: test (Solution)
 *
 * Structure:
 * - options: Array of objects with label (translated text) and value (letter id).
 *
 * Solution:
 * - The correct answer is typically resolved by matching the user's choice (answer)
 *   against the solution's correct value.
 *
 * Example Object:
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
 *     "difficulty": "x1",
 *     "variants": [90000, 30000, 80000, 10000],
 *     "number": 80000
 *   },
 *   "title": null,
 *   "description": {
 *     "withAudioOnVariants": true,
 *     "variants": [
 *       { "eng": "ninety thousand", ... },
 *       { "eng": "thirty thousand", ... },
 *       { "eng": "eighty thousand", ... },
 *       { "eng": "ten thousand", ... }
 *     ],
 *     "type": "test",
 *     "question": { "eng": "Select the correct name of the number 80000.", ... }
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
