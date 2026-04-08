import clsx from 'clsx'

import { Skeleton } from '@/ui/skeleton/skeleton'

import s from './message.module.scss'

interface Props {
  isFromPupil?: boolean
}

export const MessageSkeleton = ({ isFromPupil }: Props) => {
  return (
    <div
      className={clsx(
        s.message,
        s.skeletonMessage,
        isFromPupil ? s.messageFromPupil : s.messageFromOther,
      )}
    >
      {!isFromPupil && <Skeleton className={s.skeletonTextHeader} />}

      <div className={s.skeletonMessageText}>
        {/* <Skeleton className={clsx(s.skeletonText, s.skeletonTextFirst)} /> */}
        <Skeleton className={s.skeletonText} />
      </div>

      <Skeleton className={s.skeletonMessageTime} />
    </div>
  )
}
