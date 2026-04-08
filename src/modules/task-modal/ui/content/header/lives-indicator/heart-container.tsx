import HeartIcon from '@/assets/icons/header/heart.svg'

import styles from './heart-container.module.scss'

export const HeartContainer = ({ heartCount }: { heartCount: number }) => {
  return (
    <div className={styles.heartContainer}>
      <span className={styles.heartCount}>{heartCount}</span>
      <HeartIcon />
    </div>
  )
}
