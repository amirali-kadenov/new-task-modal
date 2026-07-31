# `table.grid`

Заголовочные строки + одна строка данных с `answercell`.

## Когда выбирать

`description.table.rows.length > 1`; все строки, кроме последней, не содержат
`answercell` (заголовки); последняя строка содержит 1+ `answercell`.
Покрывает structural groups `table_7, table_10, table_12`.

См. [`../../lib/classify-table-template.ts`](../../lib/classify-table-template.ts).

## UI

Как `table.plain`: `TaskTitle` (optional) + `TaskDescription` + HTML
`<table>`. Заголовочные ячейки могут иметь `colspan`/`rowspan`.
`answercell` в последней строке всегда узкие (`width: 1%`) и
центрированные — не растягиваются даже когда идут подряд (`table_10`,
`table_12` — 3 `answercell` в ряд).
