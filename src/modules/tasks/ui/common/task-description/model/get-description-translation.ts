import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { applyTaskFields } from '@/modules/tasks/lib/apply-task-fields'
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

  let result: Translation | string =
    (description as { content?: Translation | string }).content ?? ''

  if (description.type === deps.enums.TaskDescriptionType.Text) {
    result = description.content
  }

  if (description.type === deps.enums.TaskDescriptionType.Formula) {
    const formulaContent = description.content
    result =
      typeof formulaContent === 'string' ? formulaContent : formulaContent
  }

  if (description.type === deps.enums.TaskDescriptionType.Test) {
    result = (description as TaskDescriptionTest).question
  }

  if (description.type === deps.enums.TaskDescriptionType.AnswerCell) {
    result = (description as TaskDescriptionAnswerCell).textBefore ?? ''
  }

  if (description.type === deps.enums.TaskDescriptionType.Equation) {
    result = (description as { content?: Translation | string }).content ?? ''
  }

  if (description.type === deps.enums.TaskDescriptionType.Comparison) {
    result =
      (description as { text_before?: Translation | string }).text_before || ''
  }

  if (description.type === deps.enums.TaskDescriptionType.ColumnOperation) {
    result = description.content ?? ''
  }

  const translated = deps.global.translateTasks(result)

  return applyTaskFields(translated, task.fields)
}
