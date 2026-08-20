/**
 * Merges columnOperation template ids into grade-4 chapter maps.
 * Preserves existing Text.* entries; adds/replaces ColumnOperation.* blocks.
 *
 * Usage (from new-task-modal):
 *   npx tsx scripts/generate-grade4-column-operation-chapter-map.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { classifyColumnOperationTemplate } from '../src/modules/tasks/ui/templates/column-operation/lib/classify-column-operation-template'

type Task = {
  type?: string
  answerInput?: unknown
  description?: { type?: string }
}

type TaskBundle = {
  tasks?: Task[]
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const modalRoot = path.resolve(scriptDir, '..')
const snapshotsRoot = path.resolve(modalRoot, '../stats/snapshots')
const chaptersRoot = path.resolve(
  modalRoot,
  'src/modules/tasks/ui/grades/grade-4',
)

const coTemplateTypes = [
  ['columnOperation.plain', 'TemplateTypes.ColumnOperation.Plain'],
  [
    'columnOperation.multi.stack.n2.before',
    'TemplateTypes.ColumnOperation.Multi.Stack.N2Before',
  ],
] as const

const latestSnapshot = fs
  .readdirSync(snapshotsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('stats-'))
  .map((entry) =>
    path.join(snapshotsRoot, entry.name, 'task_data_grade_4.json'),
  )
  .filter(fs.existsSync)
  .sort()
  .at(-1)

if (!latestSnapshot) {
  throw new Error(`No Grade 4 task snapshot found in ${snapshotsRoot}`)
}

const bundles = JSON.parse(
  fs.readFileSync(latestSnapshot, 'utf8'),
) as TaskBundle[]

/** chapter → templateId → taskIds */
const byChapter = new Map<number, Map<string, Array<number | string>>>()

const parseTaskId = (raw: string): number | string =>
  /^\d+$/.test(raw) ? Number(raw) : raw

for (const bundle of bundles) {
  for (const task of bundle.tasks ?? []) {
    if (task.description?.type !== 'columnOperation') continue

    const match = /^Elixir\.Task_4_(\d+)_(.+)$/.exec(task.type ?? '')
    if (!match) continue

    const chapter = Number(match[1])
    const taskId = parseTaskId(match[2])
    const templateType = classifyColumnOperationTemplate(task)

    if (!byChapter.has(chapter)) byChapter.set(chapter, new Map())
    const grouped = byChapter.get(chapter)!
    const list = grouped.get(templateType) ?? []
    if (!list.includes(taskId)) list.push(taskId)
    grouped.set(templateType, list)
  }
}

const formatTaskId = (taskId: number | string): string =>
  typeof taskId === 'number' ? String(taskId) : `'${taskId}'`

const formatTaskIds = (taskIds: Array<number | string>): string => {
  const lines: string[] = []
  for (let index = 0; index < taskIds.length; index += 8) {
    lines.push(
      `    ${taskIds
        .slice(index, index + 8)
        .map(formatTaskId)
        .join(', ')},`,
    )
  }
  return lines.join('\n')
}

/** Keep non-ColumnOperation entries from existing chapter map source. */
const extractNonColumnOperationEntries = (source: string): string[] => {
  const entries: string[] = []
  const pattern =
    /(\s*\[TemplateTypes\.(?!ColumnOperation)[^\]]+\]:\s*\[[\s\S]*?\],)/g
  for (const match of source.matchAll(pattern)) {
    entries.push(match[1].replace(/^\n+/, '').replace(/\n+$/, ''))
  }
  return entries
}

let mappedCount = 0

for (let chapter = 1; chapter <= 12; chapter += 1) {
  const chapterPath = path.join(chaptersRoot, `chapter-${chapter}.ts`)
  if (!fs.existsSync(chapterPath)) continue

  const existing = fs.readFileSync(chapterPath, 'utf8')
  const kept = extractNonColumnOperationEntries(existing)
  const grouped =
    byChapter.get(chapter) ?? new Map<string, Array<number | string>>()

  const coEntries = coTemplateTypes.flatMap(([templateType, expression]) => {
    const ids = (grouped.get(templateType) ?? []).slice().sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a - b
      return String(a).localeCompare(String(b))
    })
    if (!ids.length) return []
    mappedCount += ids.length
    return [`  [${expression}]: [\n${formatTaskIds(ids)}\n  ],`]
  })

  const allEntries = [...kept, ...coEntries]
  if (!allEntries.length) continue

  const output = `import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
${allEntries.join('\n')}
}

export default map
`

  fs.writeFileSync(chapterPath, output)
}

console.log(`Snapshot: ${latestSnapshot}`)
console.log(`Mapped columnOperation task ids: ${mappedCount}`)
