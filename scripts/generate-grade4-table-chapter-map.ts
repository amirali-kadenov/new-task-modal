/**
 * Merges table template ids into grade-4 chapter maps.
 * Preserves existing non-Table entries, but strips any task id that the
 * table classifier claims out of those entries first.
 *
 * Usage (from new-task-modal):
 *   npx tsx scripts/generate-grade4-table-chapter-map.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { classifyTableTemplate } from '../src/modules/tasks/ui/templates/table/lib/classify-table-template'

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

const tableTemplateTypes = [
  ['table.plain', 'TemplateTypes.Table.Plain'],
  ['table.grid', 'TemplateTypes.Table.Grid'],
  ['table.inline', 'TemplateTypes.Table.Inline'],
  ['table.list', 'TemplateTypes.Table.List'],
  ['table.mixed', 'TemplateTypes.Table.Mixed'],
  ['table.multiRow', 'TemplateTypes.Table.MultiRow'],
  ['table.multiRowSvg', 'TemplateTypes.Table.MultiRowSvg'],
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
/** chapter → taskId (string form) claimed by table */
const claimedByChapter = new Map<number, Set<string>>()

const parseTaskId = (raw: string): number | string =>
  /^\d+$/.test(raw) ? Number(raw) : raw

for (const bundle of bundles) {
  for (const task of bundle.tasks ?? []) {
    if (task.description?.type !== 'table') continue

    const match = /^Elixir\.Task_4_(\d+)_(.+)$/.exec(task.type ?? '')
    if (!match) continue

    const chapter = Number(match[1])
    const taskId = parseTaskId(match[2])
    const templateType = classifyTableTemplate(task)

    if (!byChapter.has(chapter)) byChapter.set(chapter, new Map())
    const grouped = byChapter.get(chapter)!
    const list = grouped.get(templateType) ?? []
    if (!list.includes(taskId)) list.push(taskId)
    grouped.set(templateType, list)

    if (!claimedByChapter.has(chapter)) claimedByChapter.set(chapter, new Set())
    claimedByChapter.get(chapter)!.add(String(taskId))
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

const parseTaskIds = (body: string): Array<number | string> => {
  const ids: Array<number | string> = []
  const valuePattern = /'([^']+)'|\b(\d+)\b/g
  for (const match of body.matchAll(valuePattern)) {
    ids.push(match[1] ?? Number(match[2]))
  }
  return ids
}

/**
 * Keep non-Table entries from the existing chapter map source, stripping
 * any task id that table now claims for this chapter.
 */
const extractNonTableEntries = (
  source: string,
  claimedIds: Set<string>,
): string[] => {
  const entries: string[] = []
  const pattern =
    /\s*\[(TemplateTypes\.(?!Table)[^\]]+)\]:\s*\[([\s\S]*?)\],/g

  for (const match of source.matchAll(pattern)) {
    const [, expression, body] = match
    const ids = parseTaskIds(body)
    const filtered = ids.filter((id) => !claimedIds.has(String(id)))
    if (!filtered.length) continue
    entries.push(`  [${expression}]: [\n${formatTaskIds(filtered)}\n  ],`)
  }
  return entries
}

let mappedCount = 0

for (let chapter = 1; chapter <= 12; chapter += 1) {
  const chapterPath = path.join(chaptersRoot, `chapter-${chapter}.ts`)
  if (!fs.existsSync(chapterPath)) continue

  const existing = fs.readFileSync(chapterPath, 'utf8')
  const claimedIds = claimedByChapter.get(chapter) ?? new Set<string>()
  const kept = extractNonTableEntries(existing, claimedIds)
  const grouped = byChapter.get(chapter) ?? new Map()

  const tableEntries = tableTemplateTypes.flatMap(
    ([templateType, expression]) => {
      const ids = (grouped.get(templateType) ?? []).slice().sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') return a - b
        return String(a).localeCompare(String(b))
      })
      if (!ids.length) return []
      mappedCount += ids.length
      return [`  [${expression}]: [\n${formatTaskIds(ids)}\n  ],`]
    },
  )

  const allEntries = [...kept, ...tableEntries]
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
console.log(`Mapped table task ids: ${mappedCount}`)
