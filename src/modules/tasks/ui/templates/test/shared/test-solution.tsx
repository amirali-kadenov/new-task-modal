import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Translation } from '@/types/api/task'

import { getTestCorrectValue } from '../lib/get-test-correct-value'
import {
  getTestOptionDisplayValue,
  getTestVariants,
} from '../lib/get-test-variants'
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
  const correctValue = getTestCorrectValue(
    task.description,
    solution,
    translate,
  )

  const userAnswerForPanel = getTestOptionDisplayValue(options, answer)
  const correctAnswerForPanel = getTestOptionDisplayValue(options, correctValue)

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

      <SharedSolutionBody solution={solution} deps={deps} />
    </div>
  )
}
