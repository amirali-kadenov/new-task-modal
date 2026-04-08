import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type {
  Task,
  TaskDescriptionAnswerCell,
  TaskDescriptionTest,
  Translation,
} from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'

export const getDescriptionTranslation = <T extends TaskDescriptionType>(
  task: Task<T>,
  deps: TaskModalDependencies,
) => {
  const description = task.description

  let result: Translation | '' =
    description?.content !== undefined ? description.content : ''

  if (description.type === deps.enums.TaskDescriptionType.Text) {
    result = description.content
  }

  if (description.type === deps.enums.TaskDescriptionType.Test) {
    result = (description as TaskDescriptionTest).question
  }

  if (description.type === deps.enums.TaskDescriptionType.AnswerCell) {
    result = (description as TaskDescriptionAnswerCell).textBefore
  }

  if (description.type === deps.enums.TaskDescriptionType.Equation) {
    result = (description as TaskDescriptionEquation).content
  }

  if (description.type === deps.enums.TaskDescriptionType.Comparison) {
    // Comparison often doesn't have a content field, it might rely on title
    // But if it has text_before, we use it.
    result = (description as any).text_before || ''
  }

  return deps.global.translateTasks(result)
}
