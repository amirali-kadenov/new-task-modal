# `text.after`

Один `MathInput` + подпись-суффикс справа (единица измерения: «км», «тг», …).

## Когда выбирать

`answerInput.type: 10`, `after` непустой (строка или Translation), `before` пустой.

## UI

- `TaskTitle` (если есть)
- `TaskDescription` (с `normalizeBareMath: true` — bare `см^2` → `\(...\)`)
- ряд: `MathInput` + `MathText` с переведённым `after` (тоже нормализуется)

## Контракт данных

См. [data/task.json](data/task.json). `after` бывает и строкой, и Translation —
переводится через `translateTasks`. Флаг `normalizeBareMath` включён только здесь
(text_6 и подобные CMS без TeX-делимитеров).

## Не покрывает

- пустой `after` → `text.plain`
- непустой `before` → `text.before` / `text.beforeAfter`
- `input1..N` → `text.multi.*`

## Stories

[text-after.stories.tsx](text-after.stories.tsx): `Default`, `WithSolution` (Controls:
`group` + `taskId`). Каталог — `Groups` / `Tasks`.

## Тесты

[text-after.test.tsx](text-after.test.tsx): classify → `text.after`; рендер — один input,
суффикс с текстом `after` есть, префикса нет.

Unit мокает MathJax, поэтому шрифт формул проверяет только `pnpm test:interactions`:
`Groups / All` гоняет DOM-инварианты (в т.ч. text_6: `см`/`мм` upright и в том же
шрифте, что остальные глифы — см. FAQ про `mjx-utext`).
