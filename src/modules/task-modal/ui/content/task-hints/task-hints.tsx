import { useAppState } from '@/modules/task-modal/model/store/task-modal-store'

import s from './task-hints.module.scss'

/** Minimal string hints under the task (Storybook / new modal). */
export const TaskHints = () => {
  const { activeTask } = useAppState()
  const hint1 = activeTask?.hint1
  const hint2 = activeTask?.hint2

  if (!hint1 && !hint2) return null

  return (
    <div className={s.root} data-testid="task-hints">
      {hint1 ? (
        <p className={s.hint} data-testid="task-hint-1">
          {hint1}
        </p>
      ) : null}
      {hint2 ? (
        <p className={s.hint} data-testid="task-hint-2">
          {hint2}
        </p>
      ) : null}
    </div>
  )
}
