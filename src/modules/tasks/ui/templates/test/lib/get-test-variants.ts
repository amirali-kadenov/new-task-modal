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
