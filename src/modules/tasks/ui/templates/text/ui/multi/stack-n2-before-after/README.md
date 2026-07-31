# `text.multi.stack.n2.beforeAfter`

Два `MathInput` столбиком, подписи и слева, и справа.

## Когда выбирать

`answerInput` с `input1`, `input2`; `inline` falsy; среди input есть
непустые и `before`, и `after`.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- две строки: префикс + `MathInput` + суффикс
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_6_7_11`).

## Особая роль

Fallback для неизвестных stack-multi форм (см. [../../../lib/registry.ts](../../../lib/registry.ts)):
рендер идёт по фактическим данным, лишние подписи не появляются.

## Не покрывает

- `inline: true` → `text.multi.inline.n3.beforeAfter`
- одна сторона подписей → `…n2.before` / `…n2.after`

## Stories

[text-multi-stack-n2-before-after.stories.tsx](text-multi-stack-n2-before-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-stack-n2-before-after.test.tsx](text-multi-stack-n2-before-after.test.tsx): classify → id; рендер — 2 input, есть префиксы и суффиксы.
