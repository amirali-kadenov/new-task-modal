# @qalan/new-task-modal

## Содержание

- [@qalan/new-task-modal](#qalannew-task-modal)
  - [Содержание](#содержание)
  - [Обзор](#обзор)
  - [Установка](#установка)
  - [Использование](#использование)
    - [TaskModalController](#taskmodalcontroller)
    - [Chat](#chat)
  - [API](#api)
    - [TaskModalProps](#taskmodalprops)
    - [TaskModalState](#taskmodalstate)
    - [TaskModalActions](#taskmodalactions)
    - [TaskModalDependencies](#taskmodaldependencies)
    - [TaskModalHostProps](#taskmodalhostprops)
  - [Архитектура](#архитектура)
    - [Модули](#модули)
    - [Шаблоны заданий](#шаблоны-заданий)
    - [Маппинг по классам и главам](#маппинг-по-классам-и-главам)
  - [Разработка](#разработка)
    - [Требования](#требования)
    - [Локальный запуск (dev-стенд)](#локальный-запуск-dev-стенд)
    - [Storybook](#storybook)
    - [Сборка библиотеки](#сборка-библиотеки)
  - [Скрипты](#скрипты)
  - [Технологический стек](#технологический-стек)

---

## Обзор

`new-task-modal` — это изолированная библиотека (ES-модуль), которая монтируется в хост-приложение через `TaskModalController`. Библиотека:

- Отображает задания различных типов (text, formula, answerCell, columnOperation, table, test, comparison, equation и др.)
- Поддерживает встроенный двухвкладочный чат (AI-чат и Ментор)
- Инжектирует собственные шрифты и стили независимо от хоста
- Публикует два точки входа: основной модуль и список доступных заданий

---

## Установка

Библиотека распространяется через `yalc` для локальной разработки:

```bash
# В директории new-task-modal — сборка и публикация
pnpm build
yalc push

# В хост-приложении
yalc add @qalan/new-task-modal
```

Для live-разработки с авто-пересборкой:

```bash
pnpm build:watch
```

---

## Использование

### TaskModalController

Основной экспорт — контроллер для монтирования модального окна задания. Он монтирует React-дерево внутрь элемента `#task-modal-wrapper`, который должен присутствовать в DOM хост-приложения.

```tsx
import TaskModalController from '@qalan/new-task-modal'

// Вызывается при открытии задания
TaskModalController({
  activeTask,
  deps,
  state,
  setState,
  hostProps,
  actions,
  closeModal: () => { /* закрыть модальное окно */ },
})
```

> **Важно:** в хост-приложении должен существовать элемент `<div id="task-modal-wrapper"></div>`.

### Chat

Компонент чата экспортируется отдельно и может использоваться независимо от `TaskModalController`.

```tsx
import { Chat } from '@qalan/new-task-modal'
import type { ChatProps } from '@qalan/new-task-modal'

<Chat
  props={taskModalProps}
  onClose={() => setOpen(false)}
/>
```

Чат содержит две вкладки:
- **AI-чат** — доступен 24/7
- **Ментор** — живые менторы, доступны с 10:00 до 23:00

---

## API

### TaskModalProps

| Свойство    | Тип                  | Описание                                    |
|-------------|----------------------|---------------------------------------------|
| `activeTask` | `Task`              | Текущее активное задание                    |
| `deps`       | `TaskModalDependencies` | Внешние зависимости (API, утилиты и т.д.) |
| `state`      | `TaskModalState`    | Состояние модального окна                   |
| `setState`   | `SetTaskModalState` | Функция обновления состояния                |
| `hostProps`  | `TaskModalHostProps`| Пропсы от хост-приложения                  |
| `actions`    | `TaskModalActions`  | Экшены для управления заданием              |
| `closeModal` | `() => void`        | Коллбэк закрытия модального окна            |

### TaskModalState

Ключевые поля состояния:

| Поле                        | Тип                  | Описание                                  |
|-----------------------------|----------------------|-------------------------------------------|
| `activeTask`                | `Task`              | Текущее задание                           |
| `tasks`                     | `Task[] \| null`    | Список всех заданий урока                 |
| `isLoading`                 | `boolean`           | Флаг загрузки                             |
| `isOurPupil`                | `boolean \| null`   | Является ли пользователь учеником         |
| `currentUser`               | `User`              | Данные текущего пользователя              |
| `selectedIndexes`           | `number[]`          | Выбранные индексы (для тестовых заданий)  |
| `isShowingSolution`         | `boolean`           | Показывается ли решение                   |
| `isShowingVideoExplanation` | `boolean`           | Показывается ли видеообъяснение           |
| `selectedTheory`            | `Theory \| null`    | Выбранная теория                          |
| `userProgress`              | `number`            | Прогресс пользователя (0–100)             |
| `lesson`                    | `Lesson \| null`    | Данные текущего урока                     |

### TaskModalActions

| Метод                             | Описание                                      |
|-----------------------------------|-----------------------------------------------|
| `onLoadLesson()`                  | Загружает данные урока                        |
| `onTaskAnswerChanged(answer)`     | Обрабатывает изменение ответа                 |
| `onShowPrevTask()`                | Переходит к предыдущему заданию               |
| `onShowNextTask(progress)`        | Переходит к следующему заданию                |
| `onCheckAnswer()`                 | Проверяет ответ пользователя                  |
| `onShowSolution()`                | Показывает решение                            |
| `onShowVideoExplanation()`        | Показывает видеообъяснение                    |
| `onOpenTheoryModal()`             | Открывает панель теории                       |
| `onCloseTheoryModal()`            | Закрывает панель теории                       |
| `onAddTaskMistakeModalOpen()`     | Открывает форму репорта об ошибке             |
| `onTimeElapsedModalClose()`       | Закрывает модальное окно истечения времени    |
| `isLastPenaltyTaskAtPosition(task)` | Проверяет, является ли задание последним штрафным |

### TaskModalDependencies

Объект внешних зависимостей, который хост-приложение передаёт в библиотеку:

| Поле              | Описание                                       |
|-------------------|------------------------------------------------|
| `api`             | HTTP-клиент для запросов к backend             |
| `global`          | Глобальные данные приложения                   |
| `localize`        | Функции локализации                            |
| `lodash`          | Утилиты lodash                                 |
| `enums`           | Перечисления из хост-приложения                |
| `toast`           | Уведомления (react-toastify)                   |
| `socketController`| Контроллер WebSocket                           |
| `socket`          | WebSocket-соединение                           |
| `cookies`         | Работа с cookies (js-cookie)                   |
| `helpers`         | Вспомогательные функции (CyrillicTo, TaskHelper, ArabicNumeralUtils) |
| `eventEmitter`    | Шина событий (emit / on / off)                 |
| `alert`           | Сервис уведомлений (showError, showSuccessMessage и т.д.) |

### TaskModalHostProps

| Поле                  | Тип           | Описание                                       |
|-----------------------|---------------|------------------------------------------------|
| `lessonId`            | `number?`     | ID урока                                       |
| `personalStudyItemId` | `number?`     | ID персонального задания                       |
| `teacherLessonId`     | `number?`     | ID урока учителя                               |
| `selfWorkId`          | `number?`     | ID самостоятельной работы                      |
| `userProgress`        | `number`      | Текущий прогресс пользователя                  |
| `fontSizeFactor`      | `number`      | Коэффициент масштаба шрифта                    |
| `isMobile`            | `string?`     | Флаг мобильного устройства                     |
| `appVersion`          | `string?`     | Версия хост-приложения                         |
| `applicationType`     | `string?`     | Тип приложения                                 |
| `canUseDotNavigation` | `boolean?`    | Разрешена ли точечная навигация между заданиями|
| `isTesting`           | `boolean?`    | Режим тестирования                             |
| `location`            | `Location`    | Объект location (React Router v4-совместимый)  |
| `history`             | `History`     | Объект history (React Router v4-совместимый)   |

---

## Архитектура

### Модули

```
src/
├── modules/
│   ├── task-modal/      # Главный модуль: контроллер, состояние, провайдеры
│   ├── tasks/           # Движок рендеринга заданий
│   │   ├── ui/
│   │   │   ├── templates/   # Шаблоны типов заданий
│   │   │   ├── grades/      # Маппинг заданий по классам и главам
│   │   │   └── common/      # Общие UI-компоненты
│   │   ├── model/       # Хуки и стор
│   │   └── lib/         # Вспомогательные утилиты
│   ├── chat/            # Встроенный чат (AI + Ментор)
│   ├── audio/           # Аудиоплеер
│   └── canvas/          # Канвас-компоненты
├── ui/                  # Общие UI-компоненты (TopBar, Tabs и т.д.)
├── lib/                 # Глобальные утилиты (ErrorBoundary и т.д.)
├── styles/              # Дизайн-система, SCSS-переменные, миксины
└── types/               # TypeScript-типы API
```

### Шаблоны заданий

Каждый тип задания реализован как отдельный React-компонент в `src/modules/tasks/ui/templates/`:

| Тип             | Директория          | Описание                        |
|-----------------|---------------------|---------------------------------|
| `text`          | `text/`            | Текстовые задания с числовыми полями |
| `answerCell`    | `answer-cell/`     | Задания с ячейками ответа (до 6 числовых полей) |
| `formula`       | *(общий text)*     | Формульные задания (переменные fields) |
| `columnOperation` | `column-operation/` | Задания с вертикальными операциями |
| `table`         | `table/`           | Табличные задания               |
| `test`          | `test/`            | Тестовые задания с вариантами ответа |
| `comparison`    | `comparison/`      | Задания на сравнение            |
| `equation`      | `equation/`        | Уравнения                       |
| `multiInput`    | `multi-input/`     | Задания с несколькими полями ввода |

### Маппинг по классам и главам

Заглушки для каждого урока хранятся в `src/modules/tasks/ui/grades/`:

```
grades/
├── grade-4/
│   ├── chapter-1.ts   … chapter-12.ts
└── grade-5/
    └── …
```

Каждый файл главы экспортирует маппинг `lesson ID → шаблон задания`, обеспечивая корректный выбор шаблона для каждого конкретного задания учебной программы.

---

## Разработка

### Требования

- Node.js ≥ 18
- pnpm

### Локальный запуск (dev-стенд)

```bash
pnpm install
pnpm dev
```

Откроется dev-сервер на `http://localhost:5173` со страницей для ручного тестирования заданий.

### Storybook

```bash
pnpm storybook
```

Storybook запустится на `http://localhost:6006`.

### Сборка библиотеки

```bash
pnpm build
```

Артефакты попадут в `dist/`:
- `dist/index.js` — основной ES-модуль
- `dist/available-tasks.js` — автогенерируемый список доступных заданий
- `dist/index.d.ts` — TypeScript-определения
- `dist/assets/` — статические файлы (шрифты, SVG)

---

## Скрипты

| Команда                        | Описание                                               |
|--------------------------------|--------------------------------------------------------|
| `pnpm dev`                     | Запуск dev-сервера                                     |
| `pnpm build`                   | Сборка production-библиотеки                           |
| `pnpm build:watch`             | Сборка в watch-режиме с автопушем в yalc               |
| `pnpm storybook`               | Запуск Storybook                                       |
| `pnpm build-storybook`         | Сборка статического Storybook                          |
| `pnpm lint`                    | Проверка ESLint                                        |
| `pnpm lint:eslint:fix`         | Автоисправление ESLint                                 |
| `pnpm lint:stylelint`          | Проверка Stylelint                                     |
| `pnpm lint:stylelint:fix`      | Автоисправление Stylelint                              |
| `pnpm generate-available-tasks`| Регенерация файла `available-tasks.js`                 |

---

## Технологический стек

| Технология          | Версия   | Назначение                              |
|---------------------|----------|-----------------------------------------|
| React               | 19       | UI-рендеринг                            |
| TypeScript          | ~5.9     | Типизация                               |
| Vite                | 7        | Бандлер                                 |
| SCSS                | —        | Стили (CSS Modules + глобальные миксины)|
| TanStack Query      | 5        | Серверное состояние и кэширование       |
| Zustand             | 5        | Клиентский стор                         |
| MathJax / MathLive  | —        | Рендеринг математических формул         |
| Keen Slider         | 6        | Слайдеры в заданиях                     |
| WaveSurfer.js       | 7        | Аудиоплеер                              |
| Motion              | 12       | Анимации                                |
| React Compiler      | 1        | Автоматическая мемоизация               |
