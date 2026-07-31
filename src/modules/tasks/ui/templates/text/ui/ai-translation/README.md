# `text.aiTranslation`

Редкий кейс: весь `answerInput` — Translation (подпись единицы: «руб», «тг»),
а не type-10 объект. Рендерится как один input с этой подписью-суффиксом.

## Когда выбирать

`answerInput` — объект с `module_name` (Translation), без `type: 10` и без `input1..N`.

## UI

- `TaskTitle` (если есть)
- `TaskDescription`
- ряд: `MathInput` + `MathText` с переведённым `answerInput`

Старый шаблон эту подпись терял (читал только `answerInput.after`) — здесь она показывается.

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_12_17_1`).

## Не покрывает

- `answerInput.type: 10` → simple-шаблоны
- `input1..N` → `text.multi.*`

## Stories

[text-ai-translation.stories.tsx](text-ai-translation.stories.tsx): `Default`, `WithSolution`, `AllGroups`
(все structural groups из [data/groups.json](data/groups.json)).

## Тесты

[text-ai-translation.test.tsx](text-ai-translation.test.tsx): classify → `text.aiTranslation`; рендер — один input,
суффикс с текстом единицы.
