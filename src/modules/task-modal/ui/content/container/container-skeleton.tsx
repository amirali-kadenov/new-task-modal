import clsx from 'clsx'

import { Skeleton } from '@/ui/skeleton/skeleton'

import s from './container.module.scss'

interface Props {
  className?: string
}

export const ContainerSkeleton = ({ className }: Props) => {
  return (
    <div className={clsx(s.container, className)}>
      <Skeleton className={s.textSkeleton} />

      <Skeleton className={s.inputSkeleton} />
    </div>
  )
}
