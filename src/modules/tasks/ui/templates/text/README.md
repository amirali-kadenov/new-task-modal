# Text-шаблоны

Каталог UI-шаблонов для задач `description.type === 'text'`.

Правило: **одна UI-структура = один шаблон** (папка + README + тест + пример payload).
Шаблон определяется формой `answerInput`, а не structural group (`text_1` … `text_81`).

## Как выбирается шаблон

`text.tsx` (диспетчер, вход из `TEMPLATE_MAP`) → [`lib/classify-text-template.ts`](lib/classify-text-template.ts)
строит `templateId` по форме `answerInput` → [`lib/registry.ts`](lib/registry.ts) лениво грузит компонент.
Неизвестный id (новая форма данных) падает в безопасный fallback (`text.beforeAfter` /
multi-`beforeAfter` соответствующего layout) с `console.warn`.

## Оси именования

`text[.multi.<layout>.n<N>].<adorn>`

- **adorn** — подписи вокруг поля ввода: `plain` | `before` | `after` | `beforeAfter`
- **family** — simple (один input, `answerInput.type: 10`) | `aiTranslation`
  (весь `answerInput` — Translation-подпись единицы измерения) | `multi` (`input1..N`)
- **layout** (только multi) — `stack` (каждый input своей строкой) | `inline` (в одну строку)
- **nN** (только multi) — число `input1..N`

## Что НЕ создаёт новый шаблон

- ключи `fields` (`number`, `number1..N`, `letter`, …) — интерполяция `{key}`
  делается в `TaskDescription` через `applyTaskFields`
- `title` null / Translation — `TaskTitle` внутри каждого шаблона сам скрывается при пустом
- `description.content` string / Translation — обрабатывает `translateTasks`

## Каталог (15 шаблонов, grade 4 — 859 text-задач)

| templateId | Папка | Count | % |
| --- | --- | ---: | ---: |
| `text.plain` | [plain](ui/plain/) | 477 | 55.5 |
| `text.after` | [after](ui/after/) | 312 | 36.3 |
| `text.before` | [before](ui/before/) | 14 | 1.6 |
| `text.beforeAfter` | [before-after](ui/before-after/) | 4 | 0.5 |
| `text.aiTranslation` | [ai-translation](ui/ai-translation/) | 6 | 0.7 |
| `text.multi.stack.n2.beforeAfter` | [multi/stack-n2-before-after](ui/multi/stack-n2-before-after/) | 19 | 2.2 |
| `text.multi.stack.n2.before` | [multi/stack-n2-before](ui/multi/stack-n2-before/) | 9 | 1.0 |
| `text.multi.stack.n2.after` | [multi/stack-n2-after](ui/multi/stack-n2-after/) | 1 | 0.1 |
| `text.multi.stack.n3.beforeAfter` | [multi/stack-n3-before-after](ui/multi/stack-n3-before-after/) | 2 | 0.2 |
| `text.multi.stack.n3.before` | [multi/stack-n3-before](ui/multi/stack-n3-before/) | 1 | 0.1 |
| `text.multi.stack.n4.after` | [multi/stack-n4-after](ui/multi/stack-n4-after/) | 1 | 0.1 |
| `text.multi.stack.n5.after` | [multi/stack-n5-after](ui/multi/stack-n5-after/) | 2 | 0.2 |
| `text.multi.inline.n2.after` | [multi/inline-n2-after](ui/multi/inline-n2-after/) | 3 | 0.3 |
| `text.multi.inline.n3.beforeAfter` | [multi/inline-n3-before-after](ui/multi/inline-n3-before-after/) | 2 | 0.2 |
| `text.multi.inline.n5.after` | [multi/inline-n5-after](ui/multi/inline-n5-after/) | 6 | 0.7 |

## Устройство

- Каждый шаблон — тонкая конфигурация фабрики:
  [`lib/create-simple-text-template.tsx`](lib/create-simple-text-template.tsx) или
  [`lib/create-multi-text-template.tsx`](lib/create-multi-text-template.tsx).
  Фабрика гарантирует единое поведение (solution-ветка, title, description),
  конфиг фиксирует UI-структуру шаблона.
- Solution-виды общие: [`shared/text-solution.tsx`](shared/text-solution.tsx) (один input),
  [`shared/multi-text-solution.tsx`](shared/multi-text-solution.tsx) (multi).
- Типы payload: [`lib/types.task.ts`](lib/types.task.ts), [`lib/types.solution.ts`](lib/types.solution.ts).

## Как добавить шаблон

1. Папка `ui/<folder>/` с `text-<folder>.tsx` (конфиг фабрики), `README.md`,
   `text-<folder>.test.tsx`, `text-<folder>.stories.tsx` (Default + WithSolution +
   InTrainer + OpenInTrainer + AllGroups), `data/task.json` (пример payload),
   `data/groups.json` (все `text_N` этого UI).
2. Id в [`lib/template-ids.ts`](lib/template-ids.ts) + loader в [`lib/registry.ts`](lib/registry.ts).
3. Правило в [`lib/classify-text-template.ts`](lib/classify-text-template.ts)
   (и зеркально в stats server `templatesTable`).
4. Id в манифест [`model/implemented-templates.json`](../../../../model/implemented-templates.json) —
   его читает вкладка «Шаблоны» в stats-панели.
5. Кейс в `lib/classify-text-template.test.ts`.
6. Перегенерировать `data/groups.json`: `node scripts/generate-text-template-groups.mjs`.

Stories: `pnpm storybook` → `Templates/Text/<folder>`.
В каждом шаблоне story **AllGroups** — все structural groups (`text_N`),
которые classify отправляет на этот UI (фикстуры в `data/groups.json`).
Обёртка и deps — [`lib/storybook`](lib/storybook/).
