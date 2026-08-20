import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'

import { EquationAnswerRow } from '../equation-answer-row'
import { EquationContent } from '../equation-content'
import { EquationSolution } from '../equation-solution'
import styles from '../equation.module.scss'

import type { EquationTask } from './types.task'

interface EquationTemplateConfig {
  /** templateId, e.g. `equation.before`. */
  id: string
  withBefore?: boolean
  withAfter?: boolean
}

/** Equation: title + content + optional before/after around MathInput. */
export const createEquationTemplate = ({
  id,
  withBefore = false,
  withAfter = false,
}: EquationTemplateConfig) => {
  const EquationTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<EquationTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <EquationSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          withBefore={withBefore}
          withAfter={withAfter}
        />
      )
    }

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <EquationContent description={task.description} deps={deps} />
        <EquationAnswerRow
          answerInput={task.answerInput}
          deps={deps}
          answer={answer}
          mode="input"
          withBefore={withBefore}
          withAfter={withAfter}
          onChange={onChange}
          mathInputRef={(ref) => setMathInputRef(ref, mathInput)}
        />
      </div>
    )
  }

  EquationTemplate.displayName = id

  return EquationTemplate
}
