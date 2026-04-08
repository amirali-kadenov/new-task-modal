export type AvailableTasks = Record<string, boolean>

const GRADE_CHAPTER_REGEX = /grade-(\d+)\/chapter-(\d+)\.ts$/

/**
 * Генерирует объект доступных задач на основе файлов в src/modules/tasks/ui/grades
 */
export const getAvailableTasks = async (): Promise<AvailableTasks> => {
  // Используем import.meta.glob для поиска всех файлов глав
  const modules = import.meta.glob('/src/modules/tasks/ui/grades/**/*.ts')
  const availableTasks: AvailableTasks = {}

  const entries = Object.entries(modules)

  // Загружаем все модули параллельно
  await Promise.all(
    entries.map(async ([path, loader]) => {
      const match = path.match(GRADE_CHAPTER_REGEX)
      if (!match) return

      const [, grade, chapter] = match

      try {
        const module = (await loader()) as { default: Record<string, number[]> }

        if (module.default && typeof module.default === 'object') {
          // Собираем все ID задач из объекта map (module.default)
          Object.values(module.default).forEach((taskIds) => {
            if (Array.isArray(taskIds)) {
              taskIds.forEach((taskId) => {
                const key = `${grade}_${chapter}_${taskId}`
                availableTasks[key] = true
              })
            }
          })
        }
      } catch (error) {
        console.error(
          `❌ Не удалось загрузить модуль задачи по пути ${path}:`,
          error,
        )
      }
    }),
  )

  return availableTasks
}
