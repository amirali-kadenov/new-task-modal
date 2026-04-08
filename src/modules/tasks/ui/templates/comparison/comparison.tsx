import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { MathInput } from '@/ui/math-input/math-input'
import { MathText } from '@/ui/math-text/math-text'

import { setMathInputRef } from '../../../lib/set-math-input-ref'
import type { TaskComponentProps } from '../../../model/types'
import { TaskSolutionOrControl } from '../../common/task-solution/task-solution-or-control'

import styles from './comparison.module.scss'

const ComparisonTemplate = ({
  task,
  deps,
  answer,
  onChange,
  mathInput,
}: TaskComponentProps<'comparison'>) => {
  return (
    <>
      <TaskDescription task={task} deps={deps} />

      <div className={styles.container}>
        <div className={styles.side}>
          <MathText>{String(task.description.first)}</MathText>
        </div>

        <TaskSolutionOrControl
          task={task}
          answer={answer}
          deps={deps}
          control={
            <MathInput
              ref={(ref) => setMathInputRef(ref, mathInput)}
              formula={answer}
              onMathFieldChanged={onChange}
              className={styles.input}
              useExtendedKeyboard={false}
            />
          }
        />

        <div className={styles.side}>
          <MathText>{String(task.description.second)}</MathText>
        </div>
      </div>
    </>
  )
}

export default ComparisonTemplate
