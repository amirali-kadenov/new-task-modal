# FAQ — @qalan/new-task-modal

Ответы на наиболее частые вопросы при интеграции и разработке. Можете дополнять по мере необходимости.

---

## Интеграция

### Модальное окно не появляется. Что проверить?

В хост-приложении должен присутствовать элемент с id `task-modal-wrapper`:

```html
<div id="task-modal-wrapper" style="height: 100%"></div>
```

`TaskModalController` ищет именно этот элемент и монтирует React-дерево внутрь него. Если его нет — монтирование молча прерывается.

---

### Почему `TaskModalController` возвращает `null`?

Это ожидаемое поведение. Контроллер монтирует модальное окно **в отдельный React-root** внутри `#task-modal-wrapper` через `createRoot`, а не рендерит JSX на месте вызова. Сам вызов `TaskModalController(props)` можно делать из любого контекста, не обязательно внутри React.


---


## Задания

### Как определяется, какой шаблон использовать для задания?

Маппинг `task_id → шаблон` хранится в файлах по главам:

```
src/modules/tasks/ui/grades/grade-4/chapter-1.ts
src/modules/tasks/ui/grades/grade-4/chapter-2.ts
…
```

Каждый файл экспортирует объект `TemplateTypes → string[]`, где строка — это суффикс ID задания (например, `'1_1'` для `Task_4_1_1`).

---

### Как добавить поддержку нового типа задания?

1. Создайте шаблон в `src/modules/tasks/ui/templates/<tип>/`.
2. Добавьте новый `TemplateTypes` в `model/template-types.ts`.
3. Зарегистрируйте его в реестре шаблонов.
4. Пропишите ID заданий в соответствующий файл главы в `grades/grade-N/chapter-N.ts`.

---


### Что такое `answerInput.inline`?

Флаг `inline: true` означает, что поля ввода отображаются **в строку** внутри текста условия, а не под ним. Это влияет на выбор внутреннего sub-шаблона (inline vs. block layout).

---

### Как работает разделитель ответов?

Для заданий с несколькими полями ответы хранятся в одной строке, разделённой специальным символом (`deps.helpers.TaskHelper.multipleTaskAnswerSeparator`). Например: `"52127;63206"`. При сохранении и проверке эта строка разбивается по разделителю.

---


## Сборка и публикация

### Как опубликовать изменения в хост-приложение?

Хост резолвит `@qalan/new-task-modal` на `../../new-task-modal/dist` через
webpack alias. Достаточно пересобрать библиотеку:

```bash
# Watch: автосборка dist/ при изменениях
pnpm build:watch

# Однократная сборка
pnpm build
```

Затем обновите страницу matheducator (`npm start` в `reactjs_client`).

---

### Что такое `available-tasks.js`?

Дополнительная точка входа (`exports["./available-tasks"]`), которая экспортирует список всех зарегистрированных ID заданий. Используется для проверки покрытия и автогенерации тестов. Регенерируется командой:

```bash
pnpm generate-available-tasks
```

---

### Почему стили инжектируются через JS, а не через отдельный CSS-файл?

Библиотека использует `vite-plugin-css-injected-by-js` — стили встраиваются в JS-бандл и применяются при монтировании компонента. Это изолирует стили библиотеки от CSS хост-приложения и исключает конфликты каскадирования.

---


## Разработка

### Почему SCSS-переменные доступны во всех файлах без импорта?

В `vite.config.ts` настроен `additionalData` для SCSS-препроцессора, который автоматически добавляет в начало каждого `.scss`-файла:

```scss
@use "/src/styles/lib/functions" as *;
@use "/src/styles/lib/mixins" as *;
@use "/src/styles/design-system/typography" as *;
```

Импортировать их вручную не нужно.

---

### Как запустить линтеры?

```bash
# ESLint
pnpm lint:eslint

# Stylelint
pnpm lint:stylelint

# Автоисправление обоих
pnpm lint:eslint:fix
pnpm lint:stylelint:fix
```

Линтеры также запускаются автоматически в pre-commit хуке (Husky + lint-staged).

---

### Почему unit-тесты зелёные, а в Storybook математика сломана?

`pnpm test:unit` мокает `@/ui/math-text/math-text` и `math-formula` на обычный `<span>` — MathJax в jsdom не запускается. Зелёный unit значит «строка и разметка React ок», а не «в браузере формула выглядит правильно».

Реальный CHTML проверяет `pnpm test:interactions` (Storybook + Chromium):

- story `Templates/Text/plain` → `MathRegressions` — нет `mjx-merror`, нет сырых `\(`/`\)`, единица `дм` upright, дроби text_24 в размер прозы;
- story `Templates/Text/after` → `MathRegressions` — то же плюс `см`/`мм` в одном шрифте, дроби text_49 в размер прозы и отсутствие служебного `||` в ответе text_67;
- catalog smoke (All Groups) — если в DOM уже есть MathJax, нет `mjx-merror`.

Хелперы: `src/ui/math-text/assert-mathjax-dom.ts`.

---

### Почему дробь в описании мельче окружающего текста?

`\frac` в строчной формуле уходит в textstyle: числитель и знаменатель рисуются в scriptstyle (~0.71 кегля). `\dfrac` форсит displaystyle — глифы остаются в размер прозы.

`normalizeFractionStyle` (в `MathText` / `MathFormula` и до разреза в `TextTaskDescription`) поднимает `\frac` → `\dfrac` внутри `\(...\)`. Инвариант `assertMathSizeMatchesProse` сравнивает `font-size` глифов в `mjx-num`/`mjx-den` с прозой (степени под `mjx-script` пропускает).

---

### Почему кириллица в формуле рисуется другим шрифтом?

В TeX-шрифтах MathJax нет кириллицы, поэтому такие символы он выводит не в `mjx-c`, а в `mjx-utext` со своим `unknownFamily` (serif). Правило Halvar на родительском `mjx-mi` при этом не работает — нужен отдельный селектор `mjx-utext` в `math-text.module.scss`.

Это ломает единицы измерения: `\mathrm{см}` в описании выглядит иначе, чем окружающая проза. Инвариант `assertMathGlyphFontConsistent` сравнивает `mjx-utext` с соседними `mjx-c` и ловит такой регресс.

---

### Почему `||` в правильном ответе превращается в `‖`?

CMS хранит равнозначные правильные ответы в одной строке через служебный разделитель `||`, например `a : 6 || \frac{a}{6}`. Если передать строку в MathJax целиком, он трактует `||` как математический знак нормы/параллельности.

`getCorrectAnswerFromSolution` выбирает для UI первый (основной) вариант до `||`. Проверка ответа этим не затрагивается. Инвариант `assertNoAnswerSeparator` не допускает в regression-story ни исходный `||`, ни отрендеренные `‖`/`∥`.

---

### Куда добавить документацию к новому шаблону?

По соглашению проекта, каждый шаблон документируется через JSDoc-комментарий в конце `.tsx`-файла компонента. Комментарий должен содержать:
- тип задания
- структуру объекта `answerInput`
- пример полного объекта задания (`Full Task Object`)
- пример объекта решения (`Solution Object`)

Пример можно посмотреть в `answer-cell.tsx` или `multi-input.tsx`.
