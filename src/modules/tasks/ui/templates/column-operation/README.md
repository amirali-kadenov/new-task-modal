# ColumnOperation-шаблоны

Каталог UI-шаблонов для задач `description.type === 'columnOperation'`.

Правило: **одна UI-структура = один шаблон**. Шаблон определяется формой
`answerInput`, а не structural group (`columnOperation_1` … `_3`).

## Каталог (grade 4 — 484 задачи)

| templateId | Папка | Count |
| --- | --- | ---: |
| `columnOperation.plain` | [plain](ui/plain/) | 404 |
| `columnOperation.multi.stack.n2.before` | [multi/stack-n2-before](ui/multi/stack-n2-before/) | 80 |

`columnOperation_1` и `_2` — один UI (`plain`): отличаются только
`description.content` string vs Translation.

У `_3` в данных `inline: false` → layout **stack** (не horizontal inline).

## Как выбирается

[`lib/classify-column-operation-template.ts`](lib/classify-column-operation-template.ts)
→ nested `TemplateTypes.ColumnOperation.*` → [`TEMPLATE_MAP`](../../../../model/template-map.ts).

## Скрипты

```bash
node scripts/generate-column-operation-template-groups.mjs
npx tsx scripts/generate-grade4-column-operation-chapter-map.ts
```

Stories: `pnpm storybook` → `Templates/ColumnOperation/…`.

### Операции (+, −, ×, ÷)

В `plain` есть истории `Addition` / `Subtraction` / `Multiplication` /
`Division` / `AllOperations` — fixtures из `data/operations.json`
(генерируются вместе с groups).

У `multi/stack-n2-before` только деление (`Division` + `AllOperations`).
