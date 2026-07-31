# `text.multi.stack.n5.after`

Пять `MathInput` столбиком, у каждого подпись-суффикс справа
(разряды числа: «десятков тысяч», «тысяч», …).

## Когда выбирать

`answerInput` с `input1..input5`; `inline` falsy; непустые `after`, `before` пустые.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- пять строк: `MathInput` + `after`-подпись
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_1_8`).

## Не покрывает

- `inline: true` → `text.multi.inline.n5.after`
- меньше input → `…n2.after` / `…n4.after`

## Stories

[text-multi-stack-n5-after.stories.tsx](text-multi-stack-n5-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-stack-n5-after.test.tsx](text-multi-stack-n5-after.test.tsx): classify → id; рендер — 5 input с суффиксами.
