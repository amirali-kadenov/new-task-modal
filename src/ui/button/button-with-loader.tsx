import clsx from 'clsx'

import { Loader } from '../loader/loader'

import { Button, ButtonLayout, type ButtonProps } from './button'
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
      layout={isLoading ? ButtonLayout.Icon : props.layout}
      className={clsx(className, isLoading && buttonStyles.loading)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader className={styles.loader} /> : children}
    </Button>
  )
}
