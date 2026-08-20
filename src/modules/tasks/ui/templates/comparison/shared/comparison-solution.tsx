import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'

import type { ComparisonTask } from '../lib/types.task'

import { ComparisonDescriptionExtras } from './comparison-description-extras'
import { ComparisonRow } from './comparison-row'
import styles from './comparison.module.scss'

type Props = TaskSolutionComponentProps<ComparisonTask>

/** Solution view for comparison templates. */
export const ComparisonSolution = ({ task, deps, answer, solution }: Props) => {
  const correctAnswer = getCorrectAnswerFromSolution(solution, (value) =>
    deps.global.translateTasks(value),
  )

  return (
    <div className={styles.root}>
      <TaskTitle title={task.title} deps={deps} />
      <ComparisonDescriptionExtras description={task.description} deps={deps} />

      <SolutionAnswerPanel
        userAnswer={answer}
        correctAnswer={correctAnswer}
        deps={deps}
      />

      <ComparisonRow
        description={task.description}
        deps={deps}
        answer={correctAnswer}
        mode="solution"
      />

      <SharedSolutionBody solution={solution} deps={deps} />
    </div>
  )
}
