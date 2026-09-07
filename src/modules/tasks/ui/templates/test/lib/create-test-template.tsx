import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Translation } from '@/types/api/task'

import { TestFigures } from '../shared/test-figures'
import { TestOptions } from '../shared/test-options'
import { TestQuestion } from '../shared/test-question'
import { TestSolution } from '../shared/test-solution'
import styles from '../shared/test.module.scss'

import { getTestVariants } from './get-test-variants'
import type { TestTask } from './types.task'

/*
 * The host dictionary has no key for this yet, so the Russian line is the
 * fallback: a pupil facing an untranslated interface is a smaller failure
 * than a pupil who is never told that several answers may be picked.
 */
const multipleHint = (deps: TaskComponentProps<TestTask>['deps']): string =>
  deps.localize?.pickEveryFittingOption ?? 'Выберите все подходящие варианты'

interface TestTemplateConfig {
  /** templateId, e.g. `test.plain`. */
  id: string
}

/**
 * Multiple-choice test: title + question + optional figures + options.
 *
 *  arrives from the backend and decides the mechanic:
 * radios for one correct answer, checkboxes for several. Until it was read,
 * a task with several correct answers could not be answered at all — the
 * pupil had one radio for four right options.
 */
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
          multiple={Boolean(task.hasMultipleAnswers)}
          multipleHint={multipleHint(deps)}
        />
      </div>
    )
  }

  TestTemplate.displayName = id

  return TestTemplate
}
