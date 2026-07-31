/**
 * `description.table.rows` shape → templateId. Single source of truth for
 * routing table tasks to a concrete template.
 *
 * Unlike other domains (text, columnOperation), `answerInput` alone can't
 * distinguish these templates: groups `table_7,10,11,12,13,14,15` all share
 * the same `answerInput` (`type: 15`, empty adornments). The table UI is
 * instead driven by the row/answercell layout, so classification looks at
 * `description.table.rows`.
 */

interface ClassifiableRow {
  cells: unknown[]
}

interface ClassifiableTask {
  description?: {
    type?: string
    table?: { rows?: ClassifiableRow[] }
  }
}

const isAnswerCell = (cell: unknown): boolean => cell === 'answercell'

const answerCellCount = (row: ClassifiableRow): number =>
  row.cells.filter(isAnswerCell).length

const hasSvg = (row: ClassifiableRow): boolean =>
  row.cells.some((cell) => typeof cell === 'string' && cell.includes('<svg'))

const isAnswerCellFirstPair = (row: ClassifiableRow): boolean =>
  row.cells.length === 2 && isAnswerCell(row.cells[0])

/**
 * Returns the templateId for the row shape.
 * Known catalog: `table.plain`, `table.grid`, `table.inline`, `table.list`,
 * `table.multiRow`, `table.multiRowSvg`, `table.mixed`.
 */
export const classifyTableTemplate = (task: ClassifiableTask): string => {
  const rows = task.description?.table?.rows
  if (task.description?.type !== 'table' || !rows || rows.length === 0) {
    return 'table.plain'
  }

  if (rows.length === 1) {
    return answerCellCount(rows[0]) > 1 ? 'table.inline' : 'table.plain'
  }

  if (rows.every(isAnswerCellFirstPair)) {
    return 'table.list'
  }

  const dataRows = rows.slice(0, -1)
  const lastRow = rows[rows.length - 1]
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
