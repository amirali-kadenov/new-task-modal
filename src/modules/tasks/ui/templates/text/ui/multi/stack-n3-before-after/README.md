# `text.multi.stack.n3.beforeAfter`

Три `MathInput` столбиком, подписи и слева, и справа.

## Когда выбирать

`answerInput` с `input1..input3`; `inline` falsy; среди input есть
непустые и `before`, и `after`.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- три строки: префикс + `MathInput` + суффикс
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_3_12_10`).

## Не покрывает

- 2 input → `…n2.beforeAfter`
- только `before` → `…n3.before`
- `inline: true` → `text.multi.inline.n3.beforeAfter`

## Stories

[text-multi-stack-n3-before-after.stories.tsx](text-multi-stack-n3-before-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-stack-n3-before-after.test.tsx](text-multi-stack-n3-before-after.test.tsx): classify → id; рендер — 3 input, есть префиксы и суффиксы.
