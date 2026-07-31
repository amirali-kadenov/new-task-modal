/**
 * Persist / load Storybook test-runner history under test-artifacts/.
 * Node-only (fs) — used from the Storybook server preset.
 */

import fs from 'node:fs'
import path from 'node:path'

import type {
  HistoryRunRecord,
  TestScope,
  TestSuite,
} from './test-runner-events'

const INDEX_NAME = 'index.json'

const isSuite = (value: unknown): value is TestSuite =>
  value === 'unit' || value === 'interactions' || value === 'e2e'

const isScope = (value: unknown): value is TestScope =>
  value === 'all' || value === 'allGroups' || value === 'allTasks'

const parseRecord = (raw: unknown): HistoryRunRecord | null => {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== 'string' || !isSuite(r.suite)) return null
  if (!isScope(r.scope) || typeof r.persistDir !== 'string') return null
  const summary =
    r.summary && typeof r.summary === 'object'
      ? (r.summary as Record<string, unknown>)
      : {}
  return {
    id: r.id,
    suite: r.suite,
    scope: r.scope,
    grade: typeof r.grade === 'string' ? r.grade : 'all',
    template: typeof r.template === 'string' ? r.template : '',
    startedAt: typeof r.startedAt === 'number' ? r.startedAt : 0,
    finishedAt: typeof r.finishedAt === 'number' ? r.finishedAt : 0,
    exitCode: typeof r.exitCode === 'number' ? r.exitCode : null,
    persistDir: r.persistDir,
    failedCaseLabels: Array.isArray(r.failedCaseLabels)
      ? r.failedCaseLabels.filter((x): x is string => typeof x === 'string')
      : undefined,
    summary: {
      pass: typeof summary.pass === 'number' ? summary.pass : 0,
      fail: typeof summary.fail === 'number' ? summary.fail : 0,
      total: typeof summary.total === 'number' ? summary.total : 0,
    },
  }
}

export const readHistoryIndex = (artifactsRoot: string): HistoryRunRecord[] => {
  const file = path.join(artifactsRoot, INDEX_NAME)
  if (!fs.existsSync(file)) return []
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown
    if (!Array.isArray(raw)) return []
    return raw.map(parseRecord).filter((r): r is HistoryRunRecord => r != null)
  } catch {
    return []
  }
}

export const writeHistoryIndex = (
  artifactsRoot: string,
  runs: HistoryRunRecord[],
): void => {
  fs.mkdirSync(artifactsRoot, { recursive: true })
  const file = path.join(artifactsRoot, INDEX_NAME)
  fs.writeFileSync(file, `${JSON.stringify(runs, null, 2)}\n`)
}

export const appendHistoryRun = (
  artifactsRoot: string,
  record: HistoryRunRecord,
): HistoryRunRecord[] => {
  const prev = readHistoryIndex(artifactsRoot)
  const next = [record, ...prev.filter((r) => r.id !== record.id)].slice(0, 200)
  writeHistoryIndex(artifactsRoot, next)
  return next
}

/**
 * One-time backfill when index.json is missing but run folders exist.
 */
export const backfillHistoryFromDirs = (
  artifactsRoot: string,
): HistoryRunRecord[] => {
  const existing = readHistoryIndex(artifactsRoot)
  if (existing.length > 0) return existing
  if (!fs.existsSync(artifactsRoot)) return []

  const runs: HistoryRunRecord[] = []
  for (const entry of fs.readdirSync(artifactsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const persistDir = path.join('test-artifacts', entry.name)
    const abs = path.join(artifactsRoot, entry.name)
    const logPath = path.join(abs, 'log.txt')
    if (!fs.existsSync(logPath)) continue

    const parts = entry.name.split('-')
    const suite = isSuite(parts[0]) ? parts[0] : 'unit'
    const scopeRaw = parts[1]
    const scope = isScope(scopeRaw) ? scopeRaw : 'all'
    const gradePart = parts.find((p) => p.startsWith('g'))
    const grade = gradePart ? gradePart.slice(1) : 'all'
    const ts = Number(parts.at(-1))
    const finishedAt = Number.isFinite(ts) ? ts : Date.now()
    const hasFailHint =
      fs.existsSync(path.join(abs, 'playwright')) ||
      (fs.existsSync(logPath) &&
        /FAIL|failed|Error/i.test(
          fs.readFileSync(logPath, 'utf8').slice(0, 8000),
        ))

    runs.push({
      id: entry.name,
      suite,
      scope,
      grade,
      template: '',
      startedAt: finishedAt,
      finishedAt,
      exitCode: hasFailHint ? 1 : 0,
      persistDir,
      summary: { pass: 0, fail: hasFailHint ? 1 : 0, total: 0 },
    })
  }

  runs.sort((a, b) => b.finishedAt - a.finishedAt)
  if (runs.length > 0) writeHistoryIndex(artifactsRoot, runs)
  return runs
}

export const readRunLog = (projectRoot: string, persistDir: string): string => {
  const safe = persistDir.replace(/\\/g, '/').replace(/^\/+/, '')
  if (!safe.startsWith('test-artifacts/')) {
    return ''
  }
  const file = path.join(projectRoot, safe, 'log.txt')
  if (!fs.existsSync(file)) return ''
  return fs.readFileSync(file, 'utf8')
}
