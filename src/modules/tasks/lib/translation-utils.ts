import type { Translation } from '@/types/api/task'

import { isTranslationObject } from './solution-types'

export const translateOptional = (
  value: Translation | string | undefined | null,
  translate: (text: Translation | string) => string,
): string => {
  if (value == null || value === '') return ''
  return translate(value)
}

export const isTranslation = (value: unknown): value is Translation =>
  isTranslationObject(value)

/** Test/Storybook fallback translate: picks a display string without real i18n.
 * Matches ME `Global.translate` for Russian: `rus || kaz` (empty string falls through).
 * Numbers match ME `Global.translate(string | number | …)` → String(value). */
export const pickTranslationText = (value: unknown): string => {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  // Prefer language fields even when `module_name` is missing (live API payloads).
  if (typeof value === 'object' && !Array.isArray(value)) {
    const t = value as Translation
    return t.rus || t.kaz || t.eng || t.uzb || t.aze || t.kgz || t.school || ''
  }
  return ''
}
