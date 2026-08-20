/**
 * Discovers Storybook-vs-real-trainer parity cases from `trainer.stories.tsx`
 * (`Correct` export) + sibling `data/groups.json` / `data/all-tasks.json`.
 *
 * One case per structural group (`allGroups`, group sample) or per catalog
 * task (`allTasks`, individual `taskId` — needs the task's `launch` on the
 * all-tasks.json entry to deep-link the real host).
 *
 * Same env filters as the catalog visual suite (see `load-visual-cases.ts`):
 * `STORYBOOK_TEST_SCOPE` / `STORYBOOK_TEST_GRADE` / `STORYBOOK_TEST_TEMPLATE`
 * / `STORYBOOK_TEST_TASK`.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { TrainerLaunch } from '../../build-launch-url'
import { storyIdFromTitle } from '../story-url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_ROOT = path.resolve(
  dirname,
  '../../../src/modules/tasks/ui/templates',
)

export type ParityScope = 'allGroups' | 'allTasks'

export type ParityCase = {
  /** Path relative to `templates`, e.g. `text/ui/plain`. */
  template: string
  scope: ParityScope
  /** Structural group id or task id. */
  itemId: string
  /** Storybook story id for the `Correct` export of `<template>/Trainer`. */
  storyId: string
  storyArgs: Record<string, string | number>
  launch: TrainerLaunch
  /** Snapshot basename without extension. */
  snapshotName: string
}

const readJson = <T>(filePath: string): T =>
  JSON.parse(fs.readFileSync(filePath, 'utf8')) as T

const findTrainerStoryFiles = (): string[] => {
  const out: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.name === 'trainer.stories.tsx') {
        out.push(full)
      }
    }
  }
  walk(TEMPLATES_ROOT)
  return out.sort()
}

const extractTitle = (storyFile: string): string | null => {
  const text = fs.readFileSync(storyFile, 'utf8')
  const match = text.match(/title:\s*['"]([^'"]+)['"]/)
  return match?.[1] ?? null
}

const snapshotSafe = (value: string): string =>
  value.replace(/[^a-zA-Z0-9._-]+/g, '_')

type GroupRow = {
  group?: string
  launch?: TrainerLaunch
}

type AllTaskRow = {
  id?: string
  group?: string
  launch?: TrainerLaunch
}

type AllTasksFile = AllTaskRow[] | { byGrade?: Record<string, AllTaskRow[]> }

const pickAllTasks = (
  data: AllTasksFile,
  grade: number | 'all',
): Array<{ id: string; group: string; launch: TrainerLaunch }> => {
  const out: Array<{ id: string; group: string; launch: TrainerLaunch }> = []
  const push = (list: AllTaskRow[] | undefined) => {
    for (const item of list ?? []) {
      if (item.id && item.group && item.launch) {
        out.push({ id: item.id, group: item.group, launch: item.launch })
      }
    }
  }
  if (Array.isArray(data)) {
    push(data)
    return out
  }
  const byGrade = data.byGrade ?? {}
  if (grade === 'all') {
    for (const g of Object.keys(byGrade).sort(
      (a, b) => Number(a) - Number(b),
    )) {
      push(byGrade[g])
    }
    return out
  }
  push(byGrade[String(grade)])
  return out
}

const parseGrade = (): number | 'all' => {
  const raw = process.env.STORYBOOK_TEST_GRADE
  if (raw == null || raw === '' || raw === 'all') return 'all'
  const n = Number(raw)
  return Number.isFinite(n) ? n : 'all'
}

const parseScopes = (): ParityScope[] => {
  const raw = process.env.STORYBOOK_TEST_SCOPE
  if (raw === 'allGroups') return ['allGroups']
  if (raw === 'allTasks') return ['allTasks']
  return ['allGroups', 'allTasks']
}

const parseTemplateFilter = (): string =>
  (process.env.STORYBOOK_TEST_TEMPLATE ?? '').trim()

const parseTaskFilter = (): string =>
  (process.env.STORYBOOK_TEST_TASK ?? '').trim()

export const buildTrainerParityCases = (): ParityCase[] => {
  const scopes = parseScopes()
  const grade = parseGrade()
  const templateFilter = parseTemplateFilter()
  const taskFilter = parseTaskFilter()

  const cases: ParityCase[] = []

  for (const storyFile of findTrainerStoryFiles()) {
    const variantDir = path.dirname(storyFile)
    const template = path
      .relative(TEMPLATES_ROOT, variantDir)
      .split(path.sep)
      .join('/')

    if (templateFilter && template !== templateFilter) continue

    const title = extractTitle(storyFile)
    if (!title) continue
    const storyId = storyIdFromTitle(title, 'Correct')

    if (scopes.includes('allGroups')) {
      const groupsPath = path.join(variantDir, 'data', 'groups.json')
      if (fs.existsSync(groupsPath)) {
        const groups = readJson<GroupRow[]>(groupsPath)
        for (const row of groups) {
          const group = row.group?.trim()
          if (!group || !row.launch) continue
          if (taskFilter && group !== taskFilter) continue
          cases.push({
            template,
            scope: 'allGroups',
            itemId: group,
            storyId,
            storyArgs: { group },
            launch: row.launch,
            snapshotName: `${snapshotSafe(template)}__${snapshotSafe(group)}`,
          })
        }
      }
    }

    if (scopes.includes('allTasks')) {
      const allTasksPath = path.join(variantDir, 'data', 'all-tasks.json')
      if (fs.existsSync(allTasksPath)) {
        const raw = readJson<AllTasksFile>(allTasksPath)
        for (const item of pickAllTasks(raw, grade)) {
          if (taskFilter && item.id !== taskFilter) continue
          cases.push({
            template,
            scope: 'allTasks',
            itemId: item.id,
            storyId,
            storyArgs: {
              group: item.group,
              taskId: item.id,
              grade: item.launch.grade ?? 4,
            },
            launch: item.launch,
            snapshotName: `${snapshotSafe(template)}__task_${snapshotSafe(item.id)}`,
          })
        }
      }
    }
  }

  return cases
}

export const TRAINER_PARITY_CASES = buildTrainerParityCases()
