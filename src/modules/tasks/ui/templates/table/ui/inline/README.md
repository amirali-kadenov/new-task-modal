# `table.inline`

Одна строка, 2+ `answercell`, вперемешку со статичным текстом (например,
единицами измерения).

## Когда выбирать

`description.table.rows.length === 1` и в этой строке 2+ `answercell`.
Покрывает structural group `table_9`.

См. [`../../lib/classify-table-template.ts`](../../lib/classify-table-template.ts).

## UI

Как `table.plain`, но с несколькими `answercell` в одной строке. Каждый
`answercell` узкий (`width: 1%`) — не растягивается за счёт соседних
статичных ячеек.
