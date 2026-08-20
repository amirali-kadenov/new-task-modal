/** Подставляет `{number1}`, `{letter}` и т.д. из task.fields в уже переведённый текст. */
export const applyTaskFields = (
  text: string,
  fields: Record<string, unknown> | undefined,
): string => {
  if (!fields || !text.includes('{')) return text

  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = fields[key]
    if (value === undefined || value === null) return `{${key}}`
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }
    return JSON.stringify(value)
  })
}
