import clsx from 'clsx'
import { describe, expect, it } from 'vitest'

import styles from '../shared/table.module.scss'

import {
  getCellClassName,
  getInputClassName,
  getTableClassName,
} from './get-table-classnames'

describe('getTableClassName', () => {
  it('plain table: base class only', () => {
    expect(getTableClassName({ id: 'table.plain', mode: 'input' })).toBe(
      clsx(styles.table),
    )
  })

  it('applies tableRemoveBorders/tableRemovePadding from props', () => {
    expect(
      getTableClassName({
        id: 'table.plain',
        mode: 'input',
        removeBorders: true,
        removePadding: true,
      }),
    ).toBe(
      clsx(styles.table, styles.tableRemoveBorders, styles.tableRemovePadding),
    )
  })

  it('table.plain + removeBorders adds equationStretch', () => {
    expect(
      getTableClassName({
        id: 'table.plain',
        mode: 'input',
        removeBorders: true,
      }),
    ).toBe(
      clsx(styles.table, styles.tableRemoveBorders, styles.equationStretch),
    )
  })

  it('grid/multiRow/multiRowSvg get tableRounded', () => {
    for (const id of ['table.grid', 'table.multiRow', 'table.multiRowSvg']) {
      expect(getTableClassName({ id, mode: 'input' })).toBe(
        clsx(styles.table, styles.tableRounded),
      )
    }
  })

  it('table.inline input mode gets tableFlexInlineInput; solution mode does not', () => {
    expect(getTableClassName({ id: 'table.inline', mode: 'input' })).toBe(
      clsx(styles.table, styles.tableFlexInlineInput),
    )
    expect(getTableClassName({ id: 'table.inline', mode: 'solution' })).toBe(
      clsx(styles.table),
    )
  })

  it('table.mixed gets the mode-specific flex class', () => {
    expect(getTableClassName({ id: 'table.mixed', mode: 'input' })).toBe(
      clsx(styles.table, styles.tableFlexMixedInput),
    )
    expect(getTableClassName({ id: 'table.mixed', mode: 'solution' })).toBe(
      clsx(styles.table, styles.tableFlexMixedSolution),
    )
  })

  it('table.list gets the mode-specific flex class', () => {
    expect(getTableClassName({ id: 'table.list', mode: 'input' })).toBe(
      clsx(styles.table, styles.tableFlexListInput),
    )
    expect(getTableClassName({ id: 'table.list', mode: 'solution' })).toBe(
      clsx(styles.table, styles.tableFlexListSolution),
    )
  })
})

