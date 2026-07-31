# `text.multi.stack.n2.after`

Два `MathInput` столбиком, у каждого подпись-суффикс справа.

## Когда выбирать

`answerInput` с `input1`, `input2`; `inline` falsy; непустые `after`, `before` пустые.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- две строки: `MathInput` + `after`-подпись
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_9_13_8`).

## Не покрывает

- `inline: true` → `text.multi.inline.*`
- непустые `before` → `…n2.before` / `…n2.beforeAfter`
- другое число input → `…n4.after` / `…n5.after`

## Stories

[text-multi-stack-n2-after.stories.tsx](text-multi-stack-n2-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-stack-n2-after.test.tsx](text-multi-stack-n2-after.test.tsx): classify → id; рендер — 2 input с суффиксами.
