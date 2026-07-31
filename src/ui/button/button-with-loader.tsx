import clsx from 'clsx'

import { Loader } from '../loader/loader'

import { Button, type ButtonProps } from './button'
import styles from './button-with-loader.module.scss'
import buttonStyles from './button.module.scss'

interface Props extends ButtonProps {
  isLoading: boolean
}

export const ButtonWithLoader = ({
  isLoading,
  children,
  className,
  disabled,
  ...props
}: Props) => {
  return (
    <Button
      className={clsx(
        className,
        isLoading && styles.isLoading,
        isLoading && buttonStyles.loading,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      <span className={clsx(isLoading && styles.labelHidden)}>{children}</span>
      {isLoading && (
        <span className={styles.loaderWrap}>
          <Loader variant="white" />
        </span>
      )}
    </Button>
  )
}