describe('getCellClassName', () => {
  const base = {
    id: 'table.plain',
    mode: 'input' as const,
    isInput: false,
    isFirstCell: false,
    isLastCell: false,
    isHeaderRow: false,
    isLastRow: false,
  }

  it('plain cell: base classes only', () => {
    expect(getCellClassName(base)).toBe(clsx(styles.cell))
  })

  it('answercell gets inputCell + inputCellDefaultWidth (table.plain is not inline/list/mixed)', () => {
    expect(getCellClassName({ ...base, isInput: true })).toBe(
      clsx(styles.cell, styles.inputCell, styles.inputCellDefaultWidth),
    )
  })

  it('grid header row (not last row)', () => {
    expect(
      getCellClassName({ ...base, id: 'table.grid', isHeaderRow: true }),
    ).toBe(clsx(styles.cell, styles.cellHeader))
  })

  it('grid/multiRow/multiRowSvg last row: no bottom border', () => {
    for (const id of ['table.grid', 'table.multiRow', 'table.multiRowSvg']) {
      expect(getCellClassName({ ...base, id, isLastRow: true })).toBe(
        clsx(styles.cell, styles.cellNoBottomBorder),
      )
    }
  })

  it('grid/multiRow/multiRowSvg first column, non-input: label styling', () => {
    for (const id of ['table.grid', 'table.multiRow', 'table.multiRowSvg']) {
      expect(getCellClassName({ ...base, id, isFirstCell: true })).toBe(
        clsx(styles.cell, styles.cellFirstColLabel),
      )
    }
  })

  it('grid/multiRow/multiRowSvg first column, input: no label styling, but still gets inputCellDefaultWidth', () => {
    for (const id of ['table.grid', 'table.multiRow', 'table.multiRowSvg']) {
      expect(
        getCellClassName({ ...base, id, isFirstCell: true, isInput: true }),
      ).toBe(clsx(styles.cell, styles.inputCell, styles.inputCellDefaultWidth))
    }
  })

  it('table.inline: mode-specific cell class, plus inputCellInlineInput for answercells in input mode', () => {
    expect(
      getCellClassName({ ...base, id: 'table.inline', mode: 'solution' }),
    ).toBe(clsx(styles.cell, styles.cellInlineSolution))
    expect(
      getCellClassName({ ...base, id: 'table.inline', mode: 'input' }),
    ).toBe(clsx(styles.cell, styles.cellInlineInput))
    expect(
      getCellClassName({
        ...base,
        id: 'table.inline',
        mode: 'input',
        isInput: true,
      }),
    ).toBe(
      clsx(
        styles.cell,
        styles.inputCell,
        styles.cellInlineInput,
        styles.inputCellInlineInput,
      ),
    )
  })

  it('table.mixed solution mode: cellMixedSolution applies to cell and inputCell alike', () => {
    expect(
      getCellClassName({ ...base, id: 'table.mixed', mode: 'solution' }),
    ).toBe(clsx(styles.cell, styles.cellMixedSolution))
    expect(
      getCellClassName({
        ...base,
        id: 'table.mixed',
        mode: 'solution',
        isInput: true,
      }),
    ).toBe(clsx(styles.cell, styles.inputCell, styles.cellMixedSolution))
  })

  it('table.mixed input mode: cellMixedInput on cell, extra sizing on inputCell', () => {
    expect(
      getCellClassName({ ...base, id: 'table.mixed', mode: 'input' }),
    ).toBe(clsx(styles.cell, styles.cellMixedInput))
    expect(
      getCellClassName({
        ...base,
        id: 'table.mixed',
        mode: 'input',
        isInput: true,
      }),
    ).toBe(clsx(styles.cell, styles.inputCell, styles.cellMixedInput))
  })

  it('table.list: last cell gets mode-specific label styling, inputCell gets mode-specific sizing', () => {
    expect(
      getCellClassName({
        ...base,
        id: 'table.list',
        mode: 'input',
        isLastCell: true,
      }),
    ).toBe(clsx(styles.cell, styles.cellListLastInput))
    expect(
      getCellClassName({
        ...base,
        id: 'table.list',
        mode: 'solution',
        isLastCell: true,
      }),
    ).toBe(clsx(styles.cell, styles.cellListLastSolution))
    expect(
      getCellClassName({
        ...base,
        id: 'table.list',
        mode: 'input',
        isInput: true,
      }),
    ).toBe(clsx(styles.cell, styles.inputCell, styles.inputCellListInput))
    expect(
      getCellClassName({
        ...base,
        id: 'table.list',
        mode: 'solution',
        isInput: true,
      }),
    ).toBe(clsx(styles.cell, styles.inputCell, styles.inputCellListSolution))
  })

  it('table.plain solution mode: inputCell gets inputCellPlainSolution and inputCellDefaultWidth', () => {
    expect(
      getCellClassName({
        ...base,
        id: 'table.plain',
        mode: 'solution',
        isInput: true,
      }),
    ).toBe(
      clsx(
        styles.cell,
        styles.inputCell,
        styles.inputCellDefaultWidth,
        styles.inputCellPlainSolution,
      ),
    )
  })

  it('inputCellDefaultWidth applies to plain/grid/multiRow/multiRowSvg input cells, not inline/list/mixed', () => {
    for (const id of [
      'table.plain',
      'table.grid',
      'table.multiRow',
      'table.multiRowSvg',
    ]) {
      expect(getCellClassName({ ...base, id, isInput: true })).toContain(
        styles.inputCellDefaultWidth,
      )
    }
    for (const id of ['table.inline', 'table.list', 'table.mixed']) {
      expect(
        getCellClassName({ ...base, id, mode: 'input', isInput: true }),
      ).not.toContain(styles.inputCellDefaultWidth)
    }
  })
})

describe('getInputClassName', () => {
  it('defaults to base input class', () => {
    expect(getInputClassName({ id: 'table.grid', mode: 'input' })).toBe(
      clsx(styles.input),
    )
  })

  it('mixed/list/plain solution mode adds inputWidthAuto', () => {
    for (const id of ['table.mixed', 'table.list', 'table.plain']) {
      expect(getInputClassName({ id, mode: 'solution' })).toBe(
        clsx(styles.input, styles.inputWidthAuto),
      )
      expect(getInputClassName({ id, mode: 'input' })).toBe(clsx(styles.input))
    }
  })
})
