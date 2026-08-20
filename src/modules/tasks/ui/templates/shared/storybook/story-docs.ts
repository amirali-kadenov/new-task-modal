/**
 * Shared Storybook docs helpers for template variants.
 *
 * Each variant already documents itself in a sibling `README.md`; these helpers
 * surface that file as the autodocs page intro so there is one source of truth.
 */

/** Storybook already renders the story title, so drop the README's own H1. */
const stripLeadingTitle = (markdown: string): string =>
  markdown.replace(/^\s*#\s+.*(\r?\n)+/, '')

/**
 * README links point at sibling files on disk and would 404 from Storybook.
 * Keep the path visible as code instead of shipping a dead link.
 */
const neutralizeRelativeLinks = (markdown: string): string =>
  markdown.replace(/\[([^\]]+)\]\((?!https?:\/\/)[^)]*\)/g, '`$1`')

/** Variant README as the Docs page description. Spread into `meta.parameters`. */
export const templateDocs = (readme: string) => ({
  docs: {
    description: {
      component: neutralizeRelativeLinks(stripLeadingTitle(readme)),
    },
  },
})

/** Per-story description. Spread into a story's `parameters`. */
export const storyDocs = (description: string) => ({
  docs: { description: { story: description } },
})

/**
 * Props injected by the render helpers (fixture task, deps, answer wiring).
 * Hidden so the Docs args table shows only the controls a reader can change.
 */
export const HIDDEN_TASK_ARGTYPES = {
  task: { table: { disable: true } },
  deps: { table: { disable: true } },
  answer: { table: { disable: true } },
  onChange: { table: { disable: true } },
  mathInput: { table: { disable: true } },
}

/** Descriptions for the story set every variant shares. */
export const STORY_DOCS = {
  default:
    'Базовый вид варианта без решения. Controls `group` и `taskId` выбирают structural group и конкретную задачу из `all-tasks.json`.',
  withSolution:
    'Режим решения: поля показывают правильный ответ и недоступны для ввода. Controls `group` / `taskId` — как у Default.',
  inTrainer:
    'Полный сценарий тренажёра — заголовок, действия и проверка ответа. Ближе всего к поведению на хосте.',
  allGroups:
    'Все structural groups этого варианта на одном экране — быстрый визуальный диф между группами.',
  allTasks:
    'Каталог реальных задач выбранного класса, отрисованных этим шаблоном. Control `grade` меняет класс.',
} as const
