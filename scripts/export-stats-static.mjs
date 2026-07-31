/**
 * Exports precomputed StatsPanel API payloads from the latest local snapshot
 * into new-task-modal/public/stats-static/ for offline Storybook deploy.
 *
 * Usage (from new-task-modal):
 *   node scripts/export-stats-static.mjs
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modalRoot = path.resolve(__dirname, '..')
const outDir = path.join(modalRoot, 'public/stats-static')
const require = createRequire(import.meta.url)
const snapshots = require(
  path.resolve(modalRoot, '../stats/server/src/snapshots.js'),
)

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8')
}

function rewriteTable(data, snapshotName) {
  return Object.assign({}, data, { outputDir: snapshotName })
}

async function main() {
  const list = await snapshots.listSnapshots()
  if (!list.length) {
    console.error(
      'export-stats-static: no snapshots in stats/snapshots/.\n' +
        'Run stats server and Generate first:\n' +
        '  cd matheducator/reactjs_client && npm run stats:server',
    )
    process.exit(1)
  }

  const preferred =
    list.find((s) => (s.grades || []).includes(4)) || list[0]
  const snapshotName = preferred.name
  const outputDir = preferred.outputDir
  const grades = Array.isArray(preferred.grades) ? preferred.grades.slice() : []

  fs.mkdirSync(outDir, { recursive: true })
  for (const entry of fs.readdirSync(outDir)) {
    fs.unlinkSync(path.join(outDir, entry))
  }

  const staticList = {
    snapshots: [
      {
        name: snapshotName,
        outputDir: snapshotName,
        createdAt: preferred.createdAt,
        grades: grades,
        withSolutions: Boolean(preferred.withSolutions),
        taskCount: preferred.taskCount != null ? preferred.taskCount : null,
        lessonCount: preferred.lessonCount != null ? preferred.lessonCount : null,
      },
    ],
  }
  writeJson(path.join(outDir, 'snapshots.json'), staticList)

  const tableAll = rewriteTable(
    await snapshots.loadStatsTable(outputDir, 'all'),
    snapshotName,
  )
  writeJson(path.join(outDir, 'stats-table-all.json'), tableAll)

  const gradesToExport = grades.length
    ? grades
    : Array.isArray(tableAll.grades)
      ? tableAll.grades
      : []

  for (const grade of gradesToExport) {
    const table = rewriteTable(
      await snapshots.loadStatsTable(outputDir, String(grade)),
      snapshotName,
    )
    writeJson(path.join(outDir, `stats-table-grade-${grade}.json`), table)
  }

  const meta = {
    mode: 'static',
    createdAt: new Date().toISOString(),
    snapshotName: snapshotName,
    snapshotCreatedAt: preferred.createdAt,
    grades: gradesToExport,
    withSolutions: Boolean(preferred.withSolutions),
    taskCount: preferred.taskCount != null ? preferred.taskCount : null,
  }
  writeJson(path.join(outDir, 'meta.json'), meta)
  fs.writeFileSync(path.join(outDir, '.gitkeep'), '', 'utf8')

  console.log(
    `export-stats-static: wrote ${snapshotName} → ${path.relative(modalRoot, outDir)} ` +
      `(grades: ${gradesToExport.join(',') || 'all'})`,
  )
}

main().catch((err) => {
  console.error('export-stats-static failed:', err)
  process.exit(1)
})
