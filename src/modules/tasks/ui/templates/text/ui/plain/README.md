# `text.plain`

Базовый text-шаблон: описание + один `MathInput` без подписей.

## Когда выбирать

`answerInput.type: 10`, `before` и `after` пустые (строка или пустой Translation).

## UI

- `TaskTitle` (если у задачи есть title)
- `TaskDescription` (интерполяция `fields` внутри)
- один `MathInput`

## Контракт данных

См. [data/task.json](data/task.json) (`Elixir.Task_4_1_1`).
Типы: `SimpleTextAnswerInput` в [../../lib/types.task.ts](../../lib/types.task.ts).

## Не покрывает

- непустой `before`/`after` → `text.before` / `text.after` / `text.beforeAfter`
- `answerInput` = Translation → `text.aiTranslation`
- `input1..N` → `text.multi.*`

## Stories

[text-plain.stories.tsx](text-plain.stories.tsx): `Default`, `WithSolution` (Controls:
`group` + `taskId`). Каталог — `Groups` / `Tasks`. MathJax-инварианты
(text_16 / text_18 / text_61 и др.) — в `play` у `Groups / All`.

## Тесты

Слои разные — не путать:

| Команда | Что проверяет |
|---------|----------------|
| `pnpm test:unit` | Структура React + **строки** при **моке** MathText/MathFormula (шрифт/курсив/`mjx-merror` не видны) |
| `pnpm test:interactions` | Реальный MathJax в Chromium: нет `mjx-merror`, нет сырых `\(`/`\)`, единицы upright (`Groups / All`) |

[text-plain.test.tsx](text-plain.test.tsx): classify → `text.plain`; один input; solution-ветка;
разметка ответа `joinMathAnswers` для MathText.
