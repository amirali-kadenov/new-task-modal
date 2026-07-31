import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'

import { AnswerCellDescriptionExtras } from '../shared/answer-cell-description-extras'
import { AnswerCellRow } from '../shared/answer-cell-row'
import { AnswerCellSolution } from '../shared/answer-cell-solution'
import styles from '../shared/answer-cell.module.scss'

import type { AnswerCellTask } from './types.task'

interface MultiAnswerCellTemplateConfig {
  id: string
  layout: 'stack' | 'inline'
  inputCount: number
  withBefore?: boolean
  withAfter?: boolean
}

/**
 * Multi-input answerCell template. Cells are still interleaved in content
 * (ME); `layout` is recorded on the root for parity with other families.
 */
export const createMultiAnswerCellTemplate = ({
  id,
  layout,
  withBefore = false,
  withAfter = false,
}: MultiAnswerCellTemplateConfig) => {
  const MultiAnswerCellTemplate = ({
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
          multi
        />
      )
    }

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const { setRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
    })

    return (
      <div
        className={styles.container}
        data-template-id={id}
        data-layout={layout}
      >
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
          multi
          setRef={setRef}
          onChange={handleChange}
        />
      </div>
    )
  }

  MultiAnswerCellTemplate.displayName = id

  return MultiAnswerCellTemplate
}
