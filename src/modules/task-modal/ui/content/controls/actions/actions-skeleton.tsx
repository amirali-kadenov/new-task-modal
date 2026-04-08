import clsx from 'clsx'
import type { Ref } from 'react'

import { Skeleton } from '@/ui/skeleton/skeleton'

import s from './actions.module.scss'

interface Props {
  ref?: Ref<HTMLDivElement>
}

export const TaskModalActionsSkeleton = ({ ref }: Props) => {
  const buttonStyles = clsx(s.button, s.fluid, s.rounded)

  return (
    <div ref={ref} className={s.container}>
      <Skeleton className={clsx(buttonStyles, s.secondary)} />
      <Skeleton className={clsx(buttonStyles, s.secondary)} />
      <Skeleton className={clsx(buttonStyles, s.primary)} />
    </div>
  )
}
