import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../..')
const snapshotsRoot = path.resolve(repoRoot, 'stats/snapshots')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getLatestSnapshotDir() {
  const latestDir = fs
    .readdirSync(snapshotsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('stats-'))
    .map((entry) => entry.name)
    .sort()
    .at(-1)

  if (!latestDir) {
    throw new Error(`No Grade 4 task snapshot found in ${snapshotsRoot}`)
  }

  return path.join(snapshotsRoot, latestDir)
}

function loadRawSnapshot() {
  const snapshotDir = getLatestSnapshotDir()
  const oldDataPath = path.join(snapshotDir, 'task_data_grade_4.json')
  const oldAnswersPath = path.join(snapshotDir, 'task_answers_grade_4.json')

  if (fs.existsSync(oldDataPath) && fs.existsSync(oldAnswersPath)) {
    return {
      snapshotDir,
      dataPath: oldDataPath,
      answersPath: oldAnswersPath,
      allData: readJson(oldDataPath),
      answersDump: readJson(oldAnswersPath),
      legacyGrade4Only: true,
    }
  }

  const dataPath = path.join(snapshotDir, 'task_data.json')
  const answersPath = path.join(snapshotDir, 'task_answers.json')
  if (!fs.existsSync(dataPath) || !fs.existsSync(answersPath)) {
    throw new Error(
      `Snapshot ${snapshotDir} does not contain compatible task_data/task_answers files`,
    )
  }

  return {
    snapshotDir,
    dataPath,
    answersPath,
    allData: readJson(dataPath),
    answersDump: readJson(answersPath),
    legacyGrade4Only: false,
  }
}

/** Grades present in the latest snapshot (legacy grade-4-only dumps → `[4]`). */
export function getAvailableGrades() {
  const { allData, legacyGrade4Only } = loadRawSnapshot()
  if (legacyGrade4Only) return [4]

  const grades = new Set()
  for (const bundle of Array.isArray(allData) ? allData : []) {
    const grade = Number(bundle?.grade)
    if (Number.isFinite(grade)) grades.add(grade)
  }
  return [...grades].sort((a, b) => a - b)
}

/** Load lesson bundles filtered to one grade (+ shared answers dump). */
export function loadSnapshotForGrade(grade = 4) {
  const raw = loadRawSnapshot()
  const target = Number(grade)

  const data = (Array.isArray(raw.allData) ? raw.allData : []).filter(
    (bundle) =>
      raw.legacyGrade4Only ? true : Number(bundle?.grade) === target,
  )

  return {
    snapshotDir: raw.snapshotDir,
    dataPath: raw.dataPath,
    answersPath: raw.answersPath,
    data,
    answersDump: raw.answersDump,
    grade: target,
  }
}

/** Backward-compatible Grade 4 snapshot loader. */
export function loadGrade4Snapshot() {
  return loadSnapshotForGrade(4)
}

/** Shape written to `data/all-tasks.json` for All Tasks stories. */
export function toAllTasksFilePayload(byGrade, defaultGrade = 4) {
  const normalized = {}
  for (const [grade, tasks] of Object.entries(byGrade || {})) {
    if (!Array.isArray(tasks) || tasks.length === 0) continue
    normalized[String(grade)] = tasks
  }
  const grades = Object.keys(normalized)
    .map(Number)
    .sort((a, b) => a - b)
  const resolvedDefault = grades.includes(defaultGrade)
    ? defaultGrade
    : (grades[0] ?? defaultGrade)

  return {
    defaultGrade: resolvedDefault,
    grades,
    byGrade: normalized,
  }
}
