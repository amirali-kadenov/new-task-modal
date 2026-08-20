/**
 * Persist template QA badges under test-artifacts/template-qa.json.
 * Node-only (fs) — used from the Storybook server preset.
 */

import fs from 'node:fs'
import path from 'node:path'

import type {
  HistoryRunRecord,
  TemplateQaEntry,
  TestScope,
} from './test-runner-events'

const QA_FILE = 'template-qa.json'

const isScope = (value: unknown): value is TestScope =>
  value === 'all' || value === 'allGroups' || value === 'allTasks'

const parseEntry = (raw: unknown): TemplateQaEntry | null => {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.template !== 'string' || !r.template.trim()) return null
  const autoRaw =
    r.auto && typeof r.auto === 'object'
      ? (r.auto as Record<string, unknown>)
      : {}
  const reviewedRaw =
    r.reviewed && typeof r.reviewed === 'object'
      ? (r.reviewed as Record<string, unknown>)
      : {}
  const scope = isScope(autoRaw.scope) ? autoRaw.scope : 'allGroups'
  return {
    template: r.template.trim(),
    auto: {
      ok: Boolean(autoRaw.ok),
      runId: typeof autoRaw.runId === 'string' ? autoRaw.runId : undefined,
      at: typeof autoRaw.at === 'number' ? autoRaw.at : 0,
      scope,
    },
    reviewed: {
      ok: Boolean(reviewedRaw.ok),
      at: typeof reviewedRaw.at === 'number' ? reviewedRaw.at : undefined,
      note: typeof reviewedRaw.note === 'string' ? reviewedRaw.note : undefined,
      runId:
        typeof reviewedRaw.runId === 'string' ? reviewedRaw.runId : undefined,
    },
  }
}

export const readTemplateQa = (artifactsRoot: string): TemplateQaEntry[] => {
  const file = path.join(artifactsRoot, QA_FILE)
  if (!fs.existsSync(file)) return []
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown
    if (!Array.isArray(raw)) return []
    return raw.map(parseEntry).filter((e): e is TemplateQaEntry => e != null)
  } catch {
    return []
  }
}

export const writeTemplateQa = (
  artifactsRoot: string,
  entries: TemplateQaEntry[],
): void => {
  fs.mkdirSync(artifactsRoot, { recursive: true })
  const file = path.join(artifactsRoot, QA_FILE)
  fs.writeFileSync(file, `${JSON.stringify(entries, null, 2)}\n`)
}

const upsert = (
  entries: TemplateQaEntry[],
  next: TemplateQaEntry,
): TemplateQaEntry[] => {
  const without = entries.filter((e) => e.template !== next.template)
  return [next, ...without].sort((a, b) => a.template.localeCompare(b.template))
}

export const getTemplateQa = (
  artifactsRoot: string,
  template: string,
): TemplateQaEntry | undefined => {
  const key = template.trim()
  if (!key) return undefined
  return readTemplateQa(artifactsRoot).find((e) => e.template === key)
}

/**
 * Apply auto badge from a finished visual run (requires selected template).
 * Failed run clears reviewed (stale).
 */
export const applyVisualRunToQa = (
  artifactsRoot: string,
  record: HistoryRunRecord,
): TemplateQaEntry[] => {
  if (record.suite !== 'visual') return readTemplateQa(artifactsRoot)
  const template = record.template?.trim()
  if (!template) return readTemplateQa(artifactsRoot)

  const prev = getTemplateQa(artifactsRoot, template)
  const ok = record.exitCode === 0
  const next: TemplateQaEntry = {
    template,
    auto: {
      ok,
      runId: record.id,
      at: record.finishedAt || Date.now(),
      scope: record.scope,
    },
    reviewed: ok
      ? (prev?.reviewed ?? { ok: false })
      : { ok: false, at: undefined, note: undefined, runId: undefined },
  }
  const entries = upsert(readTemplateQa(artifactsRoot), next)
  writeTemplateQa(artifactsRoot, entries)
  return entries
}

export const setTemplateReviewed = (
  artifactsRoot: string,
  template: string,
  reviewed: boolean,
  opts?: { note?: string; runId?: string },
): TemplateQaEntry[] => {
  const key = template.trim()
  if (!key) return readTemplateQa(artifactsRoot)

  const prev = getTemplateQa(artifactsRoot, key)
  const next: TemplateQaEntry = {
    template: key,
    auto: prev?.auto ?? {
      ok: false,
      at: 0,
      scope: 'allGroups',
    },
    reviewed: reviewed
      ? {
          ok: true,
          at: Date.now(),
          note: opts?.note,
          runId: opts?.runId ?? prev?.auto.runId,
        }
      : { ok: false },
  }
  const entries = upsert(readTemplateQa(artifactsRoot), next)
  writeTemplateQa(artifactsRoot, entries)
  return entries
}
