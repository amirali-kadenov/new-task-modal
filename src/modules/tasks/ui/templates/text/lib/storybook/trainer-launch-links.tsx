import type { CSSProperties, ReactNode } from 'react'

/** Overridden at build time via `VITE_LAUNCH_BASE` (see `build-storybook:deploy`). */
export const LAUNCH_BASE = (
  import.meta.env.VITE_LAUNCH_BASE || 'http://localhost:8888'
).replace(/\/$/, '')

export type TrainerLaunch = {
  chapterId: string
  lessonId: string
  taskIndex: number
  grade?: number
}

export const buildTrainerLaunchUrls = (launch: TrainerLaunch) => {
  const q = new URLSearchParams()
  q.set('grade', String(launch.grade ?? 4))
  q.set('chapterId', launch.chapterId)
  q.set('lessonId', launch.lessonId)
  q.set('taskIndex', String(launch.taskIndex))

  const launchUrl = `${LAUNCH_BASE}/?${q.toString()}`
  q.set('old', 'true')
  const launchOldUrl = `${LAUNCH_BASE}/?${q.toString()}`

  return { launchUrl, launchOldUrl }
}

const linkStyle: CSSProperties = {
  fontSize: 13,
  color: '#2563eb',
  textDecoration: 'underline',
}

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  marginBottom: 12,
  flexWrap: 'wrap',
}

interface TrainerLaunchLinksProps {
  launch?: TrainerLaunch | null
  /** Optional row class (e.g. toolbar); falls back to default inline row. */
  className?: string
}

/** Links to open the sample task in the new / old trainer. */
export const TrainerLaunchLinks = ({
  launch,
  className,
}: TrainerLaunchLinksProps) => {
  if (!launch?.chapterId || !launch?.lessonId || launch.taskIndex == null) {
    return null
  }

  const { launchUrl, launchOldUrl } = buildTrainerLaunchUrls(launch)

  return (
    <div className={className} style={className ? undefined : rowStyle}>
      <a href={launchUrl} target="_blank" rel="noreferrer" style={linkStyle}>
        Новый тренажёр
      </a>
      <a href={launchOldUrl} target="_blank" rel="noreferrer" style={linkStyle}>
        Старый тренажёр
      </a>
    </div>
  )
}

/** Wraps story content with launch links above when coords are present. */
export const withTrainerLaunchLinks = (
  launch: TrainerLaunch | null | undefined,
  children: ReactNode,
) => (
  <div>
    <TrainerLaunchLinks launch={launch} />
    {children}
  </div>
)
