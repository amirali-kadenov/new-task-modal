import { useAppState } from '@/modules/task-modal/model/store/task-modal-store'

import styles from './tasks-num.module.scss'

export const TasksNum = () => {
  const { activeTask, tasks, initialTasksCount } = useAppState()

  if (!tasks?.length) return null

  const index = tasks.findIndex((task) => task.id === activeTask?.id)
  if (index === -1) return null

  const taskNum = `№${index + 1}`
  const tasksCount = tasks.length
  const hasAdditionalTasks = tasksCount > initialTasksCount

  return (
    <span data-testid="tasks-num">
      {taskNum}

      {'/'}

      {hasAdditionalTasks ? (
        <>
          <span className={styles.strikethrough}>{initialTasksCount}</span>{' '}
          {tasksCount}
        </>
      ) : (
        tasksCount
      )}
    </span>
  )
}
