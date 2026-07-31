# `table.list`

Несколько строк, в каждой ровно 2 ячейки: `answercell` + статичная подпись.

## Когда выбирать

`description.table.rows.length > 1` и каждая строка — `[answercell,
label]`. Покрывает structural group `table_13` (разрядный состав числа).

См. [`../../lib/classify-table-template.ts`](../../lib/classify-table-template.ts).

## UI

Как `table.plain`, но со списком из N строк. `answercell` в каждой строке
первая ячейка — узкая (`width: 1%`) и не растягивается.
