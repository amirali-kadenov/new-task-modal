/** Подставляет `{number1}`, `{letter}` и т.д. из task.fields в уже переведённый текст. */
export const applyTaskFields = (
  text: string,
  fields: Record<string, unknown> | undefined,
): string => {
  if (!fields || !text.includes('{')) return text

  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = fields[key]
    return value !== undefined && value !== null ? String(value) : `{${key}}`
  })
}
