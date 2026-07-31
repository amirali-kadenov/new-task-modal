# `text.multi.stack.n3.before`

Три `MathInput` столбиком, у каждого подпись-префикс слева.

## Когда выбирать

`answerInput` с `input1..input3`; `inline` falsy; непустые `before`, `after` пустые.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- три строки: `before`-подпись + `MathInput`
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_10_14_8`).

## Не покрывает

- 2 input → `…n2.before`
- непустые `after` → `…n3.beforeAfter`
- `inline: true` → `text.multi.inline.*`

## Stories

[text-multi-stack-n3-before.stories.tsx](text-multi-stack-n3-before.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-stack-n3-before.test.tsx](text-multi-stack-n3-before.test.tsx): classify → id; рендер — 3 input с префиксами.
