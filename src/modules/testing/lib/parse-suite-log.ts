import type { PlayCaseResult } from '@/testing/play-results'

const ANSI_RE = /\u001b\[[0-9;]*m/g

const slug = (label: string): string =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'case'

/**
 * Parse Vitest / Playwright list-reporter lines into checklist cases.
 * Recognizes ✓/✔ (pass) and ×/✘/✗ (fail).
 */
export const parseSuiteLogCases = (log: string): PlayCaseResult[] => {
  const byId = new Map<string, PlayCaseResult>()

  for (const raw of log.split('\n')) {
    const line = raw.replace(ANSI_RE, '').trim()
    if (!line) continue

    const passMatch = line.match(/^[✓✔]\s+(?:\d+\s+)?(.+?)(?:\s+\(?\d+(?:\.\d+)?m?s\)?)?$/)
    const failMatch = line.match(/^[×✘✗]\s+(?:\d+\s+)?(.+?)(?:\s+\(?\d+(?:\.\d+)?m?s\)?)?$/)

    const label = (passMatch?.[1] ?? failMatch?.[1])?.trim()
    if (!label) continue
    // Skip suite summary lines like "Test Files  1 failed"
    if (/^test files\b/i.test(label) || /^tests\b/i.test(label)) continue

    const id = slug(label)
    byId.set(id, {
      id,
      label,
      status: passMatch ? 'pass' : 'fail',
    })
  }

  return [...byId.values()]
}
