import clsx from 'clsx'

import styles from '../shared/table.module.scss'

export type TableMode = 'input' | 'solution'

const ROUNDED_IDS = new Set([
  'table.grid',
  'table.multiRow',
  'table.multiRowSvg',
])
const LABEL_COLUMN_IDS = ROUNDED_IDS
const INPUT_WIDTH_AUTO_IDS = new Set([
  'table.mixed',
  'table.list',
  'table.plain',
])
const FLEX_SIZED_IDS = new Set(['table.inline', 'table.list', 'table.mixed'])

export function getTableClassName(params: {
  id: string
  mode: TableMode
  removeBorders?: boolean
  removePadding?: boolean
}): string {
  const { id, mode, removeBorders, removePadding } = params

  return clsx(
    styles.table,
    removeBorders && styles.tableRemoveBorders,
    removePadding && styles.tableRemovePadding,
    id === 'table.plain' &&
      removeBorders &&
      !removePadding &&
      styles.equationStretch,
    ROUNDED_IDS.has(id) && styles.tableRounded,
    id === 'table.inline' && mode === 'input' && styles.tableFlexInlineInput,
    id === 'table.mixed' &&
      mode === 'solution' &&
      styles.tableFlexMixedSolution,
    id === 'table.mixed' && mode === 'input' && styles.tableFlexMixedInput,
    id === 'table.list' && mode === 'input' && styles.tableFlexListInput,
    id === 'table.list' && mode === 'solution' && styles.tableFlexListSolution,
  )
}

export function getCellClassName(params: {
  id: string
  mode: TableMode
  isInput: boolean
  isFirstCell: boolean
  isLastCell: boolean
  isHeaderRow: boolean
  isLastRow: boolean
}): string {
  const { id, mode, isInput, isFirstCell, isLastCell, isHeaderRow, isLastRow } =
    params

  return clsx(
    styles.cell,
    isInput && styles.inputCell,
    isInput && !FLEX_SIZED_IDS.has(id) && styles.inputCellDefaultWidth,
    isHeaderRow && styles.cellHeader,
    ROUNDED_IDS.has(id) && isLastRow && styles.cellNoBottomBorder,
    LABEL_COLUMN_IDS.has(id) &&
      isFirstCell &&
      !isInput &&
      styles.cellFirstColLabel,
    id === 'table.inline' && mode === 'solution' && styles.cellInlineSolution,
    id === 'table.inline' && mode === 'input' && styles.cellInlineInput,
    id === 'table.inline' &&
      mode === 'input' &&
      isInput &&
      styles.inputCellInlineInput,
    id === 'table.mixed' && mode === 'solution' && styles.cellMixedSolution,
    id === 'table.mixed' && mode === 'input' && styles.cellMixedInput,
    id === 'table.list' &&
      mode === 'input' &&
      isLastCell &&
      styles.cellListLastInput,
    id === 'table.list' &&
      mode === 'solution' &&
      isLastCell &&
      styles.cellListLastSolution,
    id === 'table.list' &&
      mode === 'input' &&
      isInput &&
      styles.inputCellListInput,
    id === 'table.list' &&
      mode === 'solution' &&
      isInput &&
      styles.inputCellListSolution,
    id === 'table.plain' &&
      mode === 'solution' &&
      isInput &&
      styles.inputCellPlainSolution,
  )
}

export function getInputClassName(params: {
  id: string
  mode: TableMode
}): string {
  const { id, mode } = params

  return clsx(
    styles.input,
    mode === 'solution' &&
      INPUT_WIDTH_AUTO_IDS.has(id) &&
      styles.inputWidthAuto,
  )
}
