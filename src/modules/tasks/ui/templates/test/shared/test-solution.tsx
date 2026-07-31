import {
  getCorrectAnswerFromSolution,
  isComplexSolution,
  SolutionFigureType,
} from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Translation } from '@/types/api/task'
import { isHtmlRadioLabel } from '@/ui/radio-button/radio-button'

import { getTestRadioValue, getTestVariants } from '../lib/get-test-variants'
import type { TestTask } from '../lib/types.task'

import { TestFigures } from './test-figures'
import { TestOptions } from './test-options'
import { TestQuestion } from './test-question'
import styles from './test.module.scss'

type Props = TaskSolutionComponentProps<TestTask>

/** Solution view for test templates. */
export const TestSolution = ({ task, deps, answer, solution }: Props) => {
  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const options = getTestVariants(task.description.variants, translate)

  let correctValue = getCorrectAnswerFromSolution(solution, translate)

  if (!correctValue && isComplexSolution(solution)) {
    const mcPart = solution.parts?.find(
      (part) => part.type === SolutionFigureType.MultipleChoice,
    )
    const correctIndex = mcPart?.variants?.findIndex(
      (variant) => variant.isCorrect || variant.correct,
    )
    if (correctIndex != null && correctIndex >= 0) {
      correctValue = getTestRadioValue(correctIndex)
    }
  }

  if (!correctValue && task.description.correctAnswer) {
    correctValue = String(task.description.correctAnswer)
  }

  const userOption = options.find((option) => option.value === answer)
  const correctOption = options.find((option) => option.value === correctValue)

  // HTML/SVG labels are shown in TestOptions below — panel shows letters only.
  const userAnswerForPanel =
    userOption && isHtmlRadioLabel(userOption.label)
      ? answer
      : (userOption?.label ?? answer)
  const correctAnswerForPanel =
    correctOption && isHtmlRadioLabel(correctOption.label)
      ? correctValue
      : (correctOption?.label ?? correctValue)

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <TestQuestion description={task.description} deps={deps} />
      <TestFigures description={task.description} deps={deps} />

      <SolutionAnswerPanel
        userAnswer={userAnswerForPanel}
        correctAnswer={correctAnswerForPanel}
        deps={deps}
      />

      <TestOptions
        name={`${task.id}-solution`}
        options={options}
        value={correctValue}
        onChange={() => {}}
        description={task.description}
        readOnly
      />

      <SolutionExplanation solution={solution} deps={deps} />
    </div>
  )
}
