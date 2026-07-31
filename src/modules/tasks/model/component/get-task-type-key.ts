const TASK_TYPE_PREFIX = 'Elixir.Task_'

/**
 * Parses `Elixir.Task_4_6_7_1` → `4_6_7_1` (full id, not truncated).
 */
export const getTaskTypeKey = (type: string): string | null => {
  if (!type.startsWith(TASK_TYPE_PREFIX)) {
    return null
  }

  const suffix = type.slice(TASK_TYPE_PREFIX.length)

  if (!/^\d+(?:_\d+)*$/.test(suffix)) {
    return null
  }

  return suffix
}
