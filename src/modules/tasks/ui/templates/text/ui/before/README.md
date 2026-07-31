# `text.before`

Один `MathInput` + подпись-префикс слева (например, начало равенства).

## Когда выбирать

`answerInput.type: 10`, `before` непустой, `after` пустой.

## UI

- `TaskTitle` (если есть)
- `TaskDescription`
- ряд: `MathText` с переведённым `before` + `MathInput`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_12_7_1`, `before: Translation`).

## Не покрывает

- пустой `before` → `text.plain`
- непустой `after` → `text.after` / `text.beforeAfter`
- `input1..N` → `text.multi.*`

## Stories

[text-before.stories.tsx](text-before.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-before.test.tsx](text-before.test.tsx): classify → `text.before`; рендер — один input,
префикс есть, суффикса нет.
