import clsx from 'clsx'
import React, { useId } from 'react'

import styles from './radio-button.module.scss'

interface Props {
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const RadioButton = ({
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
}: Props) => {
  const id = useId()

  return (
    <label
      className={clsx(styles.radioButton, checked && styles.checked)}
      htmlFor={id}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.radioInput}
      />
      <span className={styles.radioLabel}>{label}</span>
    </label>
  )
}
