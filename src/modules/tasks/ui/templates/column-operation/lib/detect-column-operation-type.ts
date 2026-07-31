/**
 * Detect arithmetic operation encoded in columnOperation LaTeX content.
 * Order matters: division markers can coexist with other tokens.
 */

export type ColumnOperationType = 'plus' | 'minus' | 'times' | 'div'

interface TaskWithContent {
  description?: {
    content?: string | Record<string, unknown> | null
  }
}

/** Resolve displayable LaTeX string from content (string or Translation). */
export const getColumnOperationContent = (task: TaskWithContent): string => {
  const content = task.description?.content
  if (typeof content === 'string') return content
  if (content && typeof content === 'object') {
    const rus = content.rus
    if (typeof rus === 'string' && rus.trim()) return rus
    for (const value of Object.values(content)) {
      if (typeof value === 'string' && value.includes('\\begin')) return value
    }
  }
  return ''
}

/**
 * Infer operation from LaTeX content.
 * Returns `null` when markers are missing / unrecognized.
 */
export const detectColumnOperationType = (
  content: string,
): ColumnOperationType | null => {
  if (!content) return null

  // CMS: `\right\vert` / Arabic `\overline`. Prepared: `@{}r|@{}l@{}` corner array.
  if (
    content.includes('\\right\\vert') ||
    content.includes('\\overline') ||
    content.includes('@{}r|@{}l@{}') ||
    content.includes('@{}r|l@{}')
  ) {
    return 'div'
  }
  if (content.includes('\\times')) return 'times'
  if (content.includes('{}^{+}')) return 'plus'
  if (content.includes('{}^{-}')) return 'minus'

  return null
}

export const detectColumnOperationTypeFromTask = (
  task: TaskWithContent,
): ColumnOperationType | null =>
  detectColumnOperationType(getColumnOperationContent(task))
