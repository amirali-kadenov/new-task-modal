import clsx from 'clsx'
import type { ComponentProps, JSX } from 'react'

import { Input } from './input'
import s from './input-with-icons.module.scss'

interface Props extends ComponentProps<'input'> {
  leftIcon?: JSX.Element
  rightIcon?: JSX.Element
  containerClassName?: string
}

export const InputWithIcons = ({
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  ...props
}: Props) => {
  return (
    <div className={clsx(s.container, containerClassName)}>
      {leftIcon && <div className={s.leftIcon}>{leftIcon}</div>}

      <Input
        className={clsx(
          className,
          leftIcon && s.withLeftIcon,
          rightIcon && s.withRightIcon,
        )}
        {...props}
      />

      {rightIcon && <div className={s.rightIcon}>{rightIcon}</div>}
    </div>
  )
}
