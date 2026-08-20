/**
 * Rebuild grade-4 chapter maps from the latest stats snapshot so available-tasks
 * covers every grade-4 task (target ~2239), not only the previously listed ids.
 *
 * Unknown structural variants map to the closest existing TemplateTypes entry.
 *
 * Usage: node --experimental-strip-types scripts/generate-grade4-full-maps-from-snapshot.mts
 *    or: pnpm exec tsx scripts/generate-grade4-full-maps-from-snapshot.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { TemplateTypes } from '../src/modules/tasks/model/template-types.ts'
import { classifyColumnOperationTemplate } from '../src/modules/tasks/ui/templates/column-operation/lib/classify-column-operation-template'
import { classifyComplexTemplate } from '../src/modules/tasks/ui/templates/complex/lib/classify-complex-template'
import { classifyFormulaTemplate } from '../src/modules/tasks/ui/templates/formula/lib/classify-formula-template'
import { classifyTextTemplate } from '../src/modules/tasks/ui/templates/text/lib/classify-text-template'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modalRoot = path.resolve(__dirname, '..')
const snapshotsRoot = path.resolve(modalRoot, '../stats/snapshots')
const chaptersRoot = path.join(modalRoot, 'src/modules/tasks/ui/grades/grade-4')

type AnyTask = {
  type?: string
  description?: { type?: string }
  answerInput?: unknown
  fields?: unknown
  title?: unknown
}

const latestGrade4Path = fs
  .readdirSync(snapshotsRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name.startsWith('stats-'))
  .map((e) => path.join(snapshotsRoot, e.name, 'task_data_grade_4.json'))
  .filter(fs.existsSync)
  .sort()
  .at(-1)

if (!latestGrade4Path) {
  throw new Error('No task_data_grade_4.json in stats/snapshots')
}

const bundles = JSON.parse(fs.readFileSync(latestGrade4Path, 'utf8')) as Array<{
  tasks?: AnyTask[]
}>

/** Elixir.Task_4_3_2_4 → { chapter: 3, taskId: '2_4' } */
const parseElixir = (
  type: string | undefined,
): { chapter: number; taskId: string } | null => {
  const m = /^Elixir\.Task_4_(\d+)_(.+)$/.exec(type ?? '')
  if (!m) return null
  return { chapter: Number(m[1]), taskId: m[2] }
}

const TEXT_FALLBACK: Record<string, string> = {
  'text.multi.stack.n2.plain': TemplateTypes.Text.Multi.Stack.N2Before,
  'text.multi.stack.n3.plain': TemplateTypes.Text.Multi.Stack.N3Before,
  'text.multi.stack.n3.after': TemplateTypes.Text.Multi.Stack.N3BeforeAfter,
  'text.multi.stack.n4.plain': TemplateTypes.Text.Multi.Stack.N4After,
  'text.multi.stack.n4.before': TemplateTypes.Text.Multi.Stack.N4After,
  'text.multi.stack.n4.beforeAfter': TemplateTypes.Text.Multi.Stack.N4After,
  'text.multi.stack.n5.plain': TemplateTypes.Text.Multi.Stack.N5After,
  'text.multi.stack.n5.before': TemplateTypes.Text.Multi.Stack.N5After,
  'text.multi.stack.n5.beforeAfter': TemplateTypes.Text.Multi.Stack.N5After,
  'text.multi.inline.n2.beforeAfter': TemplateTypes.Text.Multi.Inline.N2After,
  'text.multi.inline.n3.after': TemplateTypes.Text.Multi.Inline.N3BeforeAfter,
  'text.multi.inline.n4.after': TemplateTypes.Text.Multi.Inline.N5After,
}

/** Unknown structural variants → closest shipped TemplateTypes id. */
const DOMAIN_FALLBACK: Record<string, string> = {
  'columnOperation.multi.stack.n2.plain':
    TemplateTypes.ColumnOperation.Multi.Stack.N2Before,
  'columnOperation.multi.stack.n2.after':
    TemplateTypes.ColumnOperation.Multi.Stack.N2Before,
  'columnOperation.multi.stack.n2.beforeAfter':
    TemplateTypes.ColumnOperation.Multi.Stack.N2Before,
  'columnOperation.multi.inline.n2.before':
    TemplateTypes.ColumnOperation.Multi.Stack.N2Before,
  'formula.multi.stack.n2.plain': TemplateTypes.Formula.Multi.Stack.N2Before,
  'formula.multi.stack.n2.after': TemplateTypes.Formula.Multi.Stack.N2Before,
  'formula.multi.stack.n2.beforeAfter':
    TemplateTypes.Formula.Multi.Stack.N2Before,
  'complex.multi.stack.n2.plain': TemplateTypes.Complex.Multi.Stack.N2After,
  'complex.multi.stack.n2.before': TemplateTypes.Complex.Multi.Stack.N2After,
}

