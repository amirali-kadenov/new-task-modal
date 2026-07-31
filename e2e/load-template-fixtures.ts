/**
 * Builds one live-trainer e2e fixture per template variant by scanning
 * `src/modules/tasks/ui/templates/.../data/groups.json`.
 *
 * Prefers `group.task.solution` (embedded sample matching `group.launch`);
 * falls back to sibling `task.json` + `groups[0].launch`.
 *
 * Kept free of `@/*` imports so Playwright resolution stays self-contained.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { TrainerLaunch } from './build-launch-url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_ROOT = path.resolve(
  dirname,
  '../src/modules/tasks/ui/templates',
)

export interface TemplateFixture {
  /** Path relative to `templates`, e.g. `text/ui/multi/stack-n2-before`. */
  key: string
  domain: string
  launch: TrainerLaunch
  /** Known-correct answer; multi-input parts joined with `;;`. */
  answer: string
  /** `test` domain answers via radio (`value` = letter). */
  isMultipleChoice: boolean
  /** Catalog scope tag for Storybook Testing filters. */
  scope: 'allGroups' | 'allTasks'
  /** When set, the spec should `test.skip` — no keyboard-typeable answer. */
  skipReason?: string
}

type TranslationLike = Record<string, unknown>

type SolutionLike = {
  answer?: string | TranslationLike
  correctVariant?: string | number
  correct?: string | number
}

type GroupTaskLike = {
  launch?: TrainerLaunch
  solution?: SolutionLike | string | null
}

type GroupLike = {
  launch?: TrainerLaunch
  tasks?: GroupTaskLike[]
  task?: GroupTaskLike & { solution?: SolutionLike | string | null }
  solution?: SolutionLike | string | null
}

const stripMathDelimiters = (value: string): string => {
  const trimmed = value.trim()
  const match = trimmed.match(/^\\\(([\s\S]*)\\\)$/)
  return match ? match[1].trim() : trimmed
}

const pickTranslationText = (value: TranslationLike): string | null => {
  for (const key of ['rus', 'eng', 'kaz', 'uzb', 'aze', 'kgz']) {
    const part = value[key]
    if (typeof part === 'string' && part.trim()) return part
  }
  for (const part of Object.values(value)) {
    if (
      typeof part === 'string' &&
      part.trim() &&
      !part.includes('Elixir') &&
      part !== 'true' &&
      part !== 'false'
    ) {
      return part
    }
  }
  return null
}

const pickAnswerRaw = (
  solution: SolutionLike | string | null | undefined,
): string | null => {
  if (solution == null) return null
  if (typeof solution === 'string') return solution

  const { answer } = solution
  if (typeof answer === 'string') return answer
  if (answer && typeof answer === 'object') {
    return pickTranslationText(answer)
  }
  if (solution.correctVariant != null) return String(solution.correctVariant)
  if (solution.correct != null) return String(solution.correct)
  return null
}

const normalizeAnswer = (
  solution: SolutionLike | string | null | undefined,
): string | null => {
  const raw = pickAnswerRaw(solution)
  if (raw == null) return null
  const stripped = stripMathDelimiters(raw)
  return stripped || null
}

/**
 * Answers that `keyboard.type` can enter into MathQuill on the live app.
 * Rejects raw LaTeX commands (anything with `\`).
 */
const isSimpleAnswer = (answer: string): boolean => {
  if (answer.includes('\\')) return false
  return /^[0-9A-Za-z;;\s+>\-<.,=]+$/.test(answer)
}

const collectGroupsJsonDirs = (dir: string, acc: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectGroupsJsonDirs(full, acc)
    } else if (entry.name === 'groups.json' && path.basename(dir) === 'data') {
      acc.push(dir)
    }
  }
  return acc
}

const readJson = <T>(filePath: string): T =>
  JSON.parse(fs.readFileSync(filePath, 'utf8')) as T

type Candidate = {
  launch: TrainerLaunch
  answer: string
}

