# Table styling: className-based modifiers instead of data-template-id/data-mode selectors

## Context

Debugging a "table has no styles on the dev server" report traced back to a build pipeline issue (fixed separately: `cssCodeSplit: false` in `new-task-modal/vite.config.ts`, plus the cell padding value switched to the `--space-8` design token). While comparing Storybook vs. the live dev server in DevTools, a second, structural problem surfaced: several cell rules in `table.module.scss` are scoped via `[data-template-id='table.grid'] tr:not(:last-child) .cell`-style selectors, keyed off an attribute set on a *distant ancestor* (`.container`), not the cell itself. When inspecting a `<td>` in DevTools, non-matching variants of these rules don't appear at all — there's no visual trace that they exist or why they don't apply, which cost significant time distinguishing "genuinely broken" from "correctly not matching this table variant."

This spec replaces every `data-template-id`/`data-mode` attribute selector in `table.module.scss` with modifier classNames computed in JS and applied directly to the element being styled (`<table>` or `<td>`). A className is always visible in the inspected element's own class list — no ancestor-chain reasoning required to understand why a rule does or doesn't apply.

## Current state

Two React components render near-identical table markup and both read `table.module.scss`:
- `src/modules/tasks/ui/templates/table/lib/create-table-template.tsx` — input/editable rendering, always `data-mode="input"`.
- `src/modules/tasks/ui/templates/table/shared/table-solution.tsx` — solution/read-only rendering, always `data-mode="solution"`.

Both set `data-template-id={id}` (one of `table.plain` / `table.grid` / `table.inline` / `table.list` / `table.mixed` / `table.multiRow` / `table.multiRowSvg`) on the outer `.container`, and both build each `<td>`'s className as `clsx(styles.cell, isInput && styles.inputCell)` with no variant-specific classes — variant styling for `.cell` currently happens entirely in CSS via attribute + structural selectors (`tr:first-child`, `tr:not(:last-child)`, `tr:last-child`, `:first-child:not(.inputCell)`, `:last-child`).

Key simplifying fact: `data-mode` is never actually dynamic within a given file — `create-table-template.tsx` always renders `"input"`, `table-solution.tsx` always renders `"solution"`. Every `[data-template-id='X'][data-mode='Y']` selector in the stylesheet can therefore become a plain JS conditional in whichever file is rendering, with the position-dependent parts (`isHeaderRow`, `isFirstCell`, `isLastCell`, `isLastRow`) computed from data already available in the existing `row.cells.map()` loop (`rowIndex`, `cellIndex`, `table.rows.length`, `row.cells.length`).

## Approach

Extract a shared, pure helper module — `getTableClassName` and `getCellClassName` — used by both render files, rather than duplicating the modifier-class logic inline in each (which would re-create the exact kind of drift risk the two files already have for cell markup). Both functions are plain string-in/string-out, no React or DOM dependency, so each variant×mode combination is independently unit-testable against the mapping table below.

## Selector → modifier class mapping

New file: `src/modules/tasks/ui/templates/table/lib/get-table-classnames.ts`. Imports `table.module.scss` itself.

