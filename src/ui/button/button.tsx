import clsx from 'clsx'
import { type ButtonHTMLAttributes } from 'react'

import styles from './button.module.scss'

export enum ButtonColor {
  Gray = 'gray',
  Blue = 'blue',
  White = 'white',
}

export enum ButtonLayout {
  Icon = 'icon',
  Text = 'text',
}

export enum ButtonSize {
  Small = 'small',
  SizeIcon = 'sizeIcon',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor
  layout?: ButtonLayout
  size?: ButtonSize
}

export const Button = ({
  children,
  className,
  color = ButtonColor.Blue,
  layout = ButtonLayout.Text,
  type = 'button',
  size,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[color],
        styles[layout],
        size && styles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
