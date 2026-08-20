# Table className-Based Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every `data-template-id`/`data-mode` attribute-selector rule in `table.module.scss` with modifier classNames computed in JS and applied directly to the styled element, so DevTools always shows why a rule does or doesn't apply without climbing an ancestor chain.

**Architecture:** A new pure helper module (`get-table-classnames.ts`) exports `getTableClassName`, `getCellClassName`, `getInputClassName` — string-in/string-out functions mapping `(templateId, mode, position)` to a `clsx`-joined className. Both render components (`create-table-template.tsx`, `table-solution.tsx`) call these instead of building classNames inline. The stylesheet gains flat modifier classes matching each function's possible outputs; the old attribute-selector rules are deleted once nothing depends on them.

**Tech Stack:** React, TypeScript, SCSS Modules (Vite), `clsx`, Vitest, Playwright visual regression (`npm run test:visual`).

**Spec:** `docs/superpowers/specs/2026-08-19-table-cell-classname-styling-design.md`

## Global Constraints

- Pure refactor — zero intended visual change. Every task that touches rendering must be verified with `npm run test:visual -- --grep table` (Playwright), which must show zero diffs.
- `getTableClassName`/`getCellClassName`/`getInputClassName` are pure functions: no React, no DOM, no imports beyond `clsx` and the CSS module.
- `data-template-id`/`data-mode` attributes stay on `.container` in the DOM (may be used by e2e/QA selectors) — only their role as CSS selector hooks is removed.
- Follow existing test conventions: Vitest, `describe`/`it`/`expect` from `'vitest'`, one `.test.ts` file per source file, colocated.

---

### Task 1: Add className-based modifier rules to table.module.scss (additive)

**Files:**
- Modify: `src/modules/tasks/ui/templates/table/shared/table.module.scss` (append new rules; do not touch existing rules yet)

**Interfaces:**
- Produces: CSS module class keys consumed by Task 2's helper and Task 3's call sites — `tableRounded`, `tableFlexInlineInput`, `tableFlexMixedSolution`, `tableFlexMixedInput`, `tableFlexListInput`, `tableFlexListSolution`, `cellHeader`, `cellNoBottomBorder`, `cellFirstColLabel`, `cellInlineSolution`, `cellInlineInput`, `inputCellInlineInput`, `cellMixedSolution`, `cellMixedInput`, `inputWidthAuto`, `cellListLastInput`, `cellListLastSolution`, `inputCellListInput`, `inputCellListSolution`, `inputCellPlainSolution`, `inputCellDefaultWidth`.

This task is purely additive — the new classes aren't referenced by any component yet, so the app's actual rendering is unaffected. This keeps the diff safely reviewable and testable in isolation before any behavior changes.

- [ ] **Step 1: Append the new rules to the end of the file**

Add this block at the end of `table.module.scss` (after the existing `.htmlCell` rule), unchanged elsewhere:

