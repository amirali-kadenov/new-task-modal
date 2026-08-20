/**
 * Emit e2e/data/grade4-all-from-snapshot.json — one fixture per grade-4 task
 * from the latest stats snapshot (target 2239).
 *
 * Usage: node scripts/generate-e2e-grade4-snapshot-fixtures.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const modalRoot = path.resolve(__dirname, '..')
const snapshotsRoot = path.join(repoRoot, 'stats/snapshots')
const outPath = path.join(modalRoot, 'e2e/data/grade4-all-from-snapshot.json')

const latestDir = fs
  .readdirSync(snapshotsRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name.startsWith('stats-'))
  .map((e) => e.name)
  .sort()
  .at(-1)

if (!latestDir) throw new Error('No stats snapshot')

const snapshotDir = path.join(snapshotsRoot, latestDir)
const dataPath = path.join(snapshotDir, 'task_data_grade_4.json')
const answersPath = path.join(snapshotDir, 'task_answers.json')
if (!fs.existsSync(dataPath)) {
  throw new Error(`Missing ${dataPath} — extract grade-4 bundles first`)
}

const bundles = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
const answersDump = JSON.parse(fs.readFileSync(answersPath, 'utf8'))

const byTaskId = new Map()
const byUuid = new Map()
for (const ch of answersDump.chapters || []) {
  for (const t of ch.tasks || []) {
    const a = t.answerString
    if (a == null || a === '') continue
    byUuid.set(t.id, a)
    if (t.taskId) byTaskId.set(t.taskId, a)
    const m = /^Elixir\.Task_(\d+_\d+_.+)$/.exec(t.type || '')
    if (m) byTaskId.set(m[1], a)
  }
}

const fixtures = []
let missing = 0
for (const bundle of bundles) {
  const tasks = bundle.tasks || []
  for (let i = 0; i < tasks.length; i += 1) {
    const task = tasks[i]
    const m = /^Elixir\.Task_(\d+_\d+_.+)$/.exec(task.type || '')
    const taskId = m?.[1]
    const answer =
      (taskId && byTaskId.get(taskId)) || byUuid.get(task.id) || null
    if (!answer) {
      missing += 1
      continue
    }
    const descType = task.description?.type || 'unknown'
    const domain =
      descType === 'columnOperation'
        ? 'column-operation'
        : descType === 'answerCell'
          ? 'answer-cell'
          : descType
    const taskIndex = task.position ?? i
    fixtures.push({
      key: `snapshot/${domain}#${taskId || task.id}@${bundle.lessonId}:${taskIndex}`,
      domain,
      launch: {
        grade: 4,
        chapterId: String(bundle.chapterId),
        lessonId: String(bundle.lessonId),
        taskIndex,
      },
      answer,
      isMultipleChoice: descType === 'test',
      scope: 'allTasks',
    })
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(fixtures, null, 2))
console.log(`Snapshot: ${snapshotDir}`)
console.log(`Wrote ${fixtures.length} fixtures → ${outPath}`)
console.log(`Missing answers: ${missing}`)
