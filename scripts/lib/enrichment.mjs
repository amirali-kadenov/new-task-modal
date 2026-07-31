import fs from 'node:fs'
import path from 'node:path'

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function indexByTaskId(dump) {
  const byId = new Map()
  if (!dump?.chapters) return byId
  for (const chapter of dump.chapters) {
    for (const task of chapter.tasks || []) {
      if (task?.id) byId.set(task.id, task)
    }
  }
  return byId
}

/**
 * Load video enrichment maps from a snapshot directory.
 * Supports modern (`task_videos.json`) and grade-4 alias filenames.
 */
export function loadEnrichmentMaps(snapshotDir) {
  const videosPathCandidates = [
    path.join(snapshotDir, 'task_videos.json'),
    path.join(snapshotDir, 'task_videos_grade_4.json'),
  ]

  const videosPath = videosPathCandidates.find((p) => fs.existsSync(p))
  const videosDump = videosPath ? readJsonIfExists(videosPath) : null

  if (!videosDump) {
    console.warn(
      `[enrichment] no task_videos.json in ${snapshotDir} — fixtures will omit videoUrl until stats-server regenerate`,
    )
  }

  return {
    videosById: indexByTaskId(videosDump),
    videosPath: videosPath || null,
  }
}

/**
 * Merge video fields from enrichment maps onto a task body.
 * Always sets hint1/hint2 to null: InvokeTask.hint / `def hint/2` is absent for
 * grade-4 (and almost all primary) tasks — do not synthesize from solution.parts.
 */
export function withEnrichment(task, enrichment) {
  if (!task?.id || !enrichment) return task

  const next = { ...task }
  next.hint1 = null
  next.hint2 = null

  const video = enrichment.videosById?.get(task.id)
  if (video) {
    if (video.videoId != null) next.videoId = video.videoId
    if (video.videoUrl != null) next.videoUrl = video.videoUrl
    if (video.videoUrlAsTranslation != null) {
      next.videoUrlAsTranslation = video.videoUrlAsTranslation
    }
    if (video.locatedCountry != null) next.locatedCountry = video.locatedCountry
  }

  return next
}
