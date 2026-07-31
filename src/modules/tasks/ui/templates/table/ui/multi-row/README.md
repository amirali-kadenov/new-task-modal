# `table.multiRow`

Заголовочная строка + несколько строк данных, в каждой ровно 1
`answercell` (позиция может отличаться от строки к строке).

## Когда выбирать

`description.table.rows.length > 1`; первая строка без `answercell`
(заголовок); каждая следующая строка содержит ровно 1 `answercell`; ни в
одной ячейке нет `<svg>` (иначе — `table.multiRowSvg`). Покрывает
structural group `table_15` (урожайность культур).

См. [`../../lib/classify-table-template.ts`](../../lib/classify-table-template.ts).

## UI

Как `table.plain`. `answercell` узкие (`width: 1%`) на любой позиции в
строке, включая последнюю ячейку.
