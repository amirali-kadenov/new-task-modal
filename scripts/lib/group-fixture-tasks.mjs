/**
 * Maps a structural group context list to OpenInTrainer fixture entries.
 * Shared by generate-*-template-groups.mjs scripts.
 * Dedupes by taskId (keeps first launch for each id).
 */
export function mapGroupTasks(groupContexts, grade = 4) {
  const seen = new Set()
  const out = []
  for (const ctx of groupContexts || []) {
    const id = ctx.taskId
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push({
      id,
      launch: {
        grade,
        chapterId: String(ctx.chapterId),
        lessonId: String(ctx.lessonId),
        taskIndex: ctx.taskIndex,
      },
    })
  }
  return out
}

/**
 * Maps group contexts to full fixtures for All Tasks stories.
 * Keeps unique taskId and enriches each task with withSolution().
 */
export function mapGroupTasksWithBodies(
  groupContexts,
  withSolution,
  grade = 4,
) {
  const seen = new Set()
  const out = []
  for (const ctx of groupContexts || []) {
    const id = ctx.taskId
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push({
      id,
      launch: {
        grade,
        chapterId: String(ctx.chapterId),
        lessonId: String(ctx.lessonId),
        taskIndex: ctx.taskIndex,
      },
      task: withSolution(ctx.task),
    })
  }
  return out
}
