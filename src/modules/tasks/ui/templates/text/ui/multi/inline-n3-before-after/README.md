# `text.multi.inline.n3.beforeAfter`

Три `MathInput` в одну строку, подписи и слева, и справа.

## Когда выбирать

`answerInput` с `input1..input3`; `inline: true`; среди input есть
непустые и `before`, и `after`.

## UI

- `TaskTitle` (если есть) + `TaskDescription`
- одна строка из трёх групп: префикс + `MathInput` + суффикс
- общий ответ — значения через `multipleTaskAnswerSeparator`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_10_9_14`).

## Особая роль

Fallback для неизвестных inline-multi форм (см. [../../../lib/registry.ts](../../../lib/registry.ts)).

## Не покрывает

- `inline` falsy → `text.multi.stack.n3.beforeAfter`
- только `after` → `…inline.n2.after` / `…inline.n5.after`

## Stories

[text-multi-inline-n3-before-after.stories.tsx](text-multi-inline-n3-before-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-multi-inline-n3-before-after.test.tsx](text-multi-inline-n3-before-after.test.tsx): classify → id; рендер — 3 input в inline-контейнере.
