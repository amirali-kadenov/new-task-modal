import { slugFromRootTitle } from './trainer-checklist-storage'

export type TrainerVerifiedProgress = {
  tasks: string[]
  /** ISO timestamps when each taskId was verified. */
  verifiedAt?: Record<string, string>
}

export const TRAINER_VERIFIED_STORAGE_PREFIX = 'sb-trainer-verified:'
export const TRAINER_VERIFIED_CHANGE_EVENT = 'sb-trainer-verified-change'

export const trainerVerifiedStorageKey = (rootTitle?: string): string =>
  `${TRAINER_VERIFIED_STORAGE_PREFIX}${slugFromRootTitle(rootTitle)}`

export const emptyTrainerVerifiedProgress = (): TrainerVerifiedProgress => ({
  tasks: [],
  verifiedAt: {},
})

const normalizeVerifiedAt = (
  parsed: Partial<TrainerVerifiedProgress>,
): Record<string, string> => {
  const raw = parsed.verifiedAt
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, string> = {}
  for (const [id, value] of Object.entries(raw)) {
    if (typeof value === 'string' && value) out[id] = value
  }
  return out
}

export const readTrainerVerifiedProgress = (
  rootTitle?: string,
): TrainerVerifiedProgress => {
  if (typeof localStorage === 'undefined') {
    return emptyTrainerVerifiedProgress()
  }
  try {
    const raw = localStorage.getItem(trainerVerifiedStorageKey(rootTitle))
    if (!raw) return emptyTrainerVerifiedProgress()
    const parsed = JSON.parse(raw) as Partial<TrainerVerifiedProgress>
    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks.filter((id): id is string => typeof id === 'string')
      : []
    const verifiedAt = normalizeVerifiedAt(parsed)
    return { tasks, verifiedAt }
  } catch {
    return emptyTrainerVerifiedProgress()
  }
}

export const writeTrainerVerifiedProgress = (
  rootTitle: string | undefined,
  progress: TrainerVerifiedProgress,
): void => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(
    trainerVerifiedStorageKey(rootTitle),
    JSON.stringify({
      tasks: [...progress.tasks],
      verifiedAt: { ...(progress.verifiedAt ?? {}) },
    }),
  )
  window.dispatchEvent(
    new CustomEvent(TRAINER_VERIFIED_CHANGE_EVENT, {
      detail: { key: trainerVerifiedStorageKey(rootTitle) },
    }),
  )
}

/** Mark a taskId as verified (localStorage). */
export const markTrainerVerifiedTask = (
  rootTitle: string | undefined,
  taskId: string,
): void => {
  if (!taskId || typeof localStorage === 'undefined') return
  const prev = readTrainerVerifiedProgress(rootTitle)
  if (prev.tasks.includes(taskId)) return
  const now = new Date().toISOString()
  writeTrainerVerifiedProgress(rootTitle, {
    tasks: [...prev.tasks, taskId],
    verifiedAt: { ...(prev.verifiedAt ?? {}), [taskId]: now },
  })
}

export const unmarkTrainerVerifiedTask = (
  rootTitle: string | undefined,
  taskId: string,
): void => {
  if (!taskId || typeof localStorage === 'undefined') return
  const prev = readTrainerVerifiedProgress(rootTitle)
  if (!prev.tasks.includes(taskId)) return
  const verifiedAt = { ...(prev.verifiedAt ?? {}) }
  delete verifiedAt[taskId]
  writeTrainerVerifiedProgress(rootTitle, {
    tasks: prev.tasks.filter((id) => id !== taskId),
    verifiedAt,
  })
}

export const getTrainerVerifiedTaskAt = (
  rootTitle: string | undefined,
  taskId: string,
): string | null => {
  if (!taskId) return null
  const progress = readTrainerVerifiedProgress(rootTitle)
  if (!progress.tasks.includes(taskId)) return null
  return progress.verifiedAt?.[taskId] ?? null
}
