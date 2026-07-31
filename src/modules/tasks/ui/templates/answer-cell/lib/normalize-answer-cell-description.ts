/**
 * API payloads often use snake_case; our components use camelCase.
 */

const SNAKE_TO_CAMEL: Record<string, string> = {
  text_before: 'textBefore',
  text_after: 'textAfter',
  image_before: 'imageBefore',
  table_before: 'tableBefore',
  is_column: 'isColumn',
  answer_cell_margin: 'answerCellMargin',
  with_audio: 'withAudio',
}

const toCamelKey = (key: string): string => {
  if (SNAKE_TO_CAMEL[key]) return SNAKE_TO_CAMEL[key]
  if (!key.includes('_')) return key
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

/** Normalize answerCell description fields (shallow). */
export const normalizeAnswerCellDescription = <
  T extends Record<string, unknown>,
>(
  description: T,
): T => {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(description)) {
    out[toCamelKey(key)] = value
  }
  return out as T
}
