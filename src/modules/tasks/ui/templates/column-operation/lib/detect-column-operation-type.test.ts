import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import {
  detectColumnOperationType,
  detectColumnOperationTypeFromTask,
  getColumnOperationContent,
} from './detect-column-operation-type'

const plusSnippet = `\\begin{array}{c}
\\phantom{99}71208\\\\[-6pt]
\\underline{
  {}^{{}^{{}^{+}}}
  \\smash{\\phantom{99999}4}
}\\\\[-6pt]


\\end{array}
`

const minusSnippet = `\\begin{array}{c}
\\phantom{99}39721\\\\[-6pt]
\\underline{
  {}^{{}^{{}^{-}}}
  \\smash{\\phantom{99999}7}
}\\\\[-6pt]


\\end{array}
`

const timesSnippet = `\\begin{array}{c}
\\phantom{99}13428\\\\[-6pt]
\\underline{
  {}^{{}^{{}^{\\times}}}
  \\smash{\\phantom{99999}2}
}\\\\[-6pt]

\\end{array}
`

const divSnippet = `\\begin{array}{c}
\\left. {\\phantom{99}94266}
\\right\\vert{\\underline{2}}
\\end{array}\\\\
`

const snapshotPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../../../../../stats/snapshots/stats-2026-07-31-1785460849686/task_data_grade_4.json',
)

describe('detectColumnOperationType', () => {
  it('detects +, −, ×, ÷ from known LaTeX snippets', () => {
    expect(detectColumnOperationType(plusSnippet)).toBe('plus')
    expect(detectColumnOperationType(minusSnippet)).toBe('minus')
    expect(detectColumnOperationType(timesSnippet)).toBe('times')
    expect(detectColumnOperationType(divSnippet)).toBe('div')
  })

  it('returns null for empty / unknown content', () => {
    expect(detectColumnOperationType('')).toBeNull()
    expect(
      detectColumnOperationType('\\begin{array}{c}1\\end{array}'),
    ).toBeNull()
  })

  it('reads Translation content via getColumnOperationContent', () => {
    const task = {
      description: {
        content: {
          rus: divSnippet,
          module_name: 'Elixir.Helpers.Translation',
        },
      },
    }
    expect(getColumnOperationContent(task)).toBe(divSnippet)
    expect(detectColumnOperationTypeFromTask(task)).toBe('div')
  })

  it('covers all four ops among plain grade-4 columnOperation tasks', () => {
    const data = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')) as Array<{
      tasks?: Array<{
        description?: { type?: string; content?: unknown }
        answerInput?: Record<string, unknown>
      }>
    }>

    const found = new Set<string>()
    for (const bundle of data) {
      for (const task of bundle.tasks ?? []) {
        if (task.description?.type !== 'columnOperation') continue
        const ai = task.answerInput
        const isMulti =
          ai != null &&
          ('inline' in ai ||
            Object.keys(ai).some((key) => key.startsWith('input')))
        if (isMulti) continue
        const op = detectColumnOperationTypeFromTask(task)
        if (op) found.add(op)
      }
    }

    expect(found).toEqual(new Set(['plus', 'minus', 'times', 'div']))
  })
})
