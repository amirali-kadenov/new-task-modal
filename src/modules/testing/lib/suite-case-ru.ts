import type { SuiteCaseResult } from './test-runner-events'

/**
 * Russian descriptions for suite cases.
 * Matched by first regex that hits the case label (order matters).
 */
const RULES: { re: RegExp; text: string }[] = [
  {
    re: /\[allTasks].*data ok/i,
    text: 'Проверяет, что в all-tasks.json для выбранного класса у каждой задачи есть id, group и task с описанием.',
  },
  {
    re: /\[allGroups].*data ok/i,
    text: 'Проверяет, что groups.json не пустой и у групп есть задачи или встроенный task.',
  },
  {
    re: /\[allTasks].*smoke|All Tasks|\/Tasks/i,
    text: 'Smoke: каталог Tasks монтируется в Chromium без необработанной ошибки.',
  },
  {
    re: /\[allGroups].*smoke|All Groups|\/Groups/i,
    text: 'Smoke: каталог Groups монтируется в Chromium без необработанной ошибки.',
  },
  {
    re: /new trainer accepts/i,
    text: 'E2E: в новом тренажёре правильный ответ принимается (кнопка «Проверить» снова disabled).',
  },
  {
    re: /old trainer/i,
    text: 'E2E: в старом тренажёре (?old=true) правильный ответ даёт toast или progress-dot успеха.',
  },
  {
    re: /chat-input|Chat\//i,
    text: 'E2E: ввод в чате Storybook отвечает ожидаемому сценарию.',
  },
]

export const describeCaseRu = (label: string): string | undefined => {
  for (const rule of RULES) {
    if (rule.re.test(label)) return rule.text
  }
  return undefined
}

export const withDescriptionRu = (
  cases: SuiteCaseResult[],
): SuiteCaseResult[] =>
  cases.map((c) => ({
    ...c,
    descriptionRu: c.descriptionRu ?? describeCaseRu(c.label),
  }))
