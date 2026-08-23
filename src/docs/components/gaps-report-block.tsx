import s from '../docs.module.scss'
import report from '../statistics/data/template-gaps-report.json'

type GradeRow = {
  grade: number
  total: number
  structural: number
  structuralPct: string
  wired: number
  wiredPct: string
  gap: number
}

type MissingRow = {
  templateId: string
  type: string
  count: number
  percent: string
  difficulty: string
  byGrade: Record<string, number>
}

type GapsReport = {
  meta: {
    snapshotName: string
    snapshotCreatedAt: string | null
    exportedAt: string
    grades: number[]
    taskCount: number | null
  }
  totalTasks: number
  structurallyCovered: number
  structurallyCoveredPct: string
  wired: number
  wiredPct: string
  needNewTemplate: number
  needNewTemplatePct: string
  missingTemplateCount: number
  gradeRows: GradeRow[]
  difficultyBuckets: {
    easy: { templates: number; tasks: number }
    medium: { templates: number; tasks: number }
    hard: { templates: number; tasks: number }
  }
  missingTemplates: MissingRow[]
}

const data = report as GapsReport

function pct(part: number, total: number) {
  if (!total) return '0.0'
  return ((part / total) * 100).toFixed(1)
}

function formatByGrade(byGrade: Record<string, number> | undefined) {
  if (!byGrade) return '—'
  return Object.keys(byGrade)
    .map(Number)
    .sort((a, b) => a - b)
    .map((g) => `${g}:${byGrade[g]}`)
    .join(' ')
}

function difficultyLabel(difficulty: string) {
  if (difficulty === 'easy') return 'лёгкий'
  if (difficulty === 'medium') return 'средний'
  if (difficulty === 'hard') return 'сложный'
  return difficulty
}

function formatWhen(iso: string | null | undefined) {
  if (!iso) return ''
  return iso.slice(0, 19).replace('T', ' ')
}

/** Frozen gaps report for Statistics/Gaps — no stats server / snapshot fetch. */
export function GapsReportBlock() {
  const { meta, difficultyBuckets: buckets } = data
  const when = formatWhen(meta.snapshotCreatedAt) || formatWhen(meta.exportedAt)

  return (
    <div>
      <p>
        {meta.snapshotName ? (
          <>
            Цифры посчитаны по выгрузке <code>{meta.snapshotName}</code>
            {when ? <> ({when})</> : null}
            {meta.taskCount != null ? <> · {meta.taskCount} задач</> : null}
            .{' '}
          </>
        ) : null}
        Пересчёт: <code>pnpm export-gaps-report</code>.
      </p>

      <p>
        У <strong>{data.structurallyCoveredPct}%</strong> задач (
        {data.structurallyCovered} из {data.totalTasks}) в коде уже есть
        подходящий шаблон. В список разрешённых (маппинг) попало только{' '}
        <strong>{data.wiredPct}%</strong> ({data.wired}) — почти всё это 4
        класс. Без шаблона остаётся <strong>{data.needNewTemplatePct}%</strong>{' '}
        ({data.needNewTemplate} задач, {data.missingTemplateCount} разных
        шаблонов). Из них по сложности: лёгкие ~{buckets.easy.tasks} задач,
        средние ~{buckets.medium.tasks}, сложные ~{buckets.hard.tasks}.
      </p>

      <h3>По классам</h3>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Класс</th>
              <th>Всего</th>
              <th>% от всех задач</th>
              <th>Структурно</th>
              <th>Маппинг</th>
              <th>Gap</th>
            </tr>
          </thead>
          <tbody>
            {data.gradeRows.map((row) => (
              <tr key={row.grade}>
                <td>{row.grade}</td>
                <td>{row.total}</td>
                <td>{pct(row.total, data.totalTasks)}%</td>
                <td>
                  {row.structural} ({row.structuralPct}%)
                </td>
                <td>
                  {row.wired} ({row.wiredPct}%)
                </td>
                <td>{row.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Шаблоны к реализации</h3>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Шаблон</th>
              <th>Тип</th>
              <th>Сложность</th>
              <th>Классы</th>
              <th>Кол-во</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {data.missingTemplates.map((row, i) => (
              <tr key={row.templateId}>
                <td>{i + 1}</td>
                <td>
                  <code>{row.templateId}</code>
                </td>
                <td>{row.type}</td>
                <td>{difficultyLabel(row.difficulty)}</td>
                <td>{formatByGrade(row.byGrade)}</td>
                <td>{row.count}</td>
                <td>{row.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GapsReportBlock
