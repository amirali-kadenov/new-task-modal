import clsx from 'clsx'
import type { Ref } from 'react'

import { Skeleton } from '@/ui/skeleton/skeleton'

import styles from './keyboard.module.scss'
import { MAIN } from './model/symbols/main'

interface Props {
  ref?: Ref<HTMLDivElement>
  className?: string
}

export const CalculatorSkeleton = ({ ref, className }: Props) => {
  return (
    <div ref={ref} className={className}>
      <div className={clsx(styles.keyboard, styles.main)}>
        {MAIN.map((key) => (
          <Skeleton key={key.title} className={styles.mainKey} />
        ))}
      </div>
      <Skeleton className={styles.paginationSkeleton} />
    </div>
  )
}
