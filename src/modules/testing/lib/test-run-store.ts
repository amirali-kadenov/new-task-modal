/**
 * Persistent test-run state for Storybook Testing UI.
 * Survives story remounts; channel listeners attach once from preview.
 */

import { useSyncExternalStore } from 'react'
import { addons } from 'storybook/preview-api'

import type { PlayCaseResult } from '@/testing/play-results'

import { parseSuiteLogCases } from './parse-suite-log'
import { describeCaseRu } from './suite-case-ru'
import {
  EVENTS,
  type ArtifactItem,
  type ArtifactsPayload,
  type DonePayload,
  type LogPayload,
  type ResultsPayload,
  type SuiteCaseResult,
  type TestGrade,
  type TestScope,
  type TestSuite,
} from './test-runner-events'

export type SuiteRunStatus = 'idle' | 'running' | 'passed' | 'failed'

export type HubSuiteStatus =
  | 'idle'
  | 'running'
  | 'passed'
  | 'failed'
  | 'pending'
  | 'skipped'

export type SuiteRunSlice = {
  status: SuiteRunStatus
  log: string
  cases: PlayCaseResult[]
  artifacts: ArtifactItem[]
  persistDir: string | null
  gotStructured: boolean
}

export type HubFilters = {
  scope: TestScope
  grade: TestGrade
  template: string
  task: string
  headed: boolean
  e2eFast: boolean
}

export type HubRunState = {
  running: boolean
  queue: TestSuite[]
  active: TestSuite | null
  suiteStatus: Record<TestSuite, HubSuiteStatus>
  log: string
  cases: PlayCaseResult[]
  gotStructured: boolean
  filters: HubFilters
}

export type TestRunState = {
  suites: Record<TestSuite, SuiteRunSlice>
  hub: HubRunState
}

const SUITES: TestSuite[] = ['unit', 'interactions', 'e2e', 'visual']

const emptySuite = (): SuiteRunSlice => ({
  status: 'idle',
  log: '',
  cases: [],
  artifacts: [],
  persistDir: null,
  gotStructured: false,
})

const emptyHubStatus = (): Record<TestSuite, HubSuiteStatus> => ({
  unit: 'idle',
  interactions: 'idle',
  e2e: 'idle',
  visual: 'idle',
})

const createInitialState = (): TestRunState => ({
  suites: {
    unit: emptySuite(),
    interactions: emptySuite(),
    e2e: emptySuite(),
    visual: emptySuite(),
  },
  hub: {
    running: false,
    queue: [],
    active: null,
    suiteStatus: emptyHubStatus(),
    log: '',
    cases: [],
    gotStructured: false,
    filters: {
      scope: 'allTasks',
      grade: 4,
      template: '',
      task: '',
      headed: false,
      e2eFast: true,
    },
  },
})

let state = createInitialState()
const listeners = new Set<() => void>()
let channelReady = false

const emit = () => {
  for (const listener of listeners) listener()
}

const setState = (next: TestRunState) => {
  state = next
  emit()
}

const patchSuite = (suite: TestSuite, patch: Partial<SuiteRunSlice>): void => {
  setState({
    ...state,
    suites: {
      ...state.suites,
      [suite]: { ...state.suites[suite], ...patch },
    },
  })
}

const patchHub = (patch: Partial<HubRunState>): void => {
  setState({
    ...state,
    hub: { ...state.hub, ...patch },
  })
}

const toPlayCases = (cases: SuiteCaseResult[]): PlayCaseResult[] =>
  cases.map((c) => ({
    id: c.id,
    label: c.label,
    status: c.status,
    error: c.error,
    descriptionRu: c.descriptionRu ?? describeCaseRu(c.label),
  }))

const appendLogCases = (log: string): PlayCaseResult[] =>
  parseSuiteLogCases(log).map((c) => ({
    ...c,
    descriptionRu: describeCaseRu(c.label),
  }))

export const getTestRunState = (): TestRunState => state

export const subscribeTestRunStore = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const useTestRunStore = <T>(selector: (s: TestRunState) => T): T =>
  useSyncExternalStore(
    subscribeTestRunStore,
    () => selector(getTestRunState()),
    () => selector(getTestRunState()),
  )

