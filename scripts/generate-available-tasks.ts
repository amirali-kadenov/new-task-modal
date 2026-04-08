import { traverseGrades } from './traverse-grades.ts'

interface AvailableTasks {
  [key: string]: boolean
}

interface Module {
  default: Record<string, number[]>
}

/**
 * Импортирует TS файл и извлекает ID задач из экспортированного объекта 'map'
 */
const getTaskIdsViaImport = async (fileUrl: string): Promise<number[]> => {
  try {
    // В Node.js для динамического импорта TS файлов нужен URL (особенно в Windows)
    const module = (await import(fileUrl)) as Module

    const map = module.default

    if (!map || typeof map !== 'object') {
      console.warn(`⚠️ В файле ${fileUrl} не найден экспорт 'map'.`)
      return []
    }

    // Собираем все числа из массивов внутри объекта
    return Object.values(map).flatMap((ids) => (Array.isArray(ids) ? ids : []))
  } catch (error) {
    console.error(`❌ Не удалось импортировать ${fileUrl}:`, error)
    return []
  }
}

export const generateAvailableTasks = async () => {
  const availableTasks: AvailableTasks = {}

  await traverseGrades(async (args) => {
    const { chapterFileUrl, gradeNum, chapterNum } = args
    const taskIds = await getTaskIdsViaImport(chapterFileUrl)

    for (const id of taskIds) {
      availableTasks[`${gradeNum}_${chapterNum}_${id}`] = true
    }
  })

  const totalTasks = Object.keys(availableTasks).length
  console.log(`✅ Обработка завершена. Найдено задач: ${totalTasks}`)

  const code = `const availableTasks=${JSON.stringify(availableTasks, null, 2)};\n\nexport default availableTasks;`

  return code
}
