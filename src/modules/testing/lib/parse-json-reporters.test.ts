import { describe, expect, it } from 'vitest'

import { parsePlaywrightJson } from './parse-playwright-json'
import { parseVitestJson } from './parse-vitest-json'

describe('parseVitestJson', () => {
  it('maps assertionResults to pass/fail cases', () => {
    const raw = JSON.stringify({
      testResults: [
        {
          name: '/src/foo.test.ts',
          assertionResults: [
            {
              fullName: 'Foo does a',
              status: 'passed',
              failureMessages: [],
            },
            {
              fullName: 'Foo fails b',
              status: 'failed',
              failureMessages: ['Expected true'],
            },
          ],
        },
      ],
    })
    const cases = parseVitestJson(raw)
    expect(cases).toHaveLength(2)
    expect(cases[0]).toMatchObject({ label: 'Foo does a', status: 'pass' })
    expect(cases[1]).toMatchObject({
      label: 'Foo fails b',
      status: 'fail',
      error: 'Expected true',
    })
  })

  it('returns empty on invalid JSON', () => {
    expect(parseVitestJson('nope')).toEqual([])
  })
})

describe('parsePlaywrightJson', () => {
  it('flattens nested suites/specs', () => {
    const raw = JSON.stringify({
      suites: [
        {
          title: 'e2e',
          specs: [
            {
              title: 'chat',
              file: 'e2e/chat.spec.ts',
              tests: [
                {
                  title: 'sends text',
                  results: [{ status: 'expected' }],
                },
                {
                  title: 'fails',
                  results: [
                    {
                      status: 'unexpected',
                      error: { message: 'Timeout' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
    const cases = parsePlaywrightJson(raw)
    expect(cases).toHaveLength(2)
    expect(cases[0]?.status).toBe('pass')
    expect(cases[0]?.label).toContain('sends text')
    expect(cases[1]).toMatchObject({ status: 'fail', error: 'Timeout' })
  })
})
