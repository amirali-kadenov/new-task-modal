# `text.multi.stack.n4.after`

Четыре `MathInput` столбиком, у каждого подпись-суффикс справа.

## Когда выбирать

`answerInput` с `input1..input4`; `inline` falsy; непустые `after`, `before` пустые.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- четыре строки: `MathInput` + `after`-подпись
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_6_12_12`).

## Не покрывает

- другое число input → `…n2.after` / `…n5.after`
- `inline: true` → `text.multi.inline.*`

## Stories

[text-multi-stack-n4-after.stories.tsx](text-multi-stack-n4-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-stack-n4-after.test.tsx](text-multi-stack-n4-after.test.tsx): classify → id; рендер — 4 input с суффиксами.
