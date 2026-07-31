import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { classifyTextTemplate } from '../src/modules/tasks/ui/templates/text/lib/classify-text-template'

type Task = {
  type?: string
  answerInput?: unknown
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

const templateTypes = [
  ['text.plain', 'TemplateTypes.Text.Plain'],
  ['text.before', 'TemplateTypes.Text.Before'],
  ['text.after', 'TemplateTypes.Text.After'],
  ['text.beforeAfter', 'TemplateTypes.Text.BeforeAfter'],
  ['text.aiTranslation', 'TemplateTypes.Text.AiTranslation'],
  ['text.multi.stack.n2.before', 'TemplateTypes.Text.Multi.Stack.N2Before'],
  ['text.multi.stack.n2.after', 'TemplateTypes.Text.Multi.Stack.N2After'],
  [
    'text.multi.stack.n2.beforeAfter',
    'TemplateTypes.Text.Multi.Stack.N2BeforeAfter',
  ],
  ['text.multi.stack.n3.before', 'TemplateTypes.Text.Multi.Stack.N3Before'],
  [
    'text.multi.stack.n3.beforeAfter',
    'TemplateTypes.Text.Multi.Stack.N3BeforeAfter',
  ],
  ['text.multi.stack.n4.after', 'TemplateTypes.Text.Multi.Stack.N4After'],
  ['text.multi.stack.n5.after', 'TemplateTypes.Text.Multi.Stack.N5After'],
  ['text.multi.inline.n2.after', 'TemplateTypes.Text.Multi.Inline.N2After'],
  [
    'text.multi.inline.n3.beforeAfter',
    'TemplateTypes.Text.Multi.Inline.N3BeforeAfter',
  ],
  ['text.multi.inline.n5.after', 'TemplateTypes.Text.Multi.Inline.N5After'],
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
const tasksByChapterAndId = new Map<string, Task>()

for (const bundle of bundles) {
  for (const task of bundle.tasks ?? []) {
    const match = /^Elixir\.Task_4_(\d+)_(.+)$/.exec(task.type ?? '')
    if (!match) continue

    const [, chapter, taskId] = match
    tasksByChapterAndId.set(`${chapter}:${taskId}`, task)
  }
}

const readCurrentTaskIds = (source: string): Array<number | string> => {
  const taskIds: Array<number | string> = []
  const arrayPattern = /\[[^\]]+\]:\s*\[([\s\S]*?)\]/g

  for (const match of source.matchAll(arrayPattern)) {
    const valuePattern = /'([^']+)'|\b(\d+)\b/g
    for (const valueMatch of match[1].matchAll(valuePattern)) {
      taskIds.push(valueMatch[1] ?? Number(valueMatch[2]))
    }
  }

  return taskIds
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

let mappedCount = 0
const missing: string[] = []

for (let chapter = 1; chapter <= 12; chapter += 1) {
  const chapterPath = path.join(chaptersRoot, `chapter-${chapter}.ts`)
  const taskIds = readCurrentTaskIds(fs.readFileSync(chapterPath, 'utf8'))
  const grouped = new Map<string, Array<number | string>>()

  for (const taskId of taskIds) {
    const task = tasksByChapterAndId.get(`${chapter}:${taskId}`)
    if (!task) {
      missing.push(`${chapter}:${taskId}`)
      continue
    }

    const templateType = classifyTextTemplate(task)
    const group = grouped.get(templateType) ?? []
    group.push(taskId)
    grouped.set(templateType, group)
    mappedCount += 1
  }

  const entries = templateTypes.flatMap(([templateType, expression]) => {
    const ids = grouped.get(templateType)
    if (!ids?.length) return []

    return [`  [${expression}]: [\n${formatTaskIds(ids)}\n  ],`]
  })

  const output = `import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
${entries.join('\n')}
}

export default map
`

  fs.writeFileSync(chapterPath, output)
}

console.log(`Snapshot: ${latestSnapshot}`)
console.log(`Mapped task ids: ${mappedCount}`)
console.log(`Missing task ids (${missing.length}): ${missing.join(', ')}`)
