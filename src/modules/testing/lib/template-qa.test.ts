import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  applyVisualRunToQa,
  readTemplateQa,
  setTemplateReviewed,
} from './template-qa'
import type { HistoryRunRecord } from './test-runner-events'

describe('template-qa', () => {
  let root: string

  afterEach(() => {
    if (root && fs.existsSync(root)) {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })

  const makeRoot = () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'template-qa-'))
    return root
  }

  const visualRun = (patch: Partial<HistoryRunRecord>): HistoryRunRecord => ({
    id: 'visual-allGroups-g4-1',
    suite: 'visual',
    scope: 'allGroups',
    grade: '4',
    template: 'text/ui/plain',
    startedAt: 1,
    finishedAt: 2,
    exitCode: 0,
    persistDir: 'test-artifacts/visual-1',
    summary: { pass: 1, fail: 0, total: 1 },
    ...patch,
  })

  it('sets auto on successful visual run and clears reviewed on fail', () => {
    const dir = makeRoot()
    applyVisualRunToQa(dir, visualRun({ exitCode: 0 }))
    setTemplateReviewed(dir, 'text/ui/plain', true)

    let entries = readTemplateQa(dir)
    expect(entries).toHaveLength(1)
    expect(entries[0]?.auto.ok).toBe(true)
    expect(entries[0]?.reviewed.ok).toBe(true)

    applyVisualRunToQa(dir, visualRun({ exitCode: 1, id: 'visual-fail' }))
    entries = readTemplateQa(dir)
    expect(entries[0]?.auto.ok).toBe(false)
    expect(entries[0]?.reviewed.ok).toBe(false)
  })

  it('ignores visual runs without template', () => {
    const dir = makeRoot()
    applyVisualRunToQa(dir, visualRun({ template: '' }))
    expect(readTemplateQa(dir)).toEqual([])
  })
})
