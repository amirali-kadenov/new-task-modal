import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { MathInput } from '@/ui/math-input/math-input'

import { ColumnOperationDescription } from '../shared/column-operation-description'
import { ColumnOperationSolution } from '../shared/column-operation-solution'
import styles from '../shared/column-operation.module.scss'

import type { ColumnOperationTask } from './types.task'

interface SimpleColumnOperationTemplateConfig {
  /** templateId, e.g. `columnOperation.plain`. */
  id: string
}

/** Single `MathInput` columnOperation template. */
export const createSimpleColumnOperationTemplate = ({
  id,
}: SimpleColumnOperationTemplateConfig) => {
  const SimpleColumnOperationTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<ColumnOperationTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <ColumnOperationSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
        />
      )
    }

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <ColumnOperationDescription task={task} deps={deps} />
        <MathInput
          ref={(ref) => setMathInputRef(ref, mathInput)}
          formula={answer}
          onMathFieldChanged={onChange}
          className={styles.input}
        />
      </div>
    )
  }

  SimpleColumnOperationTemplate.displayName = id

  return SimpleColumnOperationTemplate
}