const candidatesFromGroups = (groups: GroupLike[]): Candidate[] => {
  const out: Candidate[] = []
  for (const group of groups) {
    const embedded = group.task
    const launch =
      group.launch ?? embedded?.launch ?? group.tasks?.[0]?.launch
    const answer = normalizeAnswer(embedded?.solution ?? group.solution)
    if (launch && answer) out.push({ launch, answer })

    for (const task of group.tasks ?? []) {
      const taskAnswer = normalizeAnswer(task.solution)
      if (task.launch && taskAnswer) {
        out.push({ launch: task.launch, answer: taskAnswer })
      }
    }
  }
  return out
}

const pickFixtureCandidate = (
  groups: GroupLike[],
  taskFileSolution: SolutionLike | string | null | undefined,
): { launch: TrainerLaunch; answer: string; skipReason?: string } | null => {
  const candidates = candidatesFromGroups(groups)
  const fallbackLaunch = groups[0]?.launch ?? groups[0]?.tasks?.[0]?.launch
  const fallbackAnswer = normalizeAnswer(taskFileSolution)
  if (fallbackLaunch && fallbackAnswer) {
    candidates.push({ launch: fallbackLaunch, answer: fallbackAnswer })
  }

  if (candidates.length === 0) return null

  const simple = candidates.find((c) => isSimpleAnswer(c.answer))
  if (simple) return simple

  const first = candidates[0]
  return {
    ...first,
    skipReason: `Answer is not keyboard-typeable in MathQuill: ${JSON.stringify(first.answer)}`,
  }
}

export const loadTemplateFixtures = (): TemplateFixture[] => {
  if (!fs.existsSync(TEMPLATES_ROOT)) {
    throw new Error(`Templates root not found: ${TEMPLATES_ROOT}`)
  }

  const dataDirs = collectGroupsJsonDirs(TEMPLATES_ROOT).sort()
  const fixtures: TemplateFixture[] = []

  for (const dataDir of dataDirs) {
    const variantDir = path.dirname(dataDir)
    const key = path.relative(TEMPLATES_ROOT, variantDir).split(path.sep).join('/')
    const domain = key.split('/')[0] ?? key

    const groups = readJson<GroupLike[]>(path.join(dataDir, 'groups.json'))
    const taskPath = path.join(dataDir, 'task.json')
    const taskFile = fs.existsSync(taskPath)
      ? readJson<{ solution?: SolutionLike | string | null }>(taskPath)
      : null

    const picked = pickFixtureCandidate(groups, taskFile?.solution)
    if (!picked) continue

    fixtures.push({
      key,
      domain,
      launch: picked.launch,
      answer: picked.answer,
      isMultipleChoice: domain === 'test',
      scope: 'allGroups',
      ...(picked.skipReason ? { skipReason: picked.skipReason } : {}),
    })
  }

  return fixtures
}

type AllTasksItem = {
  id?: string
  launch?: TrainerLaunch
  task?: { solution?: SolutionLike | string | null }
  solution?: SolutionLike | string | null
}

type AllTasksFile =
  | AllTasksItem[]
  | {
      byGrade?: Record<string, AllTasksItem[]>
    }

const pickAllTasksList = (
  data: AllTasksFile,
  grade: number | 'all',
): AllTasksItem[] => {
  if (Array.isArray(data)) return data
  const byGrade = data.byGrade ?? {}
  if (grade === 'all') {
    return Object.keys(byGrade)
      .sort((a, b) => Number(a) - Number(b))
      .flatMap((g) => byGrade[g] ?? [])
  }
  return byGrade[String(grade)] ?? []
}

/**
 * One e2e fixture per task in all-tasks.json for `grade` (or every grade when
 * `grade === 'all'`). Optional `STORYBOOK_TEST_TASK` keeps only that taskId.
 */
