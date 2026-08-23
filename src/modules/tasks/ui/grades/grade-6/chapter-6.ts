import { TemplateTypes } from '../../../model/template-types.ts'

/**
 * These 2 tasks live in grade-4 lessons (chapterId 137, MathEducator UI),
 * but their Elixir type is `Task_6_6_*` — content reused from grade 6
 * without a renumbered type. availableTasks keys off that embedded type
 * id (grade-N/chapter-M folder digits), not the real session grade, so
 * they must be mapped here to become available in the grade-4 lesson.
 */
const map = {
  [TemplateTypes.Test.Plain]: ['1_2', '1_3'],
}

export default map
