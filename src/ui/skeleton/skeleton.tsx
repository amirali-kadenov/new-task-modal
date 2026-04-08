import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

import styles from './skeleton.module.scss'

export const Skeleton = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div {...props} className={clsx(styles.skeleton, props.className)} />
}
