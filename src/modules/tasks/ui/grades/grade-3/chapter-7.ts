import { TemplateTypes } from '../../../model/template-types.ts'

/**
 * These 3 tasks live in grade-4 lessons (chapterId 133, MathEducator UI),
 * but their Elixir type is `Task_3_7_*` — content reused from grade 3
 * without a renumbered type. availableTasks keys off that embedded type
 * id (grade-N/chapter-M folder digits), not the real session grade, so
 * they must be mapped here to become available in the grade-4 lesson.
 */
const map = {
  [TemplateTypes.Text.After]: ['9_11', '10_3', '4_6'],
}

export default map
