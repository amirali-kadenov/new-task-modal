# ➕ Пошаговое руководство: Добавление нового типа задания

Подробный чек-лист по созданию и регистрации нового типа (шаблона) задания в библиотеке.

---

## 🛠️ Шаг 1: Создание структуры компонентов

Создайте новую директорию в `src/modules/tasks/ui/templates/`:

```text
src/modules/tasks/ui/templates/my-new-type/
├── my-new-type.tsx
├── my-new-type.module.scss
└── my-new-type.stories.tsx
```

### Пример базового компонента (`my-new-type.tsx`):

```tsx
import React from 'react'
import type { Task } from '@/types'
import styles from './my-new-type.module.scss'

interface MyNewTypeTemplateProps {
  task: Task
  value: string
  onChange: (val: string) => void
  disabled?: boolean
}

export const MyNewTypeTemplate: React.FC<MyNewTypeTemplateProps> = ({
  task,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{task.title}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={styles.input}
      />
    </div>
  )
}
```

---

## 📝 Шаг 2: Регистрация типа в `template-types.ts`

Добавьте новое значение в перечисление типов шаблонов:

```typescript
// src/modules/tasks/model/template-types.ts
export enum TemplateTypes {
  Text = 'text',
  AnswerCell = 'answerCell',
  // ...
  MyNewType = 'myNewType', // 👈 Новый тип
}
```

---

## 🗂️ Шаг 3: Регистрация в реестре шаблонов

Зарегистрируйте созданный компонент в корневом свитчере/реестре заданий:

```typescript
// src/modules/tasks/ui/template-registry.tsx
import { MyNewTypeTemplate } from './templates/my-new-type/my-new-type'

export const renderTemplate = (type: TemplateTypes, props: BaseTemplateProps) => {
  switch (type) {
    case TemplateTypes.MyNewType:
      return <MyNewTypeTemplate {...props} />
    // ...
  }
}
```

---

## 🗺️ Шаг 4: Привязка к заданиям учебного плана (`grades/`)

Пропишите маппинг суффиксов заданий в соответствующей главе учебного класса:

```typescript
// src/modules/tasks/ui/grades/grade-4/chapter-1.ts
import { TemplateTypes } from '../../../model/template-types'

export const chapter1Mapping = {
  [TemplateTypes.MyNewType]: [
    '15_1', '15_2', '15_3', // 👈 Задания Task_4_1_15_1, Task_4_1_15_2 и т.д.
  ],
}
```

---

## 🔄 Шаг 5: Регенерация индекса доступных заданий

Обязательно запустите скрипт регенерации индекса:

```bash
pnpm generate-available-tasks
```

Это обновит файл `dist/available-tasks.js`, который используется для валидации покрытия заданий и генерации автотестов.

---

## 🎨 Шаг 6: Создание Storybook историй

Добавьте файл `my-new-type.stories.tsx` и убедитесь, что шаблон корректно рендерится в Storybook:

```bash
pnpm storybook
```
