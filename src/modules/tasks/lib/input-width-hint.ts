import type { Task } from '@/types/api/task'

/** Digit width of Halvar Mittelschrift: 0.583 em. */
const CHAR = 0.583
/** Inner padding of the input, in pixels. */
const PAD = 32
const MIN = 72
const MAX = 560

/**
 * How wide the answer input should be, as a hint about the size of the answer.
 *
 * A five-digit answer and a two-digit one are different tasks, and a field of
 * one fixed width says nothing about either. Sizing the field to the expected
 * volume is the same idea as sizing a form field to what goes in it: a phone
 * number field is not as wide as an address field.
 *
 * The hint comes from the task's own numbers (`fields`), not from the answer:
 * the backend does not send the answer to the client — `solution` arrives as
 * `"-"` — while `fields` is always there, and the answer is usually of the
 * same order of magnitude as the numbers in the task.
 *
 * Returns `null` when there is nothing to measure, so callers keep their own
 * width.
 */
export const inputWidthHint = (
  task: Pick<Task, 'fields'>,
  fontSizePx: number,
): number | null => {
  let longest = ''
  for (const value of Object.values(task.fields ?? {})) {
    const isNumeric =
      typeof value === 'number' ||
      (typeof value === 'string' && /^\d+$/.test(value))
    if (!isNumeric) continue
    const text = String(value)
    if (text.length > longest.length) longest = text
  }
  if (!longest) return null

  const width = longest.length * fontSizePx * CHAR + PAD
  return Math.min(MAX, Math.max(MIN, Math.round(width)))
}
