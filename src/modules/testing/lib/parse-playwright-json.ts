import type { SuiteCaseResult } from './test-runner-events'

const slug = (label: string): string =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'case'

type PwTest = {
  title?: string
  results?: { status?: string; error?: { message?: string } }[]
}

type PwSpec = {
  title?: string
  file?: string
  tests?: PwTest[]
}

type PwSuite = {
  title?: string
  file?: string
  specs?: PwSpec[]
  suites?: PwSuite[]
}

type PwJson = {
  suites?: PwSuite[]
}

const walkSuite = (
  suite: PwSuite,
  parentTitles: string[],
  out: SuiteCaseResult[],
) => {
  const titles = suite.title ? [...parentTitles, suite.title] : parentTitles

  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const result = test.results?.[0]
      const status = result?.status
      const label = [...titles, spec.title, test.title]
        .filter(Boolean)
        .join(' › ')
      const failed = status === 'unexpected' || status === 'failed'
      const passed = status === 'expected' || status === 'passed'
      if (!failed && !passed) continue
      out.push({
        id: slug(label),
        label,
        status: failed ? 'fail' : 'pass',
        error: failed ? result?.error?.message : undefined,
        file: spec.file ?? suite.file,
      })
    }
  }

  for (const child of suite.suites ?? []) {
    walkSuite(child, titles, out)
  }
}

/**
 * Map Playwright `--reporter=json` output to suite checklist cases.
 */
export const parsePlaywrightJson = (raw: string): SuiteCaseResult[] => {
  let data: PwJson
  try {
    data = JSON.parse(raw) as PwJson
  } catch {
    return []
  }

  const cases: SuiteCaseResult[] = []
  for (const suite of data.suites ?? []) {
    walkSuite(suite, [], cases)
  }
  return cases
}
