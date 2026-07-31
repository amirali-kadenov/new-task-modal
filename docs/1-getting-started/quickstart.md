# 🚀 Быстрый старт (Quickstart)

Руководство по локальному разворачиванию и разработке модуля `@qalan/new-task-modal`.

---

## 📋 Требования

- **Node.js**: `≥ 18.0.0`
- **Пакетный менеджер**: `pnpm` (`≥ 8.0.0`)

---

## ⚡ 1. Установка зависимостей

В директории `new-task-modal`:

```bash
pnpm install
```

---

## 💻 2. Локальный запуск (Dev-стенд)

Запуск автономного Vite dev-сервера с тестовой средой рендеринга заданий:

```bash
pnpm dev
```

Dev-сервер доступен по адресу: **`http://localhost:5173`**

---

## 🎨 3. Запуск Storybook

Для визуального тестирования и просмотра компонентов UI:

```bash
pnpm storybook
```

Storybook доступен по адресу: **`http://localhost:6006`**

---

## 🔗 4. Связка с хост-приложением (`matheducator`)

Хост-приложение (`matheducator/reactjs_client`) подключает `new-task-modal` прямо из бандла `dist/` через Webpack alias.

Чтобы ваши изменения сразу подхватывались хостом:

1. В директории `new-task-modal` запустите watch-сборку:
   ```bash
   pnpm build:watch
   ```

2. В директории `matheducator/reactjs_client` запустите dev-сервер:
   ```bash
   npm start
   ```

3. При изменении исходников `new-task-modal` Vite пересобирает `dist/`, а Webpack автоматически обновляет страницу хоста!

---

## 🛠️ Основные CLI команды

| Команда | Описание |
| :--- | :--- |
| `pnpm dev` | Автономный запуск dev-стенда |
| `pnpm build` | Однократная сборка библиотеки в `dist/` |
| `pnpm build:watch` | Watch-сборка для работы с `matheducator` |
| `pnpm storybook` | Запуск Storybook на порту 6006 |
| `pnpm build-storybook` | Сборка статического Storybook |
| `pnpm lint` | Проверка кода ESLint и Stylelint |
| `pnpm generate-available-tasks` | Регенерация индекса `dist/available-tasks.js` |
