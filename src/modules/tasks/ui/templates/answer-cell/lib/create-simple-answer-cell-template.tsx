import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'

import { AnswerCellDescriptionExtras } from '../shared/answer-cell-description-extras'
import { AnswerCellRow } from '../shared/answer-cell-row'
import { AnswerCellSolution } from '../shared/answer-cell-solution'
import styles from '../shared/answer-cell.module.scss'

import type { AnswerCellTask } from './types.task'

interface SimpleAnswerCellTemplateConfig {
  id: string
  withBefore?: boolean
  withAfter?: boolean
  /** Keep solution-mode content row centered instead of the default end-alignment. */
  solutionAlignCenter?: boolean
}

/** Single-answerInput answerCell template (1+ cells from content tokens). */
export const createSimpleAnswerCellTemplate = ({
  id,
  withBefore = false,
  withAfter = false,
  solutionAlignCenter = false,
}: SimpleAnswerCellTemplateConfig) => {
  const SimpleAnswerCellTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<AnswerCellTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <AnswerCellSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          withBefore={withBefore}
          withAfter={withAfter}
          multi={false}
          solutionAlignCenter={solutionAlignCenter}
        />
      )
    }

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <AnswerCellDescriptionExtras
          description={task.description}
          deps={deps}
        />
        <AnswerCellRow
          description={task.description}
          answerInput={task.answerInput}
          deps={deps}
          answer={answer}
          mode="input"
          withBefore={withBefore}
          withAfter={withAfter}
          multi={false}
          onChange={onChange}
          mathInputRef={(ref) => setMathInputRef(ref, mathInput)}
          taskType={task.type}
        />
      </div>
    )
  }

  SimpleAnswerCellTemplate.displayName = id

  return SimpleAnswerCellTemplate
}
