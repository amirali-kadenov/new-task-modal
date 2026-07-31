/**
 * Regenerates `data/groups.json` (grade 4) and `data/all-tasks.json` (all grades)
 * for each table UI template.
 *
 * Usage (from new-task-modal):
 *   node scripts/generate-table-template-groups.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import {
  mapGroupTasks,
  mapGroupTasksWithBodies,
} from './lib/group-fixture-tasks.mjs'
import {
  getAvailableGrades,
  loadSnapshotForGrade,
  toAllTasksFilePayload,
} from './lib/snapshot.mjs'
import { loadEnrichmentMaps, withEnrichment } from './lib/enrichment.mjs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const modalRoot = path.resolve(__dirname, '..')

const structural = require(
  path.join(repoRoot, 'stats/server/src/pipeline/structuralAnalysis.js'),
)

const tableRoot = path.join(
  modalRoot,
  'src/modules/tasks/ui/templates/table',
)

const FOLDER_BY_ID = {
  'table.plain': 'ui/plain',
  'table.grid': 'ui/grid',
  'table.inline': 'ui/inline',
  'table.list': 'ui/list',
  'table.mixed': 'ui/mixed',
  'table.multiRow': 'ui/multi-row',
  'table.multiRowSvg': 'ui/multi-row-svg',
}

const isAnswerCell = (cell) => cell === 'answercell'

const answerCellCount = (row) =>
  (row.cells || []).filter(isAnswerCell).length

const hasSvg = (row) =>
  (row.cells || []).some(
    (cell) => typeof cell === 'string' && cell.includes('<svg'),
  )

const isAnswerCellFirstPair = (row) =>
  row.cells?.length === 2 && isAnswerCell(row.cells[0])

function classify(task) {
  const rows = task.description?.table?.rows
  if (task.description?.type !== 'table' || !rows?.length) {
    return 'table.plain'
  }

  if (rows.length === 1) {
    return answerCellCount(rows[0]) > 1 ? 'table.inline' : 'table.plain'
  }

  if (rows.every(isAnswerCellFirstPair)) return 'table.list'

  const dataRows = rows.slice(0, -1)
  const lastRow = rows.at(-1)
  if (
    dataRows.every((row) => answerCellCount(row) === 0) &&
    answerCellCount(lastRow) >= 1
  ) {
    return 'table.grid'
  }

  const [firstRow, ...restRows] = rows
  if (
    answerCellCount(firstRow) === 0 &&
    restRows.every((row) => answerCellCount(row) === 1)
  ) {
    return rows.some(hasSvg) ? 'table.multiRowSvg' : 'table.multiRow'
  }

  return 'table.mixed'
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
        type: 'table',
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
    .filter((g) => g.type === 'table')
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
      Number(a.group.replace('table_', '')) -
      Number(b.group.replace('table_', ''))
    )
  })
  const payload = rows.map(({ group, count, task, launch, tasks }) => ({
    group,
    count,
    launch,
    tasks,
    task,
  }))
  const outDir = path.join(tableRoot, folder, 'data')
  fs.mkdirSync(outDir, { recursive: true })
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
