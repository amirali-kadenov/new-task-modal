import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'

import { ComparisonDescriptionExtras } from '../shared/comparison-description-extras'
import { ComparisonRow } from '../shared/comparison-row'
import { ComparisonSolution } from '../shared/comparison-solution'
import styles from '../shared/comparison.module.scss'

import type { ComparisonTask } from './types.task'

interface ComparisonTemplateConfig {
  /** templateId, e.g. `comparison.plain`. */
  id: string
}

/** Single MathInput comparison: title + extras + first | input | second. */
export const createComparisonTemplate = ({
  id,
}: ComparisonTemplateConfig) => {
  const ComparisonTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<ComparisonTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <ComparisonSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
        />
      )
    }

    return (
      <div className={styles.root} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <ComparisonDescriptionExtras
          description={task.description}
          deps={deps}
        />
        <ComparisonRow
          description={task.description}
          deps={deps}
          answer={answer}
          mode="input"
          onChange={onChange}
          mathInputRef={(ref) => setMathInputRef(ref, mathInput)}
        />
      </div>
    )
  }

  ComparisonTemplate.displayName = id

  return ComparisonTemplate
}