const resolveClassified = (classifiedId: string, fallback: string): string => {
  const resolved = DOMAIN_FALLBACK[classifiedId] ?? classifiedId
  if (exprByValue.has(resolved)) return resolved
  return fallback
}

const resolveTemplateType = (task: AnyTask): string => {
  const descType = task.description?.type
  if (descType === 'text') {
    try {
      const id = classifyTextTemplate(task)
      const resolved = TEXT_FALLBACK[id] ?? id
      if (exprByValue.has(resolved)) return resolved
      return TemplateTypes.Text.Plain
    } catch {
      return TemplateTypes.Text.Plain
    }
  }
  switch (descType) {
    case 'table':
      return TemplateTypes.Table.Plain
    case 'formula':
      return resolveClassified(
        classifyFormulaTemplate(task),
        TemplateTypes.Formula.Plain,
      )
    case 'complex':
      return resolveClassified(
        classifyComplexTemplate(task),
        TemplateTypes.Complex.Plain,
      )
    case 'comparison':
      return TemplateTypes.Comparison.Plain
    case 'columnOperation':
      return resolveClassified(
        classifyColumnOperationTemplate(task),
        TemplateTypes.ColumnOperation.Plain,
      )
    case 'answerCell':
      return TemplateTypes.AnswerCell.Plain
    case 'test':
      return TemplateTypes.Test.Plain
    case 'equation':
      return TemplateTypes.Equation.Before
    default:
      return TemplateTypes.Text.Plain
  }
}

/** Expression string for codegen from a runtime TemplateTypes value. */
const exprByValue = new Map<string, string>()
const walk = (obj: unknown, prefix: string) => {
  if (typeof obj === 'string') {
    exprByValue.set(obj, prefix)
    return
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      walk(v, `${prefix}.${k}`)
    }
  }
}
walk(TemplateTypes, 'TemplateTypes')

const byChapter = new Map<number, Map<string, Array<string | number>>>()

let total = 0
let skipped = 0
for (const bundle of bundles) {
  for (const task of bundle.tasks ?? []) {
    const parsed = parseElixir(task.type)
    if (!parsed) {
      skipped += 1
      continue
    }
    const templateType = resolveTemplateType(task)
    const expr = exprByValue.get(templateType)
    if (!expr) {
      skipped += 1
      continue
    }
    let chapterMap = byChapter.get(parsed.chapter)
    if (!chapterMap) {
      chapterMap = new Map()
      byChapter.set(parsed.chapter, chapterMap)
    }
    const ids = chapterMap.get(expr) ?? []
    // Prefer numeric ids when the suffix is a pure number
    const idValue = /^\d+$/.test(parsed.taskId)
      ? Number(parsed.taskId)
      : parsed.taskId
    if (!ids.includes(idValue)) ids.push(idValue)
    chapterMap.set(expr, ids)
    total += 1
  }
}

const formatIds = (ids: Array<string | number>): string => {
  const lines: string[] = []
  for (let i = 0; i < ids.length; i += 8) {
    const chunk = ids
      .slice(i, i + 8)
      .map((id) => (typeof id === 'number' ? String(id) : `'${id}'`))
    lines.push(`    ${chunk.join(', ')},`)
  }
  return lines.join('\n')
}

for (let chapter = 1; chapter <= 12; chapter += 1) {
  const chapterMap =
    byChapter.get(chapter) ?? new Map<string, Array<string | number>>()
  const entries = [...chapterMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([expr, ids]) => `  [${expr}]: [\n${formatIds(ids)}\n  ],`)

  const output = `import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
${entries.join('\n')}
}

export default map
`

  fs.writeFileSync(path.join(chaptersRoot, `chapter-${chapter}.ts`), output)
}

console.log(`Snapshot: ${latestGrade4Path}`)
console.log(`Mapped tasks into chapter maps: ${total}`)
console.log(`Skipped: ${skipped}`)
