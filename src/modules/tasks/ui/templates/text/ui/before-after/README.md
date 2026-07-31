# `text.beforeAfter`

Один `MathInput` с подписями с обеих сторон.

## Когда выбирать

`answerInput.type: 10`, непустые и `before`, и `after`.

## UI

- `TaskTitle` (если есть)
- `TaskDescription`
- ряд: префикс + `MathInput` + суффикс

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_10_1_3`).

## Не покрывает

- только одна подпись → `text.before` / `text.after`
- `input1..N` → `text.multi.*`

## Особая роль

Fallback для неизвестных simple-форм `answerInput` (см. [../../lib/registry.ts](../../lib/registry.ts)):
рендерит те подписи, которые реально есть в данных.

## Stories

[text-before-after.stories.tsx](text-before-after.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-before-after.test.tsx](text-before-after.test.tsx): classify → `text.beforeAfter`; рендер — один input,
есть и префикс, и суффикс.
