/**
 * Regenerates `data/groups.json` (grade 4) and `data/all-tasks.json` (all grades)
 * for each complex UI template from snapshot task data.
 *
 * Usage (from new-task-modal):
 *   node scripts/generate-complex-template-groups.mjs
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadEnrichmentMaps, withEnrichment } from './lib/enrichment.mjs'
import {
  mapGroupTasks,
  mapGroupTasksWithBodies,
} from './lib/group-fixture-tasks.mjs'
import {
  getAvailableGrades,
  loadSnapshotForGrade,
  toAllTasksFilePayload,
} from './lib/snapshot.mjs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const modalRoot = path.resolve(__dirname, '..')

const structural = require(
  path.join(repoRoot, 'stats/server/src/pipeline/structuralAnalysis.js'),
)

const complexRoot = path.join(
  modalRoot,
  'src/modules/tasks/ui/templates/complex',
)

const FOLDER_BY_ID = {
  'complex.plain': 'ui/plain',
  'complex.after': 'ui/after',
  'complex.after.equation': 'ui/after-equation',
  'complex.beforeAfter': 'ui/before-after',
  'complex.multi.stack.n2.after': 'ui/multi/stack-n2-after',
  'complex.multi.stack.n2.beforeAfter': 'ui/multi/stack-n2-before-after',
}

function isTrans(v) {
  return typeof v === 'object' && v !== null && 'module_name' in v
}
function hasText(v) {
  if (typeof v === 'string') return v.trim().length > 0
  if (isTrans(v)) {
    return Object.keys(v).some(
      (k) =>
        k !== 'module_name' &&
        typeof v[k] === 'string' &&
        v[k].trim().length > 0,
    )
  }
  return false
}
function adornmentOf(hasBefore, hasAfter) {
  if (hasBefore && hasAfter) return 'beforeAfter'
  if (hasBefore) return 'before'
  if (hasAfter) return 'after'
  return 'plain'
}
function hasTableAnswerCell(parts) {
  if (!Array.isArray(parts) || !parts.length) return false
  return parts.some((part) => {
    if (Number(part.type) !== 120) return false
    return (part.rows || []).some((row) =>
      (row.cells || []).some((cell) => cell === 'answercell'),
    )
  })
}

function classify(task) {
  const ai = task.answerInput
  if (ai == null || typeof ai !== 'object') return 'complex.plain'
  const keys = Object.keys(ai).filter((k) => k.startsWith('input'))
  if ('inline' in ai || keys.length) {
    const layout = ai.inline ? 'inline' : 'stack'
    let b = false
    let a = false
    keys.forEach((k) => {
      const i = ai[k] || {}
      if (hasText(i.before)) b = true
      if (hasText(i.after)) a = true
    })
    return `complex.multi.${layout}.n${keys.length}.${adornmentOf(b, a)}`
  }
  const adorn = adornmentOf(hasText(ai.before), hasText(ai.after))
  if (
    adorn === 'after' &&
    Boolean(task.description?.isAnswerCellHidden) &&
    hasTableAnswerCell(task.description?.parts)
  ) {
    return 'complex.after.equation'
  }
  return `complex.${adorn}`
}

function makeTranslation(rus) {
  return {
    with_audio_player: false,
    aze: '',
    arsa: '',
    areg: '',
    kgz: '',
    uzb: '',
    eng: '',
    rus,
    kaz: '',
    school: '',
    module_name: 'Elixir.Helpers.Translation',
  }
}

function buildSolutionIndex(structureDump, answersDump) {
  const byId = new Map()

  for (const chapter of structureDump.chapters || []) {
    for (const task of chapter.tasks || []) {
      const solution = task.structure?.solution
      if (task.id && solution) byId.set(task.id, solution)
    }
  }

  for (const chapter of answersDump.chapters || []) {
    for (const task of chapter.tasks || []) {
      if (!task.id || byId.has(task.id)) continue
      const answer = task.answerString
      if (answer == null || answer === '') continue
      byId.set(task.id, {
        type: 'formula',
        answer: makeTranslation(String(answer)),
        content: makeTranslation(''),
      })
    }
  }

  return byId
}

function withSolution(task, solutionById) {
  const solution = solutionById.get(task.id)
  if (!solution) {
    console.warn(`missing solution for task ${task.id}`)
    return task
  }
  return { ...task, solution }
}

function enrichTask(task, solutionById, enrichment) {
  return withEnrichment(withSolution(task, solutionById), enrichment)
}

function collectTemplateRows(data, solutionById, enrichment, grade) {
  const byTpl = {}
  const byTplAllTasks = {}
  const built = structural.buildStructuralGroups(data)

  built.groups
    .filter((g) => g.type === 'complex')
    .forEach((g) => {
      const tid = classify(g.sample.task)
      if (!FOLDER_BY_ID[tid]) {
        console.warn('unknown template', tid, g.groupName)
        return
      }
      if (!byTpl[tid]) byTpl[tid] = []
      byTpl[tid].push({
        group: g.groupName,
        count: g.tasks.length,
        task: enrichTask(g.sample.task, solutionById, enrichment),
        launch: {
          grade,
          chapterId: g.sample.chapterId,
          lessonId: g.sample.lessonId,
          taskIndex: g.sample.taskIndex,
        },
        tasks: mapGroupTasks(g.tasks, grade),
      })
      if (!byTplAllTasks[tid]) byTplAllTasks[tid] = []
      byTplAllTasks[tid].push(
        ...mapGroupTasksWithBodies(
          g.tasks,
          (task) => enrichTask(task, solutionById, enrichment),
          grade,
        ).map((entry) => ({
          ...entry,
          group: g.groupName,
        })),
      )
    })

  return { byTpl, byTplAllTasks }
}

const structureAnswersPath = path.join(
  repoRoot,
  'stats/tasks_answers_grade_4_with_structure.json',
)
const structureDump = fs.existsSync(structureAnswersPath)
  ? JSON.parse(fs.readFileSync(structureAnswersPath, 'utf8'))
  : { chapters: [] }

const grades = getAvailableGrades()
const grade4 = loadSnapshotForGrade(4)
const enrichment = loadEnrichmentMaps(grade4.snapshotDir)
const solutionById = buildSolutionIndex(structureDump, grade4.answersDump)
console.log(`Snapshot: ${grade4.dataPath}; grades: ${grades.join(', ')}`)

const { byTpl } = collectTemplateRows(grade4.data, solutionById, enrichment, 4)
const byTplAllTasksByGrade = {}

for (const grade of grades) {
  const snap = grade === 4 ? grade4 : loadSnapshotForGrade(grade)
  const { byTplAllTasks } = collectTemplateRows(
    snap.data,
    solutionById,
    enrichment,
    grade,
  )
  for (const [tid, tasks] of Object.entries(byTplAllTasks)) {
    if (!byTplAllTasksByGrade[tid]) byTplAllTasksByGrade[tid] = {}
    byTplAllTasksByGrade[tid][grade] = tasks
  }
}

Object.entries(FOLDER_BY_ID).forEach(([tid, folder]) => {
  const rows = (byTpl[tid] || []).slice().sort((a, b) => {
    return (
      Number(a.group.replace('complex_', '')) -
      Number(b.group.replace('complex_', ''))
    )
  })
  const outDir = path.join(complexRoot, folder, 'data')
  fs.mkdirSync(outDir, { recursive: true })
  const payload = rows.map(({ group, count, task, launch, tasks }) => ({
    group,
    count,
    launch,
    tasks,
    task,
  }))
  fs.writeFileSync(
    path.join(outDir, 'groups.json'),
    `${JSON.stringify(payload, null, 2)}\n`,
  )
  const allTasksPayload = toAllTasksFilePayload(
    byTplAllTasksByGrade[tid] || {},
    4,
  )
  fs.writeFileSync(
    path.join(outDir, 'all-tasks.json'),
    `${JSON.stringify(allTasksPayload, null, 2)}\n`,
  )
  if (payload[0]?.task) {
    fs.writeFileSync(
      path.join(outDir, 'task.json'),
      `${JSON.stringify(payload[0].task, null, 2)}\n`,
    )
  }
  const withSol = payload.filter((r) => r.task.solution).length
  const allCount = Object.values(allTasksPayload.byGrade).reduce(
    (n, list) => n + list.length,
    0,
  )
  console.log(
    `${tid} → ${folder} (${payload.length} groups, ${withSol} with solution, ${allCount} all tasks across ${allTasksPayload.grades.length} grades)`,
  )
})