export const isSuiteBusy = (
  suite: TestSuite,
  s: TestRunState = state,
): boolean => {
  if (s.suites[suite].status === 'running') return true
  if (!s.hub.running) return false
  if (s.hub.active === suite) return true
  return s.hub.queue.includes(suite)
}

export const isHubBusy = (s: TestRunState = state): boolean => s.hub.running

export const isAnySuiteBusy = (s: TestRunState = state): boolean =>
  SUITES.some((suite) => s.suites[suite].status === 'running') || s.hub.running

const emitRun = (
  suite: TestSuite,
  filters: {
    scope: TestScope
    grade: TestGrade
    template: string
    task: string
    headed?: boolean
    e2eFast?: boolean
    updateSnapshots?: boolean
  },
) => {
  addons.getChannel().emit(EVENTS.RUN, {
    suite,
    headed: suite === 'e2e' || suite === 'visual' ? filters.headed : undefined,
    e2eFast:
      suite === 'e2e' || suite === 'visual'
        ? filters.e2eFast !== false
        : undefined,
    scope: filters.scope,
    grade: filters.grade,
    template: filters.template || undefined,
    task: filters.task || undefined,
    updateSnapshots:
      suite === 'visual' ? Boolean(filters.updateSnapshots) : undefined,
  })
}

const emitStop = (suite?: TestSuite) => {
  addons.getChannel().emit(EVENTS.STOP, suite ? { suite } : {})
}

const startHubNext = () => {
  const hub = state.hub
  const queue = [...hub.queue]
  const next = queue.shift()
  if (!next) {
    patchHub({
      running: false,
      active: null,
      queue: [],
    })
    return
  }

  const f = hub.filters
  patchHub({
    active: next,
    queue,
    log: '',
    gotStructured: false,
    cases: [],
    suiteStatus: { ...hub.suiteStatus, [next]: 'running' },
  })
  patchSuite(next, {
    status: 'running',
    log: '',
    cases: [],
    artifacts: [],
    persistDir: null,
    gotStructured: false,
  })
  emitRun(next, {
    scope: f.scope,
    grade: f.grade,
    template: f.template,
    task: f.task,
    headed: f.headed,
    e2eFast: f.e2eFast,
  })
}

export const startSuiteRun = (opts: {
  suite: TestSuite
  scope: TestScope
  grade: TestGrade
  template: string
  task: string
  headed?: boolean
  e2eFast?: boolean
  updateSnapshots?: boolean
}): boolean => {
  const {
    suite,
    scope,
    grade,
    template,
    task,
    headed,
    e2eFast,
    updateSnapshots,
  } = opts
  if (isSuiteBusy(suite) || isHubBusy()) return false

  patchSuite(suite, {
    status: 'running',
    log: '',
    cases: [],
    artifacts: [],
    persistDir: null,
    gotStructured: false,
  })
  emitRun(suite, {
    scope,
    grade,
    template,
    task,
    headed,
    e2eFast,
    updateSnapshots,
  })
  return true
}

export const startHubRun = (opts: {
  selected: Record<TestSuite, boolean>
  scope: TestScope
  grade: TestGrade
  template: string
  task: string
  headed: boolean
  e2eFast: boolean
}): boolean => {
  if (isHubBusy() || isAnySuiteBusy()) return false

  const queue = SUITES.filter((s) => opts.selected[s])
  if (queue.length === 0) return false

  setState({
    ...state,
    hub: {
      running: true,
      queue,
      active: null,
      log: '',
      cases: [],
      gotStructured: false,
      filters: {
        scope: opts.scope,
        grade: opts.grade,
        template: opts.template,
        task: opts.task,
        headed: opts.headed,
        e2eFast: opts.e2eFast,
      },
      suiteStatus: {
        unit: opts.selected.unit ? 'pending' : 'skipped',
        interactions: opts.selected.interactions ? 'pending' : 'skipped',
        e2e: opts.selected.e2e ? 'pending' : 'skipped',
        visual: opts.selected.visual ? 'pending' : 'skipped',
      },
    },
  })
  startHubNext()
  return true
}

