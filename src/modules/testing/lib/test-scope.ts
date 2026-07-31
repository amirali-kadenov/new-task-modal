/**
 * Shared helpers for Storybook test-runner filters (vitest -t / env).
 * Kept free of React so preset.ts (Node) can import it.
 */

import type { TestGrade, TestScope } from './test-runner-events'

export const SCOPE_ENV = 'STORYBOOK_TEST_SCOPE'
export const GRADE_ENV = 'STORYBOOK_TEST_GRADE'
export const TEMPLATE_ENV = 'STORYBOOK_TEST_TEMPLATE'
export const TASK_ENV = 'STORYBOOK_TEST_TASK'

/** Vitest `-t` pattern when running catalog smoke only. */
export const vitestNamePattern = (
  scope: TestScope | undefined,
): string | null => {
  if (!scope || scope === 'all') return null
  if (scope === 'allGroups') return String.raw`\[allGroups\]|/Groups|All Groups`
  if (scope === 'allTasks') return String.raw`\[allTasks\]|/Tasks|All Tasks`
  return null
}

/**
 * Story titles use `Templates/{Domain}/…` without the `/ui/` segment
 * (`text/ui/plain` → `Text/plain`).
 */
export const templateToStoryPath = (template: string): string => {
  const withoutUi = template.replace(/\/ui\//, '/')
  const [domain, ...rest] = withoutUi.split('/').filter(Boolean)
  if (!domain) return template
  const titled = domain.charAt(0).toUpperCase() + domain.slice(1)
  return [titled, ...rest].join('/')
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Combined vitest `-t` regex for scope + optional template key.
 * Matches unit names (`text/ui/plain`) and story titles (`Templates/Text/plain`).
 * Task id is not included here — catalog/story names usually omit it; task
 * filtering is applied in e2e fixtures via `STORYBOOK_TEST_TASK`.
 * Returns null when neither filter applies (run everything).
 */
export const vitestFilterPattern = (
  scope: TestScope | undefined,
  template: string | undefined,
): string | null => {
  const scopePat = vitestNamePattern(scope)
  const tmpl = template?.trim()
  const tmplPat = tmpl
    ? `(${escapeRegex(tmpl)}|${escapeRegex(`Templates/${templateToStoryPath(tmpl)}`)})`
    : null

  if (tmplPat && scopePat) return `${tmplPat}.*(${scopePat})`
  if (tmplPat) return tmplPat
  return scopePat
}

export const parseGradeEnv = (
  raw: string | undefined,
): TestGrade | undefined => {
  if (raw == null || raw === '' || raw === 'all') return 'all'
  const n = Number(raw)
  return Number.isFinite(n) ? n : 'all'
}

export const gradeMatches = (
  launchGrade: number | undefined,
  filter: TestGrade | undefined,
): boolean => {
  if (filter == null || filter === 'all') return true
  if (launchGrade == null) return filter === 4 // fixtures without grade ≈ 4
  return launchGrade === filter
}

export const resolveRuntimeGrade = (): TestGrade =>
  parseGradeEnv(
    typeof process !== 'undefined' ? process.env[GRADE_ENV] : undefined,
  ) ?? 'all'

export const resolveRuntimeScope = (): TestScope => {
  const raw =
    typeof process !== 'undefined' ? process.env[SCOPE_ENV] : undefined
  if (raw === 'allGroups' || raw === 'allTasks' || raw === 'all') return raw
  return 'all'
}

/** Empty string / unset = all templates. */
export const resolveRuntimeTemplate = (): string => {
  const raw =
    typeof process !== 'undefined' ? process.env[TEMPLATE_ENV] : undefined
  return raw?.trim() ?? ''
}

/** Empty string / unset = all tasks within the selected template. */
export const resolveRuntimeTask = (): string => {
  const raw =
    typeof process !== 'undefined' ? process.env[TASK_ENV] : undefined
  return raw?.trim() ?? ''
}

export const templateMatches = (
  variantKey: string,
  filter: string | undefined,
): boolean => {
  const tmpl = filter?.trim()
  if (!tmpl) return true
  return (
    variantKey === tmpl ||
    variantKey.startsWith(`${tmpl}#`) ||
    variantKey.startsWith(`${tmpl}/`)
  )
}

export const taskMatches = (
  taskId: string | undefined,
  filter: string | undefined,
): boolean => {
  const task = filter?.trim()
  if (!task) return true
  if (!taskId) return false
  return taskId === task || taskId.endsWith(`_${task}`) || task.endsWith(taskId)
}
