/**
 * Trainer launch URL builder for the e2e suite. Mirrors
 * `buildTrainerLaunchUrls` in
 * `src/modules/tasks/ui/templates/text/lib/storybook/trainer-launch-links.tsx`,
 * duplicated here (instead of imported) so this Playwright project stays
 * free of the app's `@/*` path-alias / Vite resolution setup.
 */

export const LAUNCH_BASE = process.env.LAUNCH_BASE ?? 'http://localhost:8888'

export interface TrainerLaunch {
  chapterId: string
  lessonId: string
  taskIndex: number
  grade?: number
}

export const buildLaunchUrl = (launch: TrainerLaunch, old = false): string => {
  const q = new URLSearchParams()
  q.set('grade', String(launch.grade ?? 4))
  q.set('chapterId', launch.chapterId)
  q.set('lessonId', launch.lessonId)
  q.set('taskIndex', String(launch.taskIndex))
  if (old) q.set('old', 'true')

  return `${LAUNCH_BASE}/?${q.toString()}`
}
