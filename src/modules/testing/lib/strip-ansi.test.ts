import { describe, expect, it } from 'vitest'

import { stripAnsi } from './strip-ansi'

describe('stripAnsi', () => {
  it('removes dim / intensity and color codes from vitest-style lines', () => {
    const raw =
      '\u001B[2m\u001B[33m↓\u001B[39m\u001B[22m skipped \u001B[2mfile.stories.tsx\u001B[22m'
    expect(stripAnsi(raw)).toBe('↓ skipped file.stories.tsx')
  })

  it('leaves plain text unchanged', () => {
    expect(stripAnsi('JSON report written to /tmp/out.json')).toBe(
      'JSON report written to /tmp/out.json',
    )
  })
})
