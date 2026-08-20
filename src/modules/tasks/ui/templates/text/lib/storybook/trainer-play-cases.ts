import type { PlayCaseDef } from '@/testing/play-results'

/** Checklist + docs for Templates/.../Trainer stories. */

export const PLAY_CASES_CORRECT: PlayCaseDef[] = [
  {
    id: 'enter-answer',
    label: 'Ввод правильного ответа',
    descriptionRu:
      'В MathQuill-поля (или radio для test) подставляется текст solution из fixture выбранной group. Без solution шаг пропускается.',
  },
  {
    id: 'submit-correct',
    label: 'Проверить → принято',
    descriptionRu:
      'Клик «Проверить». Mock checkAnswer возвращает ShowCorrect; кнопка снова disabled — ответ принят и поле сброшено, как на хосте.',
  },
]

export const PLAY_CASES_WRONG: PlayCaseDef[] = [
  {
    id: 'wrong-attempts',
    label: 'Неверные попытки',
    descriptionRu:
      'До трёх отличающихся неверных ответов. После каждой — GiveAttempt, сердца/блокировка повтора того же ответа. Для radio часто только одна wrong-опция.',
  },
  {
    id: 'show-solution-next',
    label: 'Далее после решения',
    descriptionRu:
      'На 3-й ошибке mock отдаёт ShowSolution; кнопка становится «Далее». Клик сбрасывает single-task сессию (снова «Проверить» disabled).',
  },
]

export const PLAY_CASES_OPEN: PlayCaseDef[] = [
  {
    id: 'new-link',
    label: 'Ссылка «Новый тренажёр»',
    descriptionRu:
      'Launch-ссылка на хост с chapterId= (и lesson/task координатами group). Открывает новый тренажёр без Storybook shell.',
  },
  {
    id: 'old-link',
    label: 'Ссылка «Старый тренажёр»',
    descriptionRu:
      'Та же координата задачи, но с old=true — старый UI тренажёра на том же стенде.',
  },
  {
    id: 'catalog-tasks',
    label: 'Таблица всех задач',
    descriptionRu:
      'Кнопка «Все задачи» раскрывает чеклист всех taskId шаблона.',
  },
]

export const PLAY_CASES_HINTS: PlayCaseDef[] = [
  {
    id: 'hint1',
    label: 'Подсказка 1',
    descriptionRu:
      'withHints: после 1-го неверного ответа mock возвращает hint1; под задачей виден блок task-hint-1 («Storybook подсказка 1»).',
  },
  {
    id: 'hint2',
    label: 'Подсказка 2',
    descriptionRu:
      'После 2-го неверного ответа появляется hint2 (task-hint-2). На radio-доменах второй шаг может только подтвердить hint1.',
  },
]

export const PLAY_CASES_THEORY: PlayCaseDef[] = [
  {
    id: 'open-chat',
    label: 'Открыть чат',
    descriptionRu:
      'Кнопка «Открыть чат» открывает AI-чат; виден заголовок «AI-чат». Теория подгружается через getLessonById (withTheory).',
  },
  {
    id: 'theory-thumb',
    label: 'Видео теории',
    descriptionRu:
      'В ленте чата — thumbnail теории со story video id (TrnrStory01), не fallback MOCK_THEORY.',
  },
]

export const PLAY_CASES_SHOW_ANSWER: PlayCaseDef[] = [
  {
    id: 'open-chat',
    label: 'Открыть чат',
    descriptionRu:
      'Открывается AI-чат с действиями «Смотреть пример» / «Показать ответ».',
  },
  {
    id: 'show-answer',
    label: 'Показать ответ',
    descriptionRu:
      'Клик «Показать ответ» тянет solution через mock getTaskSolution; в сообщениях появляется блок «Верный ответ:». Калькулятор скрыт (как на хосте при activeTask.solution).',
  },
]

export const PLAY_CASES_CALC_OVERFLOW: PlayCaseDef[] = [
  {
    id: 'calc-hidden',
    label: 'Калькулятор скрыт',
    descriptionRu:
      'longContent + forceCalcOpen=false: после setup handleCalcOverflow закрывает calc. В DOM нет клавиш [data-calc] — как при переполнении task container на хосте.',
  },
]

export const TRAINER_STORY_DOCS = {
  correct: `
Стори поднимает полный shell тренажёра и прогоняет **счастливый путь**: ученик вводит верный ответ из \`solution\` fixture и нажимает «Проверить».

**Pass:** mock отвечает ShowCorrect, кнопка проверки снова disabled (ответ принят, поле очищено). Это базовый smoke, что шаблон, MathQuill/radio и checkAnswer связаны правильно.
`.trim(),

  wrong: `
Сценарий **ошибок до показа решения**. Play вводит неверные ответы (для multi-input каждый сегмент меняется отдельно), пока mock не отдаст ShowSolution.

**Pass:** после третьей ошибки появляется «Далее»; клик сбрасывает сессию к исходному состоянию. Для test/radio, где мало wrong-опций, покрывается хотя бы первый неверный submit и отсутствие «Далее».
`.trim(),

  open: `
Это **не** встроенный тренажёр, а пикер group/task и ссылки на реальный хост (localhost стенда). Нужен, чтобы руками открыть ту же задачу в новом или старом тренажёре.

Кнопки **«Все задачи»** / **«Все группы»** раскрывают таблицы с чекбоксами: можно отметить прогресс и скопировать/скачать markdown-чеклист. Клик по строке выбирает задачу или группу для ссылок запуска.

**Pass:** «Новый тренажёр» содержит \`chapterId=\`, «Старый тренажёр» — \`old=true\`; «Все задачи» открывает таблицу.
`.trim(),

  hints: `
Проверка **API-подсказок** (\`hint1\` / \`hint2\`), которых нет в обычных grade-4 fixtures. Story включает \`withHints\` в mock: после ошибок под задачей рендерится \`TaskHints\`.

**Pass:** после 1-й ошибки виден hint1, после 2-й — hint2 (где позволяет тип ответа).
`.trim(),

  theory: `
Проверка ветки **теории в AI-чате**. Mock \`getLessonById\` отдаёт video_url теории; при открытии чата \`useTheory\` кладёт видео в ленту.

**Pass:** после «Открыть чат» есть thumbnail с id теории Storybook (\`TrnrStory01\`), а не только MOCK_THEORY.
`.trim(),

  showAnswer: `
Проверка чат-действия **«Показать ответ»** (без полного canvas/chat suite). Открывается чат, вызывается show solution.

**Pass:** в сообщениях появляется текст «Верный ответ:» с solution fixture.
`.trim(),

  calcOverflow: `
Проверка layout-логики **скрытия калькулятора** при переполнении task container (\`handleCalcOverflow\`). Story форсит длинный текст и отключает \`forceCalcOpen\`, чтобы сработал production-путь \`useCalcSetup\`.

**Pass:** после setup в DOM нет элементов \`[data-calc]\` — калькулятор закрыт/не смонтирован.
`.trim(),
} as const

export const trainerPlayParameters = (
  playCases: PlayCaseDef[],
  storyDescription: string,
  extra?: Record<string, unknown>,
) => ({
  playCases,
  docs: { description: { story: storyDescription } },
  ...extra,
})
