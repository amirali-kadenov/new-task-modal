import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Translation } from '@/types/api/task'

import { getTestVariants } from './get-test-variants'
import type { TestTask } from './types.task'
import { TestFigures } from '../shared/test-figures'
import { TestOptions } from '../shared/test-options'
import { TestQuestion } from '../shared/test-question'
import { TestSolution } from '../shared/test-solution'
import styles from '../shared/test.module.scss'

interface TestTemplateConfig {
  /** templateId, e.g. `test.plain`. */
  id: string
}

/** Multiple-choice test: title + question + optional figures + radios. */
export const createTestTemplate = ({ id }: TestTemplateConfig) => {
  const TestTemplate = ({
    task,
    deps,
    answer,
    onChange,
  }: TaskComponentProps<TestTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <TestSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
        />
      )
    }

    const translate = (value: Translation | string) =>
      deps.global.translateTasks(value)

    const options = getTestVariants(task.description.variants, translate)

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <TestQuestion description={task.description} deps={deps} />
        <TestFigures description={task.description} deps={deps} />
        <TestOptions
          name={String(task.id)}
          options={options}
          value={answer}
          onChange={onChange}
          description={task.description}
        />
      </div>
    )
  }

  TestTemplate.displayName = id

  return TestTemplate
}
