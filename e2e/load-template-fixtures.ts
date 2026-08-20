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
const AVAILABLE_TASKS_PATH = path.resolve(dirname, '../dist/available-tasks.js')

/**
 * Task ids present in `available-tasks` mapping (new trainer templates).
 * Fixture task ids look like `4_2_36` (suffix after `#` in allTasks keys).
 */
const loadAvailableTaskIds = (): Set<string> => {
  if (!fs.existsSync(AVAILABLE_TASKS_PATH)) {
    throw new Error(
      `available-tasks not found at ${AVAILABLE_TASKS_PATH}. Run pnpm build in new-task-modal first.`,
    )
  }
  const source = fs.readFileSync(AVAILABLE_TASKS_PATH, 'utf8')
  const match = source.match(/const availableTasks\s*=\s*(\{[\s\S]*?\n\});/)
  if (!match?.[1]) {
    throw new Error(
      `Could not parse availableTasks from ${AVAILABLE_TASKS_PATH}`,
    )
  }
  const map = JSON.parse(match[1]) as Record<string, boolean>
  return new Set(Object.keys(map).filter((id) => map[id]))
}

/** `text/ui/after#4_2_36` → `4_2_36`; snapshot keys may be `snapshot/table#4_4_57@2161:10`. */
const taskIdFromFixtureKey = (key: string): string | null => {
  const hash = key.indexOf('#')
  if (hash < 0) return null
  let id = key.slice(hash + 1).trim()
  const at = id.indexOf('@')
  if (at >= 0) id = id.slice(0, at)
  return id || null
}

/**
 * Keep only fixtures covered by available-tasks mapping (new TaskComponent path).
 * Groups-scope samples without `#taskId` stay (launch is assumed mapped via chapter maps).
 * allTasks entries outside the map are dropped — they would hit renderLegacyTask.
 */
const filterMappedFixtures = (
  fixtures: TemplateFixture[],
): TemplateFixture[] => {
  const available = loadAvailableTaskIds()
  return fixtures.filter((fixture) => {
    const taskId = taskIdFromFixtureKey(fixture.key)
    if (taskId == null) return true
    return available.has(taskId)
  })
}

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
    const launch = group.launch ?? embedded?.launch ?? group.tasks?.[0]?.launch
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
): { launch: TrainerLaunch; answer: string } | null => {
  const candidates = candidatesFromGroups(groups)
  const fallbackLaunch = groups[0]?.launch ?? groups[0]?.tasks?.[0]?.launch
  const fallbackAnswer = normalizeAnswer(taskFileSolution)
  if (fallbackLaunch && fallbackAnswer) {
    candidates.push({ launch: fallbackLaunch, answer: fallbackAnswer })
  }

  return candidates[0] ?? null
}

export const loadTemplateFixtures = (): TemplateFixture[] => {
  if (!fs.existsSync(TEMPLATES_ROOT)) {
    throw new Error(`Templates root not found: ${TEMPLATES_ROOT}`)
  }

  const dataDirs = collectGroupsJsonDirs(TEMPLATES_ROOT).sort()
  const fixtures: TemplateFixture[] = []

  for (const dataDir of dataDirs) {
    const variantDir = path.dirname(dataDir)
    const key = path
      .relative(TEMPLATES_ROOT, variantDir)
      .split(path.sep)
      .join('/')
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
    const key = path
      .relative(TEMPLATES_ROOT, variantDir)
      .split(path.sep)
      .join('/')
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

      const launchGrade =
        launch.grade ?? (typeof grade === 'number' ? grade : 4)
      fixtures.push({
        key: `${key}#${taskId}`,
        domain,
        launch: { ...launch, grade: launchGrade },
        answer,
        isMultipleChoice: domain === 'test',
        scope: 'allTasks',
      })
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
 * All grade-4 tasks from stats snapshot (see scripts/generate-e2e-grade4-snapshot-fixtures.mjs).
 * Enabled via STORYBOOK_E2E_FROM_SNAPSHOT=1.
 */
export const loadGrade4SnapshotFixtures = (): TemplateFixture[] => {
  const filePath = path.resolve(dirname, 'data/grade4-all-from-snapshot.json')
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Missing ${filePath}. Run: node scripts/generate-e2e-grade4-snapshot-fixtures.mjs`,
    )
  }
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as TemplateFixture[]
  return raw.map((f) => ({ ...f, scope: 'allTasks' as const }))
}

/**
 * Fixtures for the current Storybook Testing run (scope + grade + template + task env).
 * - all / allGroups → one sample per leaf from groups.json
 * - allTasks → every unique task in all-tasks.json for grade (or all grades)
 * - STORYBOOK_TEST_TASK → only that taskId
 * - STORYBOOK_E2E_FROM_SNAPSHOT=1 → grade-4 fixtures from stats snapshot (~2239)
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
    if (process.env.STORYBOOK_E2E_FROM_SNAPSHOT === '1') {
      return filterMappedFixtures(
        loadGrade4SnapshotFixtures().filter((f) => matchesTemplate(f.key)),
      )
    }
    return filterMappedFixtures(
      loadAllTasksFixtures(grade).filter((f) => matchesTemplate(f.key)),
    )
  }

  // Specific task under groups/all scope: reuse all-tasks (has id + solution).
  if (taskFilter) {
    return filterMappedFixtures(
      loadAllTasksFixtures(grade === 'all' ? 'all' : grade)
        .filter((f) => matchesTemplate(f.key))
        .map((f) => ({ ...f, scope: 'allGroups' as const })),
    )
  }

  const groups = loadTemplateFixtures()
  const filtered =
    grade === 'all'
      ? groups
      : groups.filter((f) => (f.launch.grade ?? 4) === grade)

  return filterMappedFixtures(filtered.filter((f) => matchesTemplate(f.key)))
}

export const TEMPLATE_FIXTURES = loadTemplateFixtures()
export const SCOPED_TEMPLATE_FIXTURES = loadScopedTemplateFixtures()
