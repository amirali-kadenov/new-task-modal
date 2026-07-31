# `text.multi.inline.n2.after`

Два `MathInput` в одну строку, у каждого подпись-суффикс справа.

## Когда выбирать

`answerInput` с `input1`, `input2`; `inline: true`; непустые `after`, `before` пустые.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- одна строка: `MathInput`+суффикс, `MathInput`+суффикс
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_10_7_11`).

## Не покрывает

- `inline` falsy → `text.multi.stack.n2.after`
- непустые `before` → inline-`beforeAfter`

## Stories

[text-multi-inline-n2-after.stories.tsx](text-multi-inline-n2-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-inline-n2-after.test.tsx](text-multi-inline-n2-after.test.tsx): classify → id; рендер — 2 input в inline-контейнере, суффиксы есть.
