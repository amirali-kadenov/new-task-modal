/**
 * Discovers Groups / Tasks catalog cases for Playwright visual regression.
 * Reads story `title` from `all-*.stories.tsx` + fixture JSON.
 *
 * Default: all templates × allGroups + allTasks × default/solution variants.
 * Quick pilots: STORYBOOK_TEST_VISUAL_PILOTS=1
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { storyIdFromTitle } from './story-url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_ROOT = path.resolve(
  dirname,
  '../../src/modules/tasks/ui/templates',
)

/** Fast subset when `STORYBOOK_TEST_VISUAL_PILOTS=1`. */
export const VISUAL_PILOT_TEMPLATES = [
  'text/ui/plain',
  'table/ui/grid',
] as const

export type VisualScope = 'allGroups' | 'allTasks'

export type VisualVariant = 'default' | 'solution'

export type VisualCase = {
  /** Template variant key, e.g. `text/ui/plain`. */
  template: string
  scope: VisualScope
  /** Structural group id or task id. */
  itemId: string
  variant: VisualVariant
  storyId: string
  /** Snapshot basename without extension. */
  snapshotName: string
  /** Storybook args to isolate one item. */
  args: Record<string, string | number>
}

const VARIANTS: VisualVariant[] = ['default', 'solution']

const readJson = <T>(filePath: string): T =>
  JSON.parse(fs.readFileSync(filePath, 'utf8')) as T

const extractStoryTitle = (storyFile: string): string | null => {
  if (!fs.existsSync(storyFile)) return null
  const text = fs.readFileSync(storyFile, 'utf8')
  const match = text.match(/title:\s*['"]([^'"]+)['"]/)
  return match?.[1] ?? null
}

const collectVariantDirs = (): string[] => {
  const out: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'data') {
          if (fs.existsSync(path.join(full, 'groups.json'))) {
            out.push(path.dirname(full))
          }
        } else {
          walk(full)
        }
      }
    }
  }
  walk(TEMPLATES_ROOT)
  return out.sort()
}

type GroupRow = { group?: string }
type AllTasksFile =
  | Array<{ id?: string }>
  | { byGrade?: Record<string, Array<{ id?: string }>> }

const pickAllTasks = (
  data: AllTasksFile,
  grade: number | 'all',
): Array<{ id: string; grade: number }> => {
  const out: Array<{ id: string; grade: number }> = []
  const push = (list: Array<{ id?: string }> | undefined, g: number) => {
    for (const item of list ?? []) {
      if (item.id) out.push({ id: item.id, grade: g })
    }
  }
  if (Array.isArray(data)) {
    push(data, typeof grade === 'number' ? grade : 4)
    return out
  }
  const byGrade = data.byGrade ?? {}
  if (grade === 'all') {
    for (const g of Object.keys(byGrade).sort(
      (a, b) => Number(a) - Number(b),
    )) {
      push(byGrade[g], Number(g))
    }
    return out
  }
  push(byGrade[String(grade)], grade)
  return out
}

const parseGrade = (): number | 'all' => {
  const raw = process.env.STORYBOOK_TEST_GRADE
  if (raw == null || raw === '' || raw === 'all') return 'all'
  const n = Number(raw)
  return Number.isFinite(n) ? n : 'all'
}

/** Scopes to run: both when unset / `all`. */
const parseScopes = (): VisualScope[] => {
  const raw = process.env.STORYBOOK_TEST_SCOPE
  if (raw === 'allGroups') return ['allGroups']
  if (raw === 'allTasks') return ['allTasks']
  return ['allGroups', 'allTasks']
}

const parseTemplateFilter = (): string =>
  (process.env.STORYBOOK_TEST_TEMPLATE ?? '').trim()

const parseTaskFilter = (): string =>
  (process.env.STORYBOOK_TEST_TASK ?? '').trim()

const parsePilotsOnly = (): boolean =>
  process.env.STORYBOOK_TEST_VISUAL_PILOTS === '1' ||
  process.env.STORYBOOK_TEST_VISUAL_PILOTS === 'true'

const snapshotSafe = (value: string): string =>
  value.replace(/[^a-zA-Z0-9._-]+/g, '_')

const pushVariants = (
  cases: VisualCase[],
  base: Omit<VisualCase, 'variant' | 'snapshotName'>,
  nameCore: string,
) => {
  for (const variant of VARIANTS) {
    cases.push({
      ...base,
      variant,
      snapshotName: `${nameCore}__${variant}`,
    })
  }
}

export const loadVisualCases = (): VisualCase[] => {
  const scopes = parseScopes()
  const grade = parseGrade()
  const templateFilter = parseTemplateFilter()
  const taskFilter = parseTaskFilter()
  const pilotsOnly = parsePilotsOnly()

  const cases: VisualCase[] = []

  for (const variantDir of collectVariantDirs()) {
    const template = path
      .relative(TEMPLATES_ROOT, variantDir)
      .split(path.sep)
      .join('/')

    if (templateFilter) {
      if (template !== templateFilter) continue
    } else if (
      pilotsOnly &&
      !VISUAL_PILOT_TEMPLATES.includes(
        template as (typeof VISUAL_PILOT_TEMPLATES)[number],
      )
    ) {
      continue
    }

    if (scopes.includes('allGroups')) {
      const title = extractStoryTitle(
        path.join(variantDir, 'all-groups.stories.tsx'),
      )
      if (title) {
        const storyId = storyIdFromTitle(title)
        const groups = readJson<GroupRow[]>(
          path.join(variantDir, 'data', 'groups.json'),
        )
        for (const row of groups) {
          const group = row.group?.trim()
          if (!group) continue
          if (taskFilter && group !== taskFilter) continue
          pushVariants(
            cases,
            {
              template,
              scope: 'allGroups',
              itemId: group,
              storyId,
              args: { group },
            },
            `${snapshotSafe(template)}__${snapshotSafe(group)}`,
          )
        }
      }
    }

    if (scopes.includes('allTasks')) {
      const title = extractStoryTitle(
        path.join(variantDir, 'all-tasks.stories.tsx'),
      )
      if (!title) continue
      const storyId = storyIdFromTitle(title)
      const allTasksPath = path.join(variantDir, 'data', 'all-tasks.json')
      if (!fs.existsSync(allTasksPath)) continue
      const raw = readJson<AllTasksFile>(allTasksPath)
      const items = pickAllTasks(raw, grade)
      for (const { id, grade: itemGrade } of items) {
        if (taskFilter && id !== taskFilter) continue
        pushVariants(
          cases,
          {
            template,
            scope: 'allTasks',
            itemId: id,
            storyId,
            args: { grade: itemGrade, taskId: id },
          },
          `${snapshotSafe(template)}__task_${snapshotSafe(id)}`,
        )
      }
    }
  }

  return cases
}

export const VISUAL_CASES = loadVisualCases()