```scss
// --- className-based table modifiers ---
// Mirror the data-template-id/data-mode attribute-selector rules above.
// Task 3 wires these into create-table-template.tsx / table-solution.tsx
// and deletes the attribute-selector rules once nothing depends on them.

.tableRounded {
  overflow: hidden;
  border-spacing: 0;
  border-collapse: separate;
  border-color: var(--border-strong);
  border-radius: 12px;
}

.tableRounded.tableRemovePadding {
  border-spacing: 0 8px;
}

.tableFlexInlineInput {
  &,
  tbody,
  tr {
    display: flex;
    align-items: center;
    width: 100%;
  }
}

.tableFlexMixedSolution,
.tableFlexMixedInput {
  &,
  tbody {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  tr {
    display: flex;
    align-items: center;
    width: 100%;
  }
}

.tableFlexListInput {
  &,
  tbody {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  tr {
    display: flex;
    gap: 4px;
    align-items: center;
    width: 100%;
  }
}

.tableFlexListSolution {
  &,
  tbody {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: auto;
  }

  tr {
    display: flex;
    gap: 4px;
    align-items: center;
    width: auto;
  }
}

.cellHeader {
  background: var(--bg-subtle);
  @include body-medium-bold;
}

.cellNoBottomBorder {
  border-bottom: none;
}

.cellFirstColLabel {
  text-align: left;
  @include body-medium-bold;
}

.cellInlineSolution {
  display: inline-block;
  width: auto;
  padding: 4px;
}

.cellInlineInput {
  flex: 0 0 auto;
  width: auto;
  padding: 4px;
  white-space: nowrap;
}

.inputCellInlineInput {
  flex: 0 0 auto;
  width: 120px;
  min-width: 80px;
}

.cellMixedSolution {
  flex: 1 1 0;
  width: auto;
  min-width: 0;
  max-width: max-content;
  padding-inline: 2px;
}

.cellMixedInput {
  flex: 0 0 auto;
  width: auto;
  white-space: nowrap;
}

.inputCell.cellMixedInput {
  flex: 0 0 auto;
  width: 120px;
  min-width: 80px;
  padding-inline: 4px;
}

.inputWidthAuto {
  width: auto;
}

.cellListLastInput {
  flex: 0 0 auto;
  width: auto;
  white-space: nowrap;
}

.cellListLastSolution {
  flex: 0 0 auto;
  width: auto;
  text-align: left;
  white-space: nowrap;
}

.inputCellListInput {
  flex: 1 1 0;
  width: auto;
  min-width: 0;
}

.inputCellListSolution {
  flex: 0 0 auto;
  width: auto;
}

.inputCellPlainSolution {
  max-width: max-content;
  text-align: left;
}

// Replaces `.container:not([data-template-id='table.inline'],
// [data-template-id='table.list'],[data-template-id='table.mixed']) .inputCell`.
// Mutually exclusive with the inline/list/mixed input-cell width rules above
// (never applied for those three ids), so there's no specificity tie between
// this and them — exactly one width-setting rule is ever active per cell.
.inputCellDefaultWidth {
  width: 1%;
}
```

- [ ] **Step 2: Confirm the app still builds and lints clean**

Run: `npm run build` (from `new-task-modal/`)
Expected: build succeeds, no stylelint errors (the project runs stylelint as part of the Vite build — see `vite.config.ts`'s `stylelint({ fix: true, ... })` plugin).

- [ ] **Step 3: Confirm zero visual change (purely additive, nothing references the new classes yet)**

Run: `npm run storybook -- --ci &` then `npm run test:visual -- --grep table` (from `new-task-modal/`)
Expected: all table-related visual snapshots pass with zero diffs — nothing in the DOM references the new classes yet, so this is a smoke check that the SCSS addition alone didn't break compilation or cascade order for the existing rules.

- [ ] **Step 4: Commit**

```bash
git add src/modules/tasks/ui/templates/table/shared/table.module.scss
git commit -m "style(table): add className-based modifier rules alongside existing attribute selectors"
```

---

### Task 2: Create get-table-classnames.ts helper with unit tests

**Files:**
- Create: `src/modules/tasks/ui/templates/table/lib/get-table-classnames.ts`
- Test: `src/modules/tasks/ui/templates/table/lib/get-table-classnames.test.ts`

**Interfaces:**
- Consumes: CSS module class keys from Task 1 (`table.module.scss`, imported directly by this file — not passed as a parameter).
- Produces: `getTableClassName`, `getCellClassName`, `getInputClassName` — consumed by Task 3's call sites in `create-table-template.tsx` and `table-solution.tsx`.

```ts
type TableMode = 'input' | 'solution'

function getTableClassName(params: {
  id: string
  mode: TableMode
  removeBorders?: boolean
  removePadding?: boolean
}): string

function getCellClassName(params: {
  id: string
  mode: TableMode
  isInput: boolean
  isFirstCell: boolean
  isLastCell: boolean
  isHeaderRow: boolean
  isLastRow: boolean
}): string

function getInputClassName(params: {
  id: string
  mode: TableMode
}): string
```

- [ ] **Step 1: Write the failing tests**

Create `get-table-classnames.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import clsx from 'clsx'

import {
  getCellClassName,
  getInputClassName,
  getTableClassName,
} from './get-table-classnames'
import styles from '../shared/table.module.scss'

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
    ).toBe(clsx(styles.table, styles.tableRemoveBorders, styles.equationStretch))
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
      expect(
        getCellClassName({ ...base, id, isLastRow: true }),
      ).toBe(clsx(styles.cell, styles.cellNoBottomBorder))
    }
  })

  it('grid/multiRow/multiRowSvg first column, non-input: label styling', () => {
    for (const id of ['table.grid', 'table.multiRow', 'table.multiRowSvg']) {
      expect(
        getCellClassName({ ...base, id, isFirstCell: true }),
      ).toBe(clsx(styles.cell, styles.cellFirstColLabel))
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
    expect(getCellClassName({ ...base, id: 'table.inline', mode: 'solution' })).toBe(
      clsx(styles.cell, styles.cellInlineSolution),
    )
    expect(getCellClassName({ ...base, id: 'table.inline', mode: 'input' })).toBe(
      clsx(styles.cell, styles.cellInlineInput),
    )
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
    expect(getCellClassName({ ...base, id: 'table.mixed', mode: 'solution' })).toBe(
      clsx(styles.cell, styles.cellMixedSolution),
    )
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
    expect(getCellClassName({ ...base, id: 'table.mixed', mode: 'input' })).toBe(
      clsx(styles.cell, styles.cellMixedInput),
    )
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
    for (const id of ['table.plain', 'table.grid', 'table.multiRow', 'table.multiRowSvg']) {
      expect(getCellClassName({ ...base, id, isInput: true })).toContain(
        styles.inputCellDefaultWidth,
      )
    }
    for (const id of ['table.inline', 'table.list', 'table.mixed']) {
      expect(getCellClassName({ ...base, id, mode: 'input', isInput: true })).not.toContain(
        styles.inputCellDefaultWidth,
      )
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:unit -- get-table-classnames -t ""` (or `npx vitest run --project=unit src/modules/tasks/ui/templates/table/lib/get-table-classnames.test.ts`)
Expected: FAIL — `get-table-classnames.ts` doesn't exist yet (module not found).

- [ ] **Step 3: Implement the helper**

Create `get-table-classnames.ts`:

```ts
import clsx from 'clsx'

import styles from '../shared/table.module.scss'

export type TableMode = 'input' | 'solution'

const ROUNDED_IDS = new Set(['table.grid', 'table.multiRow', 'table.multiRowSvg'])
const LABEL_COLUMN_IDS = ROUNDED_IDS
const INPUT_WIDTH_AUTO_IDS = new Set(['table.mixed', 'table.list', 'table.plain'])
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
    id === 'table.plain' && removeBorders && styles.equationStretch,
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

export function getInputClassName(params: { id: string; mode: TableMode }): string {
  const { id, mode } = params

  return clsx(
    styles.input,
    mode === 'solution' && INPUT_WIDTH_AUTO_IDS.has(id) && styles.inputWidthAuto,
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run --project=unit src/modules/tasks/ui/templates/table/lib/get-table-classnames.test.ts`
Expected: PASS, all cases green.

- [ ] **Step 5: Commit**

```bash
git add src/modules/tasks/ui/templates/table/lib/get-table-classnames.ts src/modules/tasks/ui/templates/table/lib/get-table-classnames.test.ts
git commit -m "feat(table): add getTableClassName/getCellClassName/getInputClassName helpers"
```

---

### Task 3: Wire the helper into both render components, delete dead CSS

**Files:**
- Modify: `src/modules/tasks/ui/templates/table/lib/create-table-template.tsx:81-134` (table `clsx`, cell `clsx`, `MathInput`'s `className`)
- Modify: `src/modules/tasks/ui/templates/table/shared/table-solution.tsx:76-118` (table `clsx`, cell `clsx`, `MathText`'s `className`)
- Modify: `src/modules/tasks/ui/templates/table/shared/table.module.scss` (delete the now-dead attribute-selector rules — lines 89–110, 112–315 in the pre-Task-1 version: everything from the `// table.grid / table.multiRow / table.multiRowSvg — скруглённая рамка` comment through the end of the `table.plain solution` block, i.e. every rule keyed off `[data-template-id=...]`)

**Interfaces:**
- Consumes: `getTableClassName`, `getCellClassName`, `getInputClassName` from Task 2's `get-table-classnames.ts`.

- [ ] **Step 1: Update create-table-template.tsx**

Add the import:
```ts
import { getCellClassName, getInputClassName, getTableClassName } from './get-table-classnames'
```

Replace the `<table>`'s `className`:
```tsx
className={getTableClassName({
  id,
  mode: 'input',
  removeBorders: table.removeBorders,
  removePadding: table.removePadding,
})}
```

Inside `row.cells.map()`, before the `return (<td ...>`, compute:
```ts
const isHeaderRow =
  id === 'table.grid'
    ? rowIndex < table.rows.length - 1
    : id === 'table.multiRow' || id === 'table.multiRowSvg'
      ? rowIndex === 0
      : false
```

Replace the `<td>`'s `className`:
```tsx
className={getCellClassName({
  id,
  mode: 'input',
  isInput,
  isFirstCell: cellIndex === 0,
  isLastCell: cellIndex === row.cells.length - 1,
  isHeaderRow,
  isLastRow: rowIndex === table.rows.length - 1,
})}
```

Replace `MathInput`'s `className={styles.input}` with:
```tsx
className={getInputClassName({ id, mode: 'input' })}
```

- [ ] **Step 2: Update table-solution.tsx**

Same shape, using `templateId` (this file's prop name for what `create-table-template.tsx` calls `id`) and `mode: 'solution'`. Add the import, replace the `<table>`'s `className`:
```tsx
className={getTableClassName({
  id: templateId ?? 'table.plain',
  mode: 'solution',
  removeBorders: table.removeBorders,
  removePadding: table.removePadding,
})}
```

Inside `row.cells.map()`:
```ts
const isHeaderRow =
  templateId === 'table.grid'
    ? rowIndex < table.rows.length - 1
    : templateId === 'table.multiRow' || templateId === 'table.multiRowSvg'
      ? rowIndex === 0
      : false
```
```tsx
className={getCellClassName({
  id: templateId ?? 'table.plain',
  mode: 'solution',
  isInput,
  isFirstCell: cellIndex === 0,
  isLastCell: cellIndex === row.cells.length - 1,
  isHeaderRow,
  isLastRow: rowIndex === table.rows.length - 1,
})}
```

Replace `MathText`'s `className={styles.input}` with:
```tsx
className={getInputClassName({ id: templateId ?? 'table.plain', mode: 'solution' })}
```

(`templateId` is optional in `Props` — `table-solution.tsx:25`; `create-table-template.tsx` always passes it via `templateId={id}` at its one call site, so the `?? 'table.plain'` fallback only matters for direct/test usage without a `templateId`, matching the existing `data-template-id={templateId}` behavior which would render `undefined` today.)

- [ ] **Step 3: Delete the dead attribute-selector rules from table.module.scss**

Delete two regions, now both fully superseded by Task 1's classes + Task 3 Steps 1-2's call sites:

1. The `.container:not([data-template-id='table.inline'],[data-template-id='table.list'],[data-template-id='table.mixed']) .inputCell { width: 1%; }` rule (original lines 37-44) — replaced by `inputCellDefaultWidth`, now applied directly in `getCellClassName`.
2. Every rule block keyed off `[data-template-id=...]` from the `// table.grid / table.multiRow / table.multiRowSvg — скруглённая рамка` comment down through the end of the `.container[data-template-id='table.plain'][data-mode='solution']` block, immediately before `.htmlCell`.

Keep everything else as-is: `.container`, `.tableWrapper`, `.table`, `.cell`, `.inputCell`, `.input`, `.table.tableRemovePadding`, `.table.equationStretch .inputCell`, `.table.tableRemoveBorders`, `.htmlCell`, and all of Task 1's additions — none of those are `data-template-id`/`data-mode`-scoped.

- [ ] **Step 4: Run unit tests**

Run: `npx vitest run --project=unit src/modules/tasks/ui/templates/table`
Expected: PASS — existing per-variant tests (`table-grid.test.tsx`, `table-plain.test.tsx`, etc.) assert on rendered structure/testids, not classNames, so they should be unaffected.

- [ ] **Step 5: Run the full table visual regression suite**

Run: `npm run storybook -- --ci &` then `npm run test:visual -- --grep table`
Expected: PASS with zero diffs across every table variant/mode snapshot. Any diff here means a case from the mapping table was translated incorrectly — check it against `docs/superpowers/specs/2026-08-19-table-cell-classname-styling-design.md`'s mapping table before adjusting.

- [ ] **Step 6: Manually verify in Storybook**

Open `http://localhost:6006` and check each of `Templates/Table/{grid,plain,inline,list,mixed,multi-row,multi-row-svg}` in both default (input) and solution modes. Confirm no visual difference from before this task.

- [ ] **Step 7: Commit**

```bash
git add src/modules/tasks/ui/templates/table
git commit -m "refactor(table): replace data-template-id/data-mode CSS selectors with computed classNames"
```

---

## Self-Review Notes

- **Spec coverage:** Every row of the spec's mapping table (as corrected — including `.inputCell`-specific rules for inline/list, and the shared `.inputWidthAuto` for mixed/list/plain solution mode) has a corresponding branch in Task 2's `getTableClassName`/`getCellClassName`/`getInputClassName` and a matching unit test.
- **Type consistency:** `TableMode`, `getTableClassName`, `getCellClassName`, `getInputClassName` signatures match exactly between the spec, Task 2's implementation, and Task 3's call sites.
- **Placeholder scan:** none — every step has literal code, not descriptions.
