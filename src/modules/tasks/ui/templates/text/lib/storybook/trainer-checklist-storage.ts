export type TrainerChecklistProgress = {
  tasks: string[]
  /** ISO timestamps when each taskId was checked. */
  checkedAt?: Record<string, string>
  /** @deprecated kept for back-compat when reading old LS payloads */
  groups?: string[]
}

export const TRAINER_CHECKLIST_STORAGE_PREFIX = 'sb-trainer-checklist:'
export const TRAINER_CHECKLIST_CHANGE_EVENT = 'sb-trainer-checklist-change'

export const slugFromRootTitle = (rootTitle?: string): string => {
  if (!rootTitle) return 'template'
  return rootTitle.replace(/[^\w.-]+/g, '-').replace(/^-|-$/g, '') || 'template'
}

export const trainerChecklistStorageKey = (rootTitle?: string): string =>
  `${TRAINER_CHECKLIST_STORAGE_PREFIX}${slugFromRootTitle(rootTitle)}`

export const emptyTrainerChecklistProgress = (): TrainerChecklistProgress => ({
  tasks: [],
  checkedAt: {},
})

const normalizeCheckedAt = (
  parsed: Partial<TrainerChecklistProgress>,
): Record<string, string> => {
  const raw = parsed.checkedAt
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, string> = {}
  for (const [id, value] of Object.entries(raw)) {
    if (typeof value === 'string' && value) out[id] = value
  }
  return out
}

export const readTrainerChecklistProgress = (
  rootTitle?: string,
): TrainerChecklistProgress => {
  if (typeof localStorage === 'undefined') {
    return emptyTrainerChecklistProgress()
  }
  try {
    const raw = localStorage.getItem(trainerChecklistStorageKey(rootTitle))
    if (!raw) return emptyTrainerChecklistProgress()
    const parsed = JSON.parse(raw) as Partial<TrainerChecklistProgress>
    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks.filter((id): id is string => typeof id === 'string')
      : []
    const checkedAt = normalizeCheckedAt(parsed)
    return { tasks, checkedAt }
  } catch {
    return emptyTrainerChecklistProgress()
  }
}

export const writeTrainerChecklistProgress = (
  rootTitle: string | undefined,
  progress: TrainerChecklistProgress,
): void => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(
    trainerChecklistStorageKey(rootTitle),
    JSON.stringify({
      tasks: [...progress.tasks],
      checkedAt: { ...(progress.checkedAt ?? {}) },
    }),
  )
  window.dispatchEvent(
    new CustomEvent(TRAINER_CHECKLIST_CHANGE_EVENT, {
      detail: { key: trainerChecklistStorageKey(rootTitle) },
    }),
  )
}

/** Replace the checked task set; keeps existing timestamps, stamps new ones. */
export const setTrainerChecklistTasks = (
  rootTitle: string | undefined,
  taskIds: string[],
): void => {
  const prev = readTrainerChecklistProgress(rootTitle)
  const now = new Date().toISOString()
  const checkedAt: Record<string, string> = {}
  for (const id of taskIds) {
    checkedAt[id] = prev.checkedAt?.[id] ?? now
  }
  writeTrainerChecklistProgress(rootTitle, {
    tasks: [...taskIds],
    checkedAt,
  })
}

/** Mark a taskId as checked in the template Checklist (localStorage). */
export const markTrainerChecklistTask = (
  rootTitle: string | undefined,
  taskId: string,
): void => {
  if (!taskId || typeof localStorage === 'undefined') return
  const prev = readTrainerChecklistProgress(rootTitle)
  if (prev.tasks.includes(taskId)) return
  const now = new Date().toISOString()
  writeTrainerChecklistProgress(rootTitle, {
    tasks: [...prev.tasks, taskId],
    checkedAt: { ...(prev.checkedAt ?? {}), [taskId]: now },
  })
}

export const unmarkTrainerChecklistTask = (
  rootTitle: string | undefined,
  taskId: string,
): void => {
  if (!taskId || typeof localStorage === 'undefined') return
  const prev = readTrainerChecklistProgress(rootTitle)
  if (!prev.tasks.includes(taskId)) return
  const checkedAt = { ...(prev.checkedAt ?? {}) }
  delete checkedAt[taskId]
  writeTrainerChecklistProgress(rootTitle, {
    tasks: prev.tasks.filter((id) => id !== taskId),
    checkedAt,
  })
}

export const getTrainerChecklistTaskCheckedAt = (
  rootTitle: string | undefined,
  taskId: string,
): string | null => {
  if (!taskId) return null
  const progress = readTrainerChecklistProgress(rootTitle)
  if (!progress.tasks.includes(taskId)) return null
  return progress.checkedAt?.[taskId] ?? null
}

export const clearTrainerChecklistProgress = (rootTitle?: string): void => {
  writeTrainerChecklistProgress(rootTitle, emptyTrainerChecklistProgress())
}

/** Clear every sb-trainer-checklist:* key in this browser. */
export const clearAllTrainerChecklistProgress = (): void => {
  if (typeof localStorage === 'undefined') return
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key?.startsWith(TRAINER_CHECKLIST_STORAGE_PREFIX)) keys.push(key)
  }
  for (const key of keys) localStorage.removeItem(key)
  window.dispatchEvent(
    new CustomEvent(TRAINER_CHECKLIST_CHANGE_EVENT, {
      detail: { key: '*' },
    }),
  )
}

export const formatChecklistCheckedAt = (iso: string | null): string => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
