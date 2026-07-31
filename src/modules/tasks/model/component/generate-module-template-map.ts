import {
  TEMPLATE_MAP,
  type TemplateType,
} from '@/modules/tasks/model/template-map'

export type ModuleTemplateMap = Map<string, TemplateLoader>
type TemplateLoader = () => Promise<{ default: TemplateType }>
type ChapterModule = { default: Record<string, (number | string)[]> }

const GRADE_CHAPTER_REGEX = /grade-(\d+)\/chapter-(\d+)\.ts$/

export const generateModuleTemplateMap = async () => {
  const modules = import.meta.glob('/src/modules/tasks/ui/grades/**/*.ts')
  const map: ModuleTemplateMap = new Map()

  for (const path of Object.keys(modules)) {
    const match = path.match(GRADE_CHAPTER_REGEX)
    if (!match) continue

    const [, grade, chapter] = match

    const moduleLoader = modules[path]
    const module = (await moduleLoader()) as ChapterModule
    const config = Object.entries(module.default)

    for (const [type, taskIds] of config) {
      taskIds.forEach((taskNum) => {
        const templateLoader = TEMPLATE_MAP[type as keyof typeof TEMPLATE_MAP]

        const key = `${grade}_${chapter}_${taskNum}`
        map.set(key, templateLoader)
      })
    }
  }

  return map
}
