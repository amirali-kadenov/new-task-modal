export type PlayCaseStatus = 'pending' | 'running' | 'pass' | 'fail'

export type PlayCaseDef = {
  id: string
  label: string
  /** Optional Russian description of what the case covers (shown under the checkbox). */
  descriptionRu?: string
}

export type PlayCaseResult = PlayCaseDef & {
  status: PlayCaseStatus
  error?: string
}

export const DEFAULT_INTERACTION_CASE_ID = 'interaction'

/**
 * A docs page renders several story blocks at once, so results cannot live in
 * a single module-level list — each block owns a scope keyed by this id.
 */
export type PlayScopeId = string

type Listener = (cases: PlayCaseResult[]) => void

type Scope = {
  cases: PlayCaseResult[]
  listeners: Set<Listener>
}

const scopes = new Map<PlayScopeId, Scope>()

/** Scope of the play that is currently running; `runPlayStep` writes here. */
let activeScope: PlayScopeId | null = null

let scopeCounter = 0

export const createPlayScopeId = (): PlayScopeId => {
  scopeCounter += 1
  return `play-scope-${scopeCounter}`
}

const getScope = (id: PlayScopeId): Scope => {
  const existing = scopes.get(id)
  if (existing) return existing
  const created: Scope = { cases: [], listeners: new Set() }
  scopes.set(id, created)
  return created
}

const snapshot = (scope: Scope) => scope.cases.map((c) => ({ ...c }))

const emit = (id: PlayScopeId) => {
  const scope = scopes.get(id)
  if (!scope) return
  const cases = snapshot(scope)
  for (const listener of scope.listeners) {
    listener(cases)
  }
}

export const getPlayResults = (id: PlayScopeId): PlayCaseResult[] =>
  snapshot(getScope(id))

export const resetPlayResults = (
  id: PlayScopeId,
  defs: PlayCaseDef[],
): PlayCaseResult[] => {
  const scope = getScope(id)
  scope.cases = defs.map((def) => ({ ...def, status: 'pending' as const }))
  activeScope = id
  emit(id)
  return snapshot(scope)
}

/** Marks `id` as the scope that subsequent `runPlayStep` calls write to. */
export const setActivePlayScope = (id: PlayScopeId): void => {
  activeScope = id
}

export const updatePlayCase = (
  caseId: string,
  patch: Partial<Pick<PlayCaseResult, 'status' | 'error' | 'label'>>,
): void => {
  if (!activeScope) return
  const scope = getScope(activeScope)
  const index = scope.cases.findIndex((c) => c.id === caseId)

  if (index < 0) {
    scope.cases = [
      ...scope.cases,
      {
        id: caseId,
        label: patch.label ?? caseId,
        status: patch.status ?? 'pending',
        error: patch.error,
      },
    ]
  } else {
    const prev = scope.cases[index]
    scope.cases = scope.cases.map((c, i) =>
      i === index
        ? {
            ...c,
            ...patch,
            error:
              patch.status === 'pass' ? undefined : (patch.error ?? c.error),
            label: patch.label ?? prev.label,
          }
        : c,
    )
  }

  emit(activeScope)
}

export const markRemainingFailed = (error: string): void => {
  if (!activeScope) return
  const scope = getScope(activeScope)
  scope.cases = scope.cases.map((c) =>
    c.status === 'running' || c.status === 'pending'
      ? { ...c, status: 'fail', error }
      : c,
  )
  emit(activeScope)
}

export const subscribePlayResults = (
  id: PlayScopeId,
  listener: Listener,
): (() => void) => {
  const scope = getScope(id)
  scope.listeners.add(listener)
  listener(snapshot(scope))
  return () => {
    scope.listeners.delete(listener)
    if (scope.listeners.size === 0) {
      scopes.delete(id)
      if (activeScope === id) activeScope = null
    }
  }
}
