import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Путь к папке с грейдами
const gradesDir = path.resolve(
  __dirname,
  '..',
  'src',
  'modules',
  'tasks',
  'ui',
  'grades',
)

interface CallbackArgs {
  chapterFileUrl: string
  gradeNum: string
  chapterNum: string
  taskId: number
}

export const traverseGrades = async (
  callback: (args: CallbackArgs) => Promise<void>,
) => {
  if (!fs.existsSync(gradesDir)) {
    console.error(`❌ Директория не найдена: ${gradesDir}`)
    return
  }

  const gradeItems = fs.readdirSync(gradesDir)

  for (const gradeItem of gradeItems) {
    if (!gradeItem.startsWith('grade-')) continue

    const gradeNum = gradeItem.replace('grade-', '')
    const gradePath = path.join(gradesDir, gradeItem)

    if (!fs.statSync(gradePath).isDirectory()) continue

    const files = fs.readdirSync(gradePath)

    for (const file of files) {
      // Теперь ищем .ts файлы
      if (!file.startsWith('chapter-') || !file.endsWith('.ts')) continue

      const chapterNum = file.replace('chapter-', '').replace('.ts', '')
      const chapterFilePath = path.resolve(gradePath, file)
      const chapterFileUrl = pathToFileURL(chapterFilePath).href

      await callback({
        chapterFileUrl,
        gradeNum,
        chapterNum,
        taskId: Number(chapterNum),
      })
    }
  }
}
