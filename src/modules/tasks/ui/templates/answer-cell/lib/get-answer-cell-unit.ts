import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { Translation } from '@/types/api/task'

import type { SimpleAnswerCellAnswerInput } from './types.task'

const translateAdornment = (
  value: string | Translation | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null) return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

/**
 * `answerInput.after` unit (e.g. "л") — the same field `AnswerCellRow`
 * renders next to the inline answercell. Single-input tasks only: multi
 * (`input1`/`input2`) tasks can have per-cell units, no single summary unit.
 * Shared by the task-modal solution and the AI-chat solution so the answer
 * panel ("Ваш ответ" / "Верный ответ") shows the same unit both places.
 */
export const getAnswerCellUnit = (
  answerInput: SimpleAnswerCellAnswerInput | undefined,
  translate: (value: Translation | string) => string,
): string => translateAdornment(answerInput?.after, translate)