const skipPendingHubSuites = (): Record<TestSuite, HubSuiteStatus> => {
  const suiteStatus = { ...state.hub.suiteStatus }
  for (const s of SUITES) {
    if (suiteStatus[s] === 'pending') suiteStatus[s] = 'skipped'
  }
  return suiteStatus
}

export const stopSuiteRun = (suite: TestSuite): void => {
  // If hub owns this suite, clear remaining queue too
  if (
    state.hub.running &&
    (state.hub.active === suite || state.hub.queue.includes(suite))
  ) {
    patchHub({
      queue: [],
      suiteStatus: skipPendingHubSuites(),
    })
  }
  emitStop(suite)
}

export const stopHubRun = (): void => {
  const active = state.hub.active
  patchHub({
    queue: [],
    suiteStatus: skipPendingHubSuites(),
  })
  if (active) {
    emitStop(active)
  } else {
    // No active child — just clear hub flag
    patchHub({
      running: false,
      active: null,
    })
  }
}

const onLog = (payload: LogPayload) => {
  const { suite, chunk } = payload
  const slice = state.suites[suite]
  if (!slice) return

  // Always append to suite slice when that suite is running (solo or hub)
  if (slice.status === 'running') {
    const nextLog = slice.log + chunk
    patchSuite(suite, {
      log: nextLog,
      cases: slice.gotStructured ? slice.cases : appendLogCases(nextLog),
    })
  }

  const hub = state.hub
  if (hub.running && hub.active === suite) {
    const nextLog = hub.log + chunk
    patchHub({
      log: nextLog,
      cases: hub.gotStructured ? hub.cases : appendLogCases(nextLog),
    })
  }
}

const onResults = (payload: ResultsPayload) => {
  const { suite, cases } = payload
  const play = toPlayCases(cases)
  if (state.suites[suite]?.status === 'running') {
    patchSuite(suite, { cases: play, gotStructured: true })
  }
  if (state.hub.running && state.hub.active === suite) {
    patchHub({ cases: play, gotStructured: true })
  }
}

const onArtifacts = (payload: ArtifactsPayload) => {
  const { suite, artifacts, persistDir } = payload
  if (!state.suites[suite]) return
  patchSuite(suite, {
    artifacts,
    persistDir: persistDir ?? state.suites[suite].persistDir,
  })
}

const onDone = (payload: DonePayload) => {
  const { suite, exitCode, persistDir } = payload
  const passed = exitCode === 0
  const slice = state.suites[suite]
  if (!slice) return

  const wasSoloRunning = slice.status === 'running'
  const wasHubActive = state.hub.running && state.hub.active === suite

  if (wasSoloRunning || wasHubActive) {
    const fallbackCases =
      slice.cases.length > 0
        ? slice.cases
        : [
            {
              id: 'suite',
              label: suite,
              status: (passed ? 'pass' : 'fail') as PlayCaseResult['status'],
              error: passed ? undefined : `код выхода ${exitCode}`,
              descriptionRu: describeCaseRu(suite),
            },
          ]

    patchSuite(suite, {
      status: passed ? 'passed' : 'failed',
      persistDir: persistDir ?? slice.persistDir,
      cases: fallbackCases,
    })
  }

  if (wasHubActive) {
    patchHub({
      suiteStatus: {
        ...state.hub.suiteStatus,
        [suite]: passed ? 'passed' : 'failed',
      },
      active: null,
    })
    // Advance queue even if UI unmounted
    startHubNext()
  }
}

/** Call once from Storybook preview — safe to call repeatedly. */
export const initTestRunChannel = (): void => {
  if (channelReady || typeof window === 'undefined') return
  channelReady = true
  const channel = addons.getChannel()
  channel.on(EVENTS.LOG, onLog)
  channel.on(EVENTS.RESULTS, onResults)
  channel.on(EVENTS.ARTIFACTS, onArtifacts)
  channel.on(EVENTS.DONE, onDone)
}
