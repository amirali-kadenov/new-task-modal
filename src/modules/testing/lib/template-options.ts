/**
 * Template variant keys + per-template task ids for Testing UI selects.
 * Resolved at Vite build time — no Storybook channel round-trip.
 */

type GlobModule = { default?: unknown } | unknown

const TEMPLATE_GROUPS = import.meta.glob(
  '/src/modules/tasks/ui/templates/**/data/groups.json',
  { eager: true },
) as Record<string, GlobModule>

const TEMPLATE_ALL_TASKS = import.meta.glob(
  '/src/modules/tasks/ui/templates/**/data/all-tasks.json',
  { eager: true },
) as Record<string, GlobModule>

const variantKeyFromDataFile = (filePath: string): string | null => {
  const normalized = filePath.replace(/\\/g, '/')
  const match = normalized.match(/\/templates\/(.+)\/data\/(?:groups|all-tasks)\.json$/)
  return match?.[1] ?? null
}

const unwrap = (mod: GlobModule): unknown => {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    return (mod as { default: unknown }).default
  }
  return mod
}

const taskIdFromType = (elixirType: string | undefined | null): string => {
  if (!elixirType) return ''
  const prefix = 'Elixir.Task_'
  if (elixirType.startsWith(prefix)) return elixirType.slice(prefix.length)
  return elixirType.replace(/^Elixir\./, '')
}

const collectIdsFromGroups = (data: unknown): string[] => {
  if (!Array.isArray(data)) return []
  const ids: string[] = []
  for (const group of data) {
    if (!group || typeof group !== 'object') continue
    const g = group as {
      tasks?: Array<{ id?: string }>
      task?: { type?: string }
    }
    if (Array.isArray(g.tasks)) {
      for (const t of g.tasks) {
        if (t?.id) ids.push(t.id)
      }
    }
    const fromType = taskIdFromType(g.task?.type)
    if (fromType) ids.push(fromType)
  }
  return ids
}

const collectIdsFromAllTasks = (data: unknown): string[] => {
  if (!data || typeof data !== 'object') return []
  const ids: string[] = []
  const pushList = (list: unknown) => {
    if (!Array.isArray(list)) return
    for (const item of list) {
      if (item && typeof item === 'object' && typeof (item as { id?: string }).id === 'string') {
        ids.push((item as { id: string }).id)
      }
    }
  }
  const obj = data as {
    byGrade?: Record<string, unknown>
  }
  if (Array.isArray(data)) {
    pushList(data)
    return ids
  }
  if (obj.byGrade) {
    for (const list of Object.values(obj.byGrade)) pushList(list)
  }
  return ids
}

/** Paths relative to templates, e.g. `text/ui/plain`. */
export const TEMPLATE_VARIANT_KEYS: string[] = [
  ...new Set(
    Object.keys(TEMPLATE_GROUPS)
      .map(variantKeyFromDataFile)
      .filter((key): key is string => Boolean(key)),
  ),
].sort((a, b) => a.localeCompare(b))

const tasksByTemplate = (): Record<string, string[]> => {
  const map: Record<string, Set<string>> = {}

  const add = (key: string | null, ids: string[]) => {
    if (!key || !ids.length) return
    if (!map[key]) map[key] = new Set()
    for (const id of ids) {
      if (id) map[key].add(id)
    }
  }

  for (const [filePath, mod] of Object.entries(TEMPLATE_ALL_TASKS)) {
    add(variantKeyFromDataFile(filePath), collectIdsFromAllTasks(unwrap(mod)))
  }
  for (const [filePath, mod] of Object.entries(TEMPLATE_GROUPS)) {
    add(variantKeyFromDataFile(filePath), collectIdsFromGroups(unwrap(mod)))
  }

  const out: Record<string, string[]> = {}
  for (const [key, set] of Object.entries(map)) {
    out[key] = [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }
  return out
}

/** taskId list per template variant (`4_1_1`, …). */
export const TEMPLATE_TASK_IDS: Record<string, string[]> = tasksByTemplate()

export const getTaskIdsForTemplate = (template: string): string[] => {
  const key = template.trim()
  if (!key) return []
  return TEMPLATE_TASK_IDS[key] ?? []
}
