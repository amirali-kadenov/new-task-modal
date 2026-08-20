/**
 * Scan template fixture dirs for Groups / Tasks catalog smoke (unit).
 * Node-only (fs) — used from vitest unit project.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  getAllTasksForGrade,
  normalizeAllTasksFile,
  type AllTasksFile,
  type TemplateAllTaskFixture,
} from '@/modules/tasks/ui/templates/text/lib/storybook/render-template-all-tasks'

import type { TestGrade } from './test-runner-events'
import { gradeMatches } from './test-scope'

const dirname = path.dirname(fileURLToPath(import.meta.url))
export const TEMPLATES_NEW_ROOT = path.resolve(
  dirname,
  '../../tasks/ui/templates',
)

export type TemplateVariantRef = {
  /** Path relative to templates, e.g. text/ui/multi/stack-n2-before */
  key: string
  dataDir: string
}

const collectDataDirs = (dir: string, acc: string[] = []): string[] => {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectDataDirs(full, acc)
    else if (entry.name === 'groups.json' && path.basename(dir) === 'data') {
      acc.push(dir)
    }
  }
  return acc
}

export const listTemplateVariants = (
  root: string = TEMPLATES_NEW_ROOT,
): TemplateVariantRef[] => {
  const dirs = collectDataDirs(root).sort()
  return dirs.map((dataDir) => {
    const variantDir = path.dirname(dataDir)
    const key = path.relative(root, variantDir).split(path.sep).join('/')
    return { key, dataDir }
  })
}

type GroupLike = {
  id?: string
  launch?: { grade?: number }
  task?: unknown
  tasks?: unknown[]
}

export const readGroups = (dataDir: string): GroupLike[] => {
  const file = path.join(dataDir, 'groups.json')
  if (!fs.existsSync(file)) return []
  return JSON.parse(fs.readFileSync(file, 'utf8')) as GroupLike[]
}

export const readAllTasksFile = (dataDir: string): AllTasksFile | null => {
  const file = path.join(dataDir, 'all-tasks.json')
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf8')) as AllTasksFile
}

export const gradesToCheck = (
  filter: TestGrade,
  available: number[],
): number[] => {
  if (filter === 'all') return available.length ? available : [4]
  return available.includes(filter) ? [filter] : []
}

export const assertAllGroupsData = (
  variant: TemplateVariantRef,
  grade: TestGrade,
): void => {
  const groups = readGroups(variant.dataDir)
  if (groups.length === 0) {
    throw new Error(`[allGroups] ${variant.key}: groups.json is empty`)
  }

  const filtered =
    grade === 'all'
      ? groups
      : groups.filter((g) => gradeMatches(g.launch?.grade, grade))

  // Most groups.json are grade-4 only; if filter excludes all, skip with message.
  if (filtered.length === 0) {
    throw new Error(
      `[allGroups] ${variant.key}: no groups for grade=${String(grade)} (have ${groups.length} total)`,
    )
  }

  for (const group of filtered) {
    const hasTask = Boolean(group.task) || (group.tasks?.length ?? 0) > 0
    if (!hasTask) {
      throw new Error(
        `[allGroups] ${variant.key}: group ${group.id ?? '?'} has no task(s)`,
      )
    }
  }
}

export const assertAllTasksData = (
  variant: TemplateVariantRef,
  grade: TestGrade,
): void => {
  const raw = readAllTasksFile(variant.dataDir)
  if (!raw) {
    throw new Error(`[allTasks] ${variant.key}: missing all-tasks.json`)
  }

  const normalized = normalizeAllTasksFile(raw)
  const grades = gradesToCheck(grade, normalized.grades)
  if (grades.length === 0) {
    throw new Error(
      `[allTasks] ${variant.key}: grade=${String(grade)} not in ${JSON.stringify(normalized.grades)}`,
    )
  }

  for (const g of grades) {
    const tasks: TemplateAllTaskFixture[] = getAllTasksForGrade(raw, g)
    if (tasks.length === 0) {
      throw new Error(`[allTasks] ${variant.key}: no tasks for grade=${g}`)
    }
    for (const item of tasks) {
      if (!item.id?.trim()) {
        throw new Error(`[allTasks] ${variant.key} grade=${g}: task missing id`)
      }
      if (!item.group?.trim()) {
        throw new Error(
          `[allTasks] ${variant.key} grade=${g} id=${item.id}: missing group`,
        )
      }
      if (!item.task || typeof item.task !== 'object') {
        throw new Error(
          `[allTasks] ${variant.key} grade=${g} id=${item.id}: missing task`,
        )
      }
      const description = (item.task as { description?: unknown }).description
      if (description == null) {
        throw new Error(
          `[allTasks] ${variant.key} grade=${g} id=${item.id}: missing task.description`,
        )
      }
    }
  }
}
