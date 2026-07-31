import { Markdown, Title } from '@storybook/addon-docs/blocks'

export type TrainerDocsExample = {
  rootTitle: string
  titleRu: string
  descriptionRu: string
  answerRu: string
  taskType: string
}

/** Canonical example from equation.before / Task_4_3_6_1. */
export const DEFAULT_TRAINER_DOCS_EXAMPLE: TrainerDocsExample = {
  rootTitle: 'Templates/Equation/before',
  titleRu: 'Решите уравнение.',
  descriptionRu: '494 + x = 343 · 7 + 335',
  answerRu: '2242',
  taskType: 'Elixir.Task_4_3_6_1',
}

const pickRu = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'rus' in value) {
    const rus = (value as { rus?: unknown }).rus
    return typeof rus === 'string' ? rus : ''
  }
  return ''
}

/** Build docs example from a local `data/task.json` fixture when possible. */
export const exampleFromTask = (
  task: {
    type?: string
    title?: unknown
    description?: { content?: unknown }
    solution?: { answer?: unknown } | string | null
  },
  rootTitle: string,
): TrainerDocsExample => {
  const answerRu =
    typeof task.solution === 'string'
      ? task.solution
      : pickRu(task.solution?.answer)

  const titleRu = pickRu(task.title) || DEFAULT_TRAINER_DOCS_EXAMPLE.titleRu
  const descriptionRu =
    pickRu(task.description?.content) ||
    DEFAULT_TRAINER_DOCS_EXAMPLE.descriptionRu

  return {
    rootTitle,
    titleRu,
    descriptionRu,
    answerRu: answerRu || DEFAULT_TRAINER_DOCS_EXAMPLE.answerRu,
    taskType: task.type || DEFAULT_TRAINER_DOCS_EXAMPLE.taskType,
  }
}

/**
 * Short markdown for Templates/{variant}/Trainer Documentation — no live stories.
 */
export const buildTrainerFolderDocsMarkdown = (
  example: TrainerDocsExample = DEFAULT_TRAINER_DOCS_EXAMPLE,
): string => {
  const variant = example.rootTitle.replace(/^Templates\//, '')

  return `
Тренажёр для \`${variant}\`: shell + mock API, без бэкенда.

- **Checklist** — пикер и таблица задач (колонки Новый/Старый тренажёр; прогресс в localStorage).
- **Check-list** (глобально: \`Trainer/Check-list\`) — сводка отметок по всем вариантам.
- **Flow/** — interaction-сценарии (Correct, Wrong Answer, Hints, Theory, Show Answer, Calc Overflow). На Canvas: **Run interaction**.

**Пример:** ${example.titleRu} · \`${example.descriptionRu}\` → \`${example.answerRu}\` (\`${example.taskType}\`)

| Flow | Что проверяет |
| --- | --- |
| Correct | верный ответ → принято |
| Wrong Answer | 3 ошибки → ShowSolution / Далее |
| Hints | hint1 / hint2 после ошибок |
| Theory | видео теории в AI-чате |
| Show Answer | «Показать ответ» в чате |
| Calc Overflow | калькулятор скрыт при overflow |
`.trim()
}

/** Docs page: Title + Markdown only (no Description / Stories / Primary). */
export const TemplateTrainerDocsPage = ({
  markdown,
}: {
  markdown: string
}) => (
  <>
    <Title />
    <Markdown>{markdown}</Markdown>
  </>
)

export const trainerFolderDocsParameters = (example: TrainerDocsExample) => {
  const markdown = buildTrainerFolderDocsMarkdown(example)
  return {
    docs: {
      page: () => <TemplateTrainerDocsPage markdown={markdown} />,
    },
  }
}
