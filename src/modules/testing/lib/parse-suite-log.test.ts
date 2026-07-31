import { describe, expect, it } from 'vitest'

import { parseSuiteLogCases } from './parse-suite-log'

describe('parseSuiteLogCases', () => {
  it('parses vitest pass and fail lines', () => {
    const log = `
 ✓ maps photo.jpg → type image 2ms
 × attaches voice.mp3 as audio message 10ms
 ✓ |unit| src/foo.test.ts (3 tests) 11ms
`
    const cases = parseSuiteLogCases(log)
    expect(cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'maps photo.jpg → type image',
          status: 'pass',
        }),
        expect.objectContaining({
          label: 'attaches voice.mp3 as audio message',
          status: 'fail',
        }),
        expect.objectContaining({
          label: '|unit| src/foo.test.ts (3 tests)',
          status: 'pass',
        }),
      ]),
    )
  })

  it('parses playwright list lines', () => {
    const log = `
  ✓  1 e2e/chat-input.e2e.spec.ts:91:3 › sends a text message (4.6s)
  ✘  5 e2e/chat-input.e2e.spec.ts:111:3 › attaches an audio file message (13.8s)
`
    const cases = parseSuiteLogCases(log)
    expect(cases.find((c) => c.status === 'pass')?.label).toContain(
      'sends a text message',
    )
    expect(cases.find((c) => c.status === 'fail')?.label).toContain(
      'attaches an audio file message',
    )
  })

  it('falls back to empty when nothing matched', () => {
    expect(parseSuiteLogCases('no tests here')).toEqual([])
  })
})
