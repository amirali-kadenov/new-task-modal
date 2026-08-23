import type { Translation } from '@/types/api/task'
import type { RadioOption } from '@/ui/radio-button/radio-button-group'

/** Letter for variant index: 0 → A, 1 → B, … */
export const getTestRadioValue = (index: number) =>
  String.fromCharCode(65 + index)

/** Map description.variants → RadioButtonGroup options. */
export const getTestVariants = (
  variants: Translation[] | undefined,
  translate: (value: Translation | string) => string,
): RadioOption[] =>
  (variants ?? []).map((option, index) => ({
    value: getTestRadioValue(index),
    label: translate(option),
  }))

/**
 * Resolve a stored letter (A/B/C…) to its display value for answer panels —
 * just the letter itself, so the solution panel shows which option was
 * chosen without repeating the option text.
 */
export const getTestOptionDisplayValue = (
  options: RadioOption[],
  value: string | null | undefined,
): string => {
  const option = options.find((item) => item.value === value)
  if (!option) return value ?? ''
  return option.value
}