export const loadAllTasksFixtures = (
  grade: number | 'all',
): TemplateFixture[] => {
  if (!fs.existsSync(TEMPLATES_ROOT)) {
    throw new Error(`Templates root not found: ${TEMPLATES_ROOT}`)
  }

  const taskFilter = (process.env.STORYBOOK_TEST_TASK ?? '').trim()
  const dataDirs = collectGroupsJsonDirs(TEMPLATES_ROOT).sort()
  const fixtures: TemplateFixture[] = []

  for (const dataDir of dataDirs) {
    const allTasksPath = path.join(dataDir, 'all-tasks.json')
    if (!fs.existsSync(allTasksPath)) continue

    const variantDir = path.dirname(dataDir)
    const key = path.relative(TEMPLATES_ROOT, variantDir).split(path.sep).join('/')
    const domain = key.split('/')[0] ?? key
    const raw = readJson<AllTasksFile>(allTasksPath)
    const list = pickAllTasksList(raw, grade)

    for (const item of list) {
      if (taskFilter && item.id !== taskFilter) continue
      const launch = item.launch
      const answer = normalizeAnswer(item.task?.solution ?? item.solution)
      if (!launch || !answer) continue

      const taskId = item.id?.trim()
      if (!taskId) continue

      const launchGrade = launch.grade ?? (typeof grade === 'number' ? grade : 4)
      const fixture: TemplateFixture = {
        key: `${key}#${taskId}`,
        domain,
        launch: { ...launch, grade: launchGrade },
        answer,
        isMultipleChoice: domain === 'test',
        scope: 'allTasks',
      }
      if (!isSimpleAnswer(answer)) {
        fixture.skipReason = `Answer is not keyboard-typeable in MathQuill: ${JSON.stringify(answer)}`
      }
      fixtures.push(fixture)
    }
  }

  return fixtures
}

const parseGradeFilter = (): number | 'all' => {
  const raw = process.env.STORYBOOK_TEST_GRADE
  if (raw == null || raw === '' || raw === 'all') return 'all'
  const n = Number(raw)
  return Number.isFinite(n) ? n : 'all'
}

const parseScopeFilter = (): 'all' | 'allGroups' | 'allTasks' => {
  const raw = process.env.STORYBOOK_TEST_SCOPE
  if (raw === 'allGroups' || raw === 'allTasks' || raw === 'all') return raw
  return 'all'
}

/**
 * Fixtures for the current Storybook Testing run (scope + grade + template + task env).
 * - all / allGroups → one sample per leaf from groups.json
 * - allTasks → every unique task in all-tasks.json for grade (or all grades)
 * - STORYBOOK_TEST_TASK → only that taskId
 */
export const loadScopedTemplateFixtures = (): TemplateFixture[] => {
  const scope = parseScopeFilter()
  const grade = parseGradeFilter()
  const template = (process.env.STORYBOOK_TEST_TEMPLATE ?? '').trim()
  const taskFilter = (process.env.STORYBOOK_TEST_TASK ?? '').trim()

  const matchesTemplate = (key: string): boolean => {
    if (!template) return true
    return key === template || key.startsWith(`${template}#`)
  }

  if (scope === 'allTasks') {
    return loadAllTasksFixtures(grade).filter((f) => matchesTemplate(f.key))
  }

  // Specific task under groups/all scope: reuse all-tasks (has id + solution).
  if (taskFilter) {
    return loadAllTasksFixtures(grade === 'all' ? 'all' : grade)
      .filter((f) => matchesTemplate(f.key))
      .map((f) => ({ ...f, scope: 'allGroups' as const }))
  }

  const groups = loadTemplateFixtures()
  const filtered =
    grade === 'all'
      ? groups
      : groups.filter((f) => (f.launch.grade ?? 4) === grade)

  return filtered.filter((f) => matchesTemplate(f.key))
}

export const TEMPLATE_FIXTURES = loadTemplateFixtures()
export const SCOPED_TEMPLATE_FIXTURES = loadScopedTemplateFixtures()
