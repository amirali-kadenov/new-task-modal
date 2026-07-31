# Table-шаблоны

Каталог UI-шаблонов для задач `description.type === 'table'`.

Правило: **одна UI-структура = один шаблон**. Для остальных доменов (text,
columnOperation, …) шаблон выбирается по форме `answerInput` — здесь это не
работает: structural groups `table_7, table_10, table_11, table_12, table_13,
table_14, table_15` все имеют одинаковый `answerInput` (`type: 15`, пустые
адорнменты). Поэтому для `table` шаблон определяется формой
`description.table.rows` (число строк + расположение `answercell` в них), а
не structural group напрямую.

## Каталог (grade 4 — 15 structural groups)

| templateId | Папка | Structural groups |
| --- | --- | --- |
| `table.plain` | [plain](ui/plain/) | `table_1,2,3,4,5,6,8` |
| `table.grid` | [grid](ui/grid/) | `table_7,10,12` |
| `table.inline` | [inline](ui/inline/) | `table_9` |
| `table.list` | [list](ui/list/) | `table_13` |
| `table.mixed` | [mixed](ui/mixed/) | `table_11` |
| `table.multiRow` | [multi-row](ui/multi-row/) | `table_15` |
| `table.multiRowSvg` | [multi-row-svg](ui/multi-row-svg/) | `table_14` |

Все 7 переиспользуют один и тот же рендер
([`lib/create-table-template.tsx`](lib/create-table-template.tsx)) и один
shared SCSS ([`shared/table.module.scss`](shared/table.module.scss)) — разница
между шаблонами только в том, какие задачи в них попадают
(`classify-table-template.ts`) и, при необходимости, в точечных CSS-правках
под конкретный `data-template-id`.

## Как выбирается

[`lib/classify-table-template.ts`](lib/classify-table-template.ts) — чистая
функция `description.table.rows` → templateId. Каждая папка содержит свой
`README.md` с точным правилом и `data/groups.json` с реальными фикстурами.

Не подключено к живому приложению: `TEMPLATE_MAP`
(`../../../../model/template-map.ts`) продолжает роутить `table`-задачи на
старый `ui/templates/table/table.tsx`. Этот каталог — Storybook-спека для
будущей миграции.

## Скрипты

```bash
node scripts/generate-table-template-groups.mjs
npx tsx scripts/generate-grade4-table-chapter-map.ts
```

Stories: `pnpm storybook` → `Templates/Table/…`.
