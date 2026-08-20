/**
 * Regenerates `data/groups.json` (grade 4), `data/all-tasks.json` (all grades)
 * and `data/operations.json` for each columnOperation UI template.
 *
 * Groups are keyed by arithmetic operation (plus/minus/times/div), not
 * structural fingerprints.
 *
 * Usage (from new-task-modal):
 *   node scripts/generate-column-operation-template-groups.mjs
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadEnrichmentMaps, withEnrichment } from './lib/enrichment.mjs'
import {
  getAvailableGrades,
  loadSnapshotForGrade,
  toAllTasksFilePayload,
} from './lib/snapshot.mjs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const modalRoot = path.resolve(__dirname, '..')
const fetchAnswers = require(
  path.join(repoRoot, 'stats/server/src/pipeline/fetchAnswers.js'),
)

const coRoot = path.join(
  modalRoot,
  'src/modules/tasks/ui/templates/column-operation',
)

const FOLDER_BY_ID = {
  'columnOperation.plain': 'ui/plain',
  'columnOperation.multi.stack.n2.before': 'ui/multi/stack-n2-before',
}

const OPERATION_ORDER = ['plus', 'minus', 'times', 'div']

function getContent(task) {
  const content = task.description?.content
  if (typeof content === 'string') return content
  if (content && typeof content === 'object') {
    if (typeof content.rus === 'string' && content.rus.trim())
      return content.rus
    for (const value of Object.values(content)) {
      if (typeof value === 'string' && value.includes('\\begin')) return value
    }
  }
  return ''
}

function detectOp(content) {
  if (!content) return null
  if (content.includes('\\right\\vert') || content.includes('\\overline')) {
    return 'div'
  }
  if (content.includes('\\times')) return 'times'
  if (content.includes('{}^{+}')) return 'plus'
  if (content.includes('{}^{-}')) return 'minus'
  return null
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
function classify(task) {
  const ai = task.answerInput
  if (ai == null || typeof ai !== 'object') return 'columnOperation.plain'
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
    return `columnOperation.multi.${layout}.n${keys.length}.${adornmentOf(b, a)}`
  }
  return `columnOperation.${adornmentOf(hasText(ai.before), hasText(ai.after))}`
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

function makeLaunch(bundle, taskIndex, grade) {
  return {
    grade,
    chapterId: bundle.chapterId,
    lessonId: bundle.lessonId,
    taskIndex,
  }
}

/** Prefer full structure.solution; fall back to answerString → minimal solution. */
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
        type: 'columnOperation',
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

function collectColumnOperationRows(data, solutionById, enrichment, grade) {
  const byTplOp = {}

  for (const bundle of data) {
    ;(bundle.tasks || []).forEach((task, taskIndex) => {
      if (task.description?.type !== 'columnOperation') return

      const tid = classify(task)
      if (!FOLDER_BY_ID[tid]) return

      const op = detectOp(getContent(task))
      if (!op) return

      if (!byTplOp[tid]) byTplOp[tid] = {}
      if (!byTplOp[tid][op]) {
        byTplOp[tid][op] = { count: 0, sample: null, tasks: [], allTasks: [] }
      }
      byTplOp[tid][op].count += 1
      const taskId = fetchAnswers.taskIdFromType(task.type || '')
      if (taskId && !byTplOp[tid][op].tasks.some((t) => t.id === taskId)) {
        const launch = makeLaunch(bundle, taskIndex, grade)
        const withSolTask = enrichTask(task, solutionById, enrichment)
        byTplOp[tid][op].tasks.push({
          id: taskId,
          launch,
        })
        byTplOp[tid][op].allTasks.push({
          id: taskId,
          group: op,
          launch,
          task: withSolTask,
        })
      }

      if (byTplOp[tid][op].sample) return

      const withSol = enrichTask(task, solutionById, enrichment)
      if (!withSol.solution) return

      byTplOp[tid][op].sample = {
        task: withSol,
        launch: makeLaunch(bundle, taskIndex, grade),
        taskId: task.type ?? task.id,
      }
    })
  }

  return byTplOp
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

const byTplOp = collectColumnOperationRows(
  grade4.data,
  solutionById,
  enrichment,
  4,
)
const byTplAllTasksByGrade = {}

for (const grade of grades) {
  const snap = grade === 4 ? grade4 : loadSnapshotForGrade(grade)
  const found = collectColumnOperationRows(
    snap.data,
    solutionById,
    enrichment,
    grade,
  )
  for (const [tid, ops] of Object.entries(found)) {
    if (!byTplAllTasksByGrade[tid]) byTplAllTasksByGrade[tid] = {}
    byTplAllTasksByGrade[tid][grade] = OPERATION_ORDER.filter(
      (op) => ops[op]?.sample,
    ).flatMap((op) => ops[op].allTasks)
  }
}

Object.entries(FOLDER_BY_ID).forEach(([tid, folder]) => {
  const found = byTplOp[tid] || {}
  const groupsPayload = OPERATION_ORDER.filter((op) => found[op]?.sample).map(
    (op) => ({
      group: op,
      count: found[op].count,
      launch: found[op].sample.launch,
      tasks: found[op].tasks,
      task: found[op].sample.task,
    }),
  )
  const allTasksPayload = toAllTasksFilePayload(
    byTplAllTasksByGrade[tid] || {},
    4,
  )

  const operationsPayload = OPERATION_ORDER.filter(
    (op) => found[op]?.sample,
  ).map((op) => ({
    operation: op,
    taskId: found[op].sample.taskId,
    launch: found[op].sample.launch,
    task: found[op].sample.task,
  }))

  OPERATION_ORDER.forEach((op) => {
    if (!found[op]?.sample) {
      console.warn(`missing operation fixture ${op} for ${tid}`)
    }
  })

  const outDir = path.join(coRoot, folder, 'data')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, 'groups.json'),
    `${JSON.stringify(groupsPayload, null, 2)}\n`,
  )
  fs.writeFileSync(
    path.join(outDir, 'all-tasks.json'),
    `${JSON.stringify(allTasksPayload, null, 2)}\n`,
  )
  if (groupsPayload[0]?.task) {
    fs.writeFileSync(
      path.join(outDir, 'task.json'),
      `${JSON.stringify(groupsPayload[0].task, null, 2)}\n`,
    )
  }
  fs.writeFileSync(
    path.join(outDir, 'operations.json'),
    `${JSON.stringify(operationsPayload, null, 2)}\n`,
  )

  const withSol = groupsPayload.filter((r) => r.task.solution).length
  const allCount = Object.values(allTasksPayload.byGrade).reduce(
    (n, list) => n + list.length,
    0,
  )
  console.log(
    `${tid} → ${folder} (groups: ${groupsPayload.map((g) => g.group).join(', ') || 'none'}; ${withSol} with solution; ${allCount} all tasks across ${allTasksPayload.grades.length} grades)`,
  )
})
