# `text.multi.stack.n2.before`

Два `MathInput` столбиком, у каждого подпись-префикс слева.

## Когда выбирать

`answerInput` с `input1`, `input2`; `inline` falsy; хотя бы у одного input
непустой `before`, `after` пустые у всех.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- две строки: `before`-подпись + `MathInput`
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_3_12_11`).

## Не покрывает

- `inline: true` → `text.multi.inline.*`
- непустые `after` → `…n2.after` / `…n2.beforeAfter`
- другое число input → `…n3.before` и т.д.

## Stories

[text-multi-stack-n2-before.stories.tsx](text-multi-stack-n2-before.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-stack-n2-before.test.tsx](text-multi-stack-n2-before.test.tsx): classify → id; рендер — 2 input, у каждой строки префикс.
