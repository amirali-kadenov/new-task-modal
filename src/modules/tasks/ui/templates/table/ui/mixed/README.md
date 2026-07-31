# `table.mixed`

Разнородные строки: разное число ячеек и `answercell` в каждой строке
(включая строку без единого `answercell`, которая не является заголовком).

## Когда выбирать

Остаточная категория: `description.table.rows.length > 1`, но строки не
подходят ни под `table.list` (не у всех строк 2 ячейки с `answercell`
первой), ни под `table.grid` (answercell есть не только в последней
строке), ни под `table.multiRow`/`table.multiRowSvg` (первая строка не
чисто заголовочная). Покрывает structural group `table_11`
(текстовая задача: `v =`, `t =`, `A = ?`, `A = ... · ... = ...`).

См. [`../../lib/classify-table-template.ts`](../../lib/classify-table-template.ts).

## UI

Как `table.plain` — без изменений в разметке, каждая строка рендерится как
есть. Все `answercell` узкие (`width: 1%`) независимо от позиции в строке.
