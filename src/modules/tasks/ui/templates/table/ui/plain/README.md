# `table.plain`

Таблица с динамическим числом `answercell` → `MathInput`.

## Когда выбирать

Ровно 1 строка (`description.table.rows.length === 1`) с ровно 1
`answercell`. Покрывает structural groups `table_1, table_2, table_3,
table_4, table_5, table_6, table_8`.

См. [`../../lib/classify-table-template.ts`](../../lib/classify-table-template.ts)
для полного правила и остальных 6 шаблонов (`grid`, `inline`, `list`,
`mixed`, `multiRow`, `multiRowSvg`).

## UI

- `TaskTitle` (optional)
- `TaskDescription`
- HTML `<table>`: static cells → `MathText`, `'answercell'` → `MathInput`
