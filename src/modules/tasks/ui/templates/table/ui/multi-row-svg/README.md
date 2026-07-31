# `table.multiRowSvg`

Как `table.multiRow` (заголовок + строки данных с 1 `answercell` каждая),
но со SVG-иллюстрацией в одной из статичных ячеек каждой строки.

## Когда выбирать

То же правило, что у `table.multiRow`, плюс хотя бы одна ячейка содержит
`<svg`. Покрывает structural group `table_14` (велосипедные колёса:
радиус/диаметр).

См. [`../../lib/classify-table-template.ts`](../../lib/classify-table-template.ts).

## UI

Ячейка со SVG рендерится через `TableStaticCellContent` как HTML
(`dangerouslySetInnerHTML`), а не через `MathText` — см.
[`../../lib/render-table-cell-content.tsx`](../../lib/render-table-cell-content.tsx).
