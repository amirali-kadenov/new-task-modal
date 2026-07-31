# `text.multi.inline.n5.after`

Пять `MathInput` в одну строку, у каждого подпись-суффикс справа
(разложение числа по разрядам в строку).

## Когда выбирать

`answerInput` с `input1..input5`; `inline: true`; непустые `after`, `before` пустые.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- одна строка из пяти групп: `MathInput` + суффикс
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_1_10`).

## Не покрывает

- `inline` falsy → `text.multi.stack.n5.after`
- меньше input → `…inline.n2.after`

## Stories

[text-multi-inline-n5-after.stories.tsx](text-multi-inline-n5-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-inline-n5-after.test.tsx](text-multi-inline-n5-after.test.tsx): classify → id; рендер — 5 input в inline-контейнере, суффиксы есть.
