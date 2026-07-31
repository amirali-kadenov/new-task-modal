/** Shared channel events for Storybook test-suite stories + server spawn preset. */

export const ADDON_ID = 'local/test-runner'

export const EVENTS = {
  RUN: `${ADDON_ID}/run`,
  STOP: `${ADDON_ID}/stop`,
  LOG: `${ADDON_ID}/log`,
  RESULTS: `${ADDON_ID}/results`,
  ARTIFACTS: `${ADDON_ID}/artifacts`,
  DONE: `${ADDON_ID}/done`,
  TEMPLATES_LIST: `${ADDON_ID}/templates-list`,
  TEMPLATES_LIST_RESULT: `${ADDON_ID}/templates-list-result`,
  HISTORY_LIST: `${ADDON_ID}/history-list`,
  HISTORY_LIST_RESULT: `${ADDON_ID}/history-list-result`,
  HISTORY_READ: `${ADDON_ID}/history-read`,
  HISTORY_READ_RESULT: `${ADDON_ID}/history-read-result`,
} as const

export type TestSuite = 'unit' | 'interactions' | 'e2e'

/** Catalog smoke scope. `all` = full suite (legacy Run behaviour). */
export type TestScope = 'all' | 'allGroups' | 'allTasks'

export type TestGrade = number | 'all'

export type RunPayload = {
  suite: TestSuite
  /** Playwright headed Chromium (e2e only). */
  headed?: boolean
  /** Catalog smoke filter; omit/`all` runs the full suite. */
  scope?: TestScope
  /** School class filter for catalog smoke. */
  grade?: TestGrade
  /** Template variant key (e.g. text/ui/plain); empty = all. */
  template?: string
  /** Task id within template (e.g. 4_1_1); empty = all tasks. */
  task?: string
  /** E2e only: fast run (default true). false → video/trace on failure. */
  e2eFast?: boolean
}

export type StopPayload = {
  /** Stop this suite process; omit to stop all running suites. */
  suite?: TestSuite
}

export type LogPayload = {
  suite: TestSuite
  chunk: string
  stream: 'stdout' | 'stderr'
}

export type SuiteCaseResult = {
  id: string
  label: string
  status: 'pass' | 'fail' | 'pending' | 'running'
  error?: string
  file?: string
  /** Short Russian description of what the case covers. */
  descriptionRu?: string
}

export type ResultsPayload = {
  suite: TestSuite
  cases: SuiteCaseResult[]
}

export type ArtifactKind = 'image' | 'video' | 'file'

export type ArtifactItem = {
  name: string
  kind: ArtifactKind
  /** data:… URL for inline preview (images / small videos). */
  dataUrl?: string
  /** Path relative to project root, e.g. test-artifacts/<run-id>/…. */
  relativePath?: string
  /** Public URL under Storybook static (`/test-artifacts/…`). */
  publicUrl?: string
}

export type ArtifactsPayload = {
  suite: TestSuite
  artifacts: ArtifactItem[]
  /** Directory under project root where this run was persisted. */
  persistDir?: string
}

export type DonePayload = {
  suite: TestSuite
  exitCode: number | null
  persistDir?: string
}

export type TemplatesListResultPayload = {
  templates: string[]
}

export type HistoryRunRecord = {
  id: string
  suite: TestSuite
  scope: TestScope
  grade: string
  template: string
  startedAt: number
  finishedAt: number
  exitCode: number | null
  /** Relative to project root, e.g. test-artifacts/unit-…. */
  persistDir: string
  failedCaseLabels?: string[]
  summary: { pass: number; fail: number; total: number }
}

export type HistoryListResultPayload = {
  runs: HistoryRunRecord[]
}

export type HistoryReadPayload = {
  persistDir: string
}

export type HistoryReadResultPayload = {
  persistDir: string
  log: string
  record?: HistoryRunRecord
  error?: string
}

export const GRADES = [4, 5, 6, 7, 8, 9, 10] as const

export const SCOPE_LABELS: Record<TestScope, string> = {
  all: 'Все проверки',
  allGroups: 'Все варианты раскладки',
  allTasks: 'Реальные задачи класса',
}

/** One-line hint under the selected scope in the hub. */
export const SCOPE_HINTS: Record<TestScope, string> = {
  allGroups:
    'Все layout/groups из groups.json — структуры UI шаблона',
  allTasks:
    'Уникальные задачи из all-tasks.json выбранного класса (класс «все» = все классы); в e2e — по одной проверке на задачу',
  all: 'Полный прогон без фильтра по каталогу заданий',
}

export const SUITE_LABELS: Record<TestSuite, string> = {
  unit: 'Данные и логика',
  interactions: 'Проверки в окне задачи',
  e2e: 'Проверки в живом приложении',
}
