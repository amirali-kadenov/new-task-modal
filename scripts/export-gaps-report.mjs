/**
 * Builds a frozen template-gaps report JSON for Storybook docs
 * (Statistics/Gaps → GapsReportBlock). Does not feed StatsPanel / stats-static.
 *
 * Usage (from new-task-modal):
 *   node scripts/export-gaps-report.mjs
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modalRoot = path.resolve(__dirname, '..')
const outPath = path.join(
  modalRoot,
  'src/docs/statistics/data/template-gaps-report.json',
)
const require = createRequire(import.meta.url)
const snapshots = require(
  path.resolve(modalRoot, '../stats/server/src/snapshots.js'),
)
const gapsReport = require(
  path.resolve(modalRoot, '../stats/server/src/pipeline/gapsReport.js'),
)
const runJob = require(
  path.resolve(modalRoot, '../stats/server/src/pipeline/runJob.js'),
)

async function loadAllBundles(outputDir) {
  const taskDataPath = await snapshots.findTaskDataFile(outputDir)
  if (!taskDataPath) {
    throw new Error(`No task_data in ${outputDir}`)
  }
  const raw = fs.readFileSync(taskDataPath, 'utf8')
  const allBundles = JSON.parse(raw)
  const baseName = path.basename(taskDataPath)
  if (baseName === 'task_data_grade_4.json') {
    allBundles.forEach((b) => {
      if (b.grade == null) b.grade = 4
    })
  }
  return allBundles
}

async function main() {
  const list = await snapshots.listSnapshots()
  if (!list.length) {
    console.error(
      'export-gaps-report: no snapshots in stats/snapshots/.\n' +
        'Generate a snapshot first (stats server → Generate).',
    )
    process.exit(1)
  }

  const preferred =
    list.find((s) => (s.grades || []).length > 1) ||
    list.find((s) => (s.grades || []).includes(4)) ||
    list[0]

  const bundles = await loadAllBundles(preferred.outputDir)
  const report = gapsReport.buildGapsReport(bundles)

  let meta = {}
  try {
    const metaRaw = fs.readFileSync(
      path.join(preferred.outputDir, runJob.META_FILE),
      'utf8',
    )
    meta = JSON.parse(metaRaw)
  } catch {
    // ignore
  }

  const payload = {
    meta: {
      snapshotName: preferred.name,
      snapshotCreatedAt: preferred.createdAt || meta.createdAt || null,
      exportedAt: new Date().toISOString(),
      grades: preferred.grades || meta.grades || [],
      withSolutions:
        preferred.withSolutions != null
          ? Boolean(preferred.withSolutions)
          : Boolean(meta.withSolutions),
      taskCount:
        preferred.taskCount != null
          ? preferred.taskCount
          : meta.taskCount != null
            ? meta.taskCount
            : report.totalTasks,
    },
    ...report,
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log(
    `export-gaps-report: wrote ${path.relative(modalRoot, outPath)} ` +
      `(${payload.missingTemplateCount} missing templates, ` +
      `${payload.totalTasks} tasks from ${preferred.name})`,
  )
}

main().catch((err) => {
  console.error('export-gaps-report failed:', err)
  process.exit(1)
})
