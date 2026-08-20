# `complex.after.equation`

Complex table equation (`isAnswerCellHidden` + `answercell`) + `answerInput.after`.

## Когда выбирать

- Непустой `answerInput.after`, пустой `before`
- `description.isAnswerCellHidden === true`
- В `parts` есть Table (`type: 120`) с `answercell`

Пример: группа **complex_5** (перевод единиц: `4 дм³ = [input] см³`).

## UI

- `TaskTitle`
- `ComplexDescription` с equation layout (центрирование, input 120–200px)
- Нижний MathInput скрыт; ответ вводится в ячейке таблицы
