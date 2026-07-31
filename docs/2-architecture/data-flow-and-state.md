# 🔄 Потоки данных и Управление состоянием (Data Flow & State)

Разбор архитектуры управления состоянием и обмена данными внутри библиотеки `@qalan/new-task-modal`.

---

## 🗂️ Стратегия управления состоянием

В проекте применяется чёткое разделение ответственности между **серверным** и **клиентским** состоянием:

```mermaid
graph LR
    subgraph ServerState [TanStack Query v5]
        LessonData[Данные урока]
        TaskData[Данные заданий]
        ChatHistory[История чата]
        Theory[Материалы теории]
    end

    subgraph ClientState [Zustand v5]
        ActiveTabIndex[Активная вкладка]
        CurrentAnswers[Введённые ответы]
        CanvasStrokes[Слои канваса]
        UIFlags[Флаги модалок и лоадеров]
    end

    ServerState --> UIComponents[React Components]
    ClientState --> UIComponents
```

---

## 🟢 1. Клиентское состояние (Zustand)

Для локального UI-состояния применяется lightweight-стор Zustand (`src/modules/tasks/model/use-task-store.ts`):

### Поля Zustand Store:
- `userAnswer`: Хранит текущий ответ ученика (строку, массив ответов или выбранные индексы).
- `isChecking`: Флаг проверки ответа.
- `isSolved`: Проведено ли успешное решение текущего задания.
- `mistakesCount`: Количество ошибочных попыток на текущем задании.

---

## 🔵 2. Серверное состояние (TanStack Query)

Все запросы к backend выполняются через обёртки React Query (`useQuery`, `useMutation`), использующие `deps.api`:

- `useLessonQuery(lessonId)`: Получение информации об уроке и списка заданий.
- `useCheckAnswerMutation()`: Отправка ответа на проверку и обновление локального прогресса.
- `useChatMessagesQuery()`: Получение истории диалога с AI-помощником.

---

## 📝 3. Жизненный цикл ввода и проверки ответа

```mermaid
sequenceDiagram
    autonumber
    participant User as Ученик
    participant UI as Компонент шаблона (Text/Table/Cell)
    participant Store as Zustand Store
    participant Action as TaskModalActions.onCheckAnswer
    participant Backend as Phoenix API

    User->>UI: Ввод ответа в поле / Выбор варианта
    UI->>Store: setUserAnswer(val)
    User->>UI: Нажатие кнопки "Проверить"
    UI->>Action: onCheckAnswer(userAnswer)
    Action->>Backend: HTTP POST /api/check_task_answer
    Backend-->>Action: { success: true/false, progress: 80 }
    alt Ответ верный
        Action->>Store: setIsSolved(true)
        Action->>UI: Показать анимацию успеха и активировать кнопку "Далее"
    else Ответ неверный
        Action->>Store: incrementMistakes()
        Action->>UI: Показать подсветку ошибок и подсказку
    end
```

---

## 💬 4. Поток данных Чайта (AI / Ментор)

1. **AI-Чат**: Работает через `WebSocket` (`deps.socketController`). При отправке сообщения клиент эмитит событие `send_ai_message`, ответ приходит потоково (streaming) и отображается в реальном времени.
2. **Чат Ментора**: Запросы отправляются через REST API с уведомлениями о новых ответах через WebSocket.
