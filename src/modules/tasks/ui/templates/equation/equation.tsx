import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { MathInput } from '@/ui/math-input/math-input'
import { MathText } from '@/ui/math-text/math-text'

import { setMathInputRef } from '../../../lib/set-math-input-ref'
import type { TaskComponentProps } from '../../../model/types'
import { TaskSolutionOrControl } from '../../common/task-solution/task-solution-or-control'

import styles from './equation.module.scss'

const EquationTemplate = ({
  task,
  deps,
  answer,
  onChange,
  mathInput,
}: TaskComponentProps<'equation'>) => {
  const beforeText = deps.global.translateTasks(task.answerInput?.before || '')

  return (
    <div className={styles.container}>
      <TaskDescription task={task} deps={deps} className={styles.description} />

      <TaskSolutionOrControl
        task={task}
        answer={answer}
        deps={deps}
        control={
          <div className={styles.inputWrapper}>
            {beforeText && (
              <MathText className={styles.beforeText}>{beforeText}</MathText>
            )}
            <MathInput
              ref={(ref) => setMathInputRef(ref, mathInput)}
              formula={answer}
              onMathFieldChanged={onChange}
              className={styles.input}
            />
          </div>
        }
      />
    </div>
  )
}

export default EquationTemplate
