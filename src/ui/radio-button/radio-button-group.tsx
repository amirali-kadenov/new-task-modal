import clsx from 'clsx'

import { RadioButton } from './radio-button'
import styles from './radio-button-group.module.scss'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  name: string
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  /** Non-interactive group with default look (no gray, no hover). */
  readOnly?: boolean
  className?: string
  ariaLabel?: string
}

export const RadioButtonGroup = ({
  name,
  options,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className,
  ariaLabel,
}: Props) => {
  return (
    <div
      className={clsx(styles.container, className)}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <RadioButton
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          disabled={disabled || option.disabled}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}
