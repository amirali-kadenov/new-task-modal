import type { SuiteCaseResult } from './test-runner-events'

const slug = (label: string): string =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'case'

type VitestAssertion = {
  fullName?: string
  title?: string
  status?: string
  failureMessages?: string[]
}

type VitestFileResult = {
  name?: string
  assertionResults?: VitestAssertion[]
}

type VitestJson = {
  testResults?: VitestFileResult[]
}

/**
 * Map Vitest `--reporter=json` output to suite checklist cases.
 */
export const parseVitestJson = (raw: string): SuiteCaseResult[] => {
  let data: VitestJson
  try {
    data = JSON.parse(raw) as VitestJson
  } catch {
    return []
  }

  const cases: SuiteCaseResult[] = []
  for (const file of data.testResults ?? []) {
    for (const assertion of file.assertionResults ?? []) {
      const label =
        assertion.fullName?.trim() || assertion.title?.trim() || 'unnamed test'
      const failed = assertion.status === 'failed'
      const error = assertion.failureMessages?.filter(Boolean).join('\n')
      cases.push({
        id: slug(`${file.name ?? ''}-${label}`),
        label,
        status: failed ? 'fail' : 'pass',
        error: failed ? error || undefined : undefined,
        file: file.name,
      })
    }
  }
  return cases
}