| Current selector (table.module.scss) | Replacement |
|---|---|
| `.container[data-template-id='table.grid'\|'table.multiRow'\|'table.multiRowSvg'] .table` (border-radius/overflow) | `.tableRounded` on `<table>` |
| `.container[data-template-id='table.inline'][data-mode='input'] .table,.tbody,.tr` (flex) | `.tableFlexInlineInput` on `<table>` |
| `.container[data-template-id='table.mixed'][data-mode='solution'\|'input'] .table,.tbody,.tr` | `.tableFlexMixedSolution` / `.tableFlexMixedInput` on `<table>` |
| `.container[data-template-id='table.list'][data-mode='solution'\|'input'] .table,.tbody,.tr` | `.tableFlexListSolution` / `.tableFlexListInput` on `<table>` |
| `.container[data-template-id='table.multiRow'\|'table.multiRowSvg'] tr:first-child .cell` | `.cellHeader` on `<td>`s where `rowIndex === 0` |
| `.container[data-template-id='table.grid'] tr:not(:last-child) .cell` | `.cellHeader` on `<td>`s where `rowIndex < rows.length - 1` |
| `.container[...grid\|multiRow\|multiRowSvg] tr:last-child .cell` (no bottom border) | `.cellNoBottomBorder` on `<td>`s where `rowIndex === rows.length - 1` |
| `.container[...grid\|multiRow\|multiRowSvg] .cell:first-child:not(.inputCell)` | `.cellFirstColLabel` on `<td>`s where `cellIndex === 0 && !isInput` |
| `.container[data-template-id='table.inline'][data-mode='solution'\|'input'] .cell` | `.cellInlineSolution` / `.cellInlineInput` |
| `.container[data-template-id='table.inline'][data-mode='input'] .inputCell` | `.inputCellInlineInput` |
| `.container[data-template-id='table.mixed'][data-mode='solution'\|'input'] .cell,.inputCell` | `.cellMixedSolution` (applies identically to `.cell` and `.inputCell` — same declarations for both in the original) / `.cellMixedInput` (applies to plain `.cell` only; `.inputCell` gets `.inputCell.cellMixedInput` as a compound rule overriding flex/width/padding, matching the original's separate `.inputCell` block) |
| `.container[data-template-id='table.mixed'][data-mode='solution'] .input` | `.inputWidthAuto` (see below) |
| `.container[data-template-id='table.list'][data-mode='solution'\|'input'] .cell:last-child` | `.cellListLastSolution` / `.cellListLastInput` on `<td>`s where `cellIndex === row.cells.length - 1` |
| `.container[data-template-id='table.list'][data-mode='input'] .inputCell` | `.inputCellListInput` |
| `.container[data-template-id='table.list'][data-mode='solution'] .inputCell` | `.inputCellListSolution` |
| `.container[data-template-id='table.list'][data-mode='solution'] .input` | `.inputWidthAuto` |
| `.container[data-template-id='table.plain'][data-mode='solution'] .inputCell` | `.inputCellPlainSolution` |
| `.container[data-template-id='table.plain'][data-mode='solution'] .input` | `.inputWidthAuto` |
| `.container:not([data-template-id='table.inline'],[data-template-id='table.list'],[data-template-id='table.mixed']) .inputCell` (base `width: 1%` for input cells outside the three flex-sized variants) | `.inputCellDefaultWidth`, applied whenever `isInput && id` is not inline/list/mixed. Mutually exclusive with the inline/list/mixed input-cell width rules by construction (never both applied to the same cell), so there's no specificity tie to manage between them. |

`.inputWidthAuto` is one shared modifier (`width: auto`) — it's the same single declaration in all three places it appears (`table.mixed`/`table.list`/`table.plain`, solution mode only), so one class covers all three instead of three identically-bodied classes. Applied to the `<MathText>`'s `className` prop (currently always `styles.input`) via a third helper, `getInputClassName`, since the `.input` element is neither the `<table>` nor the `<td>`.

`.tableRemoveBorders` / `.tableRemovePadding` / `.equationStretch` are already class-based (driven by `table.removeBorders`/`table.removePadding` props) and are unchanged, just folded into `getTableClassName`'s output alongside the new modifiers.

## Function signatures

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
// clsx(styles.input, mode === 'solution' && (id === 'table.mixed' || id === 'table.list' || id === 'table.plain') && styles.inputWidthAuto)
```

`isHeaderRow` is computed by the caller before invoking `getCellClassName` (it depends on `id` and row position together):
```ts
const isHeaderRow =
  id === 'table.grid' ? rowIndex < table.rows.length - 1
  : id === 'table.multiRow' || id === 'table.multiRowSvg' ? rowIndex === 0
  : false
```

## Call-site changes

In both `create-table-template.tsx` and `table-solution.tsx`:
- The `<table>`'s `clsx(...)` block is replaced by `getTableClassName({ id, mode, removeBorders: table.removeBorders, removePadding: table.removePadding })`.
- Inside `row.cells.map()`, the `<td>`'s `clsx(styles.cell, isInput && styles.inputCell)` is replaced by `getCellClassName({ id, mode, isInput, isFirstCell: cellIndex === 0, isLastCell: cellIndex === row.cells.length - 1, isHeaderRow, isLastRow: rowIndex === table.rows.length - 1 })`.
- The `<MathInput>`/`<MathText>` child's `className={styles.input}` is replaced by `getInputClassName({ id, mode })`.
- `mode` is the literal `'input'` in `create-table-template.tsx` and `'solution'` in `table-solution.tsx`.
- `data-template-id`/`data-mode` attributes on `.container` are left in place (harmless, may still be useful for QA/analytics/e2e selectors) — only their role as CSS selector hooks goes away.

## Testing

- Unit tests for `getTableClassName`/`getCellClassName` covering each row of the mapping table above (one case per variant×mode combination), asserting the exact expected class list.
- Manual/Storybook verification: every `Templates/Table/*` story (`grid`, `plain`, `inline`, `list`, `mixed`, `multiRow`, `multiRowSvg`) in both input and solution modes, confirming visual parity with the current (pre-refactor) rendering — this is a pure refactor, no visual change is intended.

## Out of scope

- No change to `render-table-cell-content.tsx`, `TableStaticCellContent`, or any non-table-styling logic.
- No change to the `cssCodeSplit`/build pipeline fix from the earlier debugging session.
- `data-template-id`/`data-mode` attributes are not removed from the DOM, only from the stylesheet's selector logic — removing them entirely is a separate decision (they may be used elsewhere, e.g. e2e tests) and wasn't asked for.
